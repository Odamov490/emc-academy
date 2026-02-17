import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

/**
 * Stable: DataURL -> bytes (atob emas)
 */
async function dataUrlToBytes(dataUrl) {
  const res = await fetch(dataUrl);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function textWidth(font, size, text) {
  return font.widthOfTextAtSize(String(text || ""), size);
}

function fitText(font, text, maxWidth, startSize, minSize = 10) {
  let size = startSize;
  const s = String(text || "");
  while (size > minSize && textWidth(font, size, s) > maxWidth) size -= 1;
  return size;
}

function drawCentered(page, font, size, text, y, color) {
  const { width } = page.getSize();
  const w = textWidth(font, size, text);
  page.drawText(String(text || ""), { x: (width - w) / 2, y, size, font, color });
}

function drawLabelValue(page, { x, y, label, value, font, fontBold, size = 11, gap = 70, color = rgb(0.12,0.12,0.12) }) {
  page.drawText(label, { x, y, size, font, color: rgb(0.35, 0.35, 0.35) });
  page.drawText(String(value ?? ""), { x: x + gap, y, size, font: fontBold, color });
}

/**
 * Gold seal (no images)
 */
function drawGoldSeal(page, x, y, r) {
  page.drawCircle({
    x, y, size: r,
    color: rgb(0.93, 0.78, 0.26),
    borderColor: rgb(0.74, 0.55, 0.14),
    borderWidth: 2
  });
  page.drawCircle({
    x, y, size: r * 0.82,
    color: rgb(0.98, 0.88, 0.35),
    borderColor: rgb(0.80, 0.62, 0.17),
    borderWidth: 1
  });
  // highlight
  page.drawCircle({
    x: x - r * 0.18,
    y: y + r * 0.18,
    size: r * 0.22,
    color: rgb(1, 0.97, 0.78),
    opacity: 0.55
  });
}

/**
 * Watermark (diagonal, light)
 */
function drawWatermark(page, fontBold, text) {
  const { width, height } = page.getSize();
  const mark = String(text || "EMC ACADEMY");
  // pdf-lib rotation uses radians
  const rotation = Math.PI / 8; // ~22.5°
  page.drawText(mark, {
    x: 120,
    y: height / 2 - 20,
    size: 56,
    font: fontBold,
    color: rgb(0.92, 0.93, 0.95),
    rotate: { type: "radians", angle: rotation },
    opacity: 0.35
  });
}

/**
 * Nice date format
 */
function fmtDateTime(d) {
  try {
    const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
    return dt.toLocaleString();
  } catch {
    return String(d || "");
  }
}

function safeStr(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s || fallback;
}

/**
 * PREMIUM CERTIFICATE PDF (landscape A4-ish 842x595)
 * Parametrlar:
 * - name, courseTitle, certNo, issuedAt, verifyUrl, hash
 * Qo'shimcha:
 * - issuerOrg, issuerDept, issuedBy, instructor, durationText, hours, periodFrom, periodTo, score, level, standardRef
 * - signLeftName/signLeftRole/signRightName/signRightRole
 */
export async function createCertificatePdfBytes({
  // required
  name,
  courseTitle,
  certNo,
  issuedAt,
  verifyUrl,
  hash,

  // premium fields
  issuerOrg = "EMC Lab / EMC Academy",
  issuerDept = "Electromagnetic Compatibility Training Platform",
  issuedBy = "EMC Academy Administration",
  instructor = "Instructor: EMC Lab Team",
  durationText = "Duration: 1 month",
  hours = "Total: 24 hours",
  periodFrom = "",
  periodTo = "",
  score = "",
  level = "",
  standardRef = "",

  // signatures
  signLeftName = "Authorized Signature",
  signLeftRole = "TRAINING SUPERVISOR",
  signRightName = "Director",
  signRightRole = "EMC ACADEMY"
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // landscape
  const { width, height } = page.getSize();

  // Fonts
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontSerifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const fontSerif = await pdf.embedFont(StandardFonts.TimesRoman);

  // Palette
  const red = rgb(0.78, 0.06, 0.08);
  const redDark = rgb(0.62, 0.03, 0.05);
  const ink = rgb(0.10, 0.10, 0.10);
  const gray = rgb(0.35, 0.35, 0.35);
  const border = rgb(0.72, 0.74, 0.78);

  // Base white background
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // Watermark
  drawWatermark(page, fontBold, "EMC ACADEMY");

  // Premium frame
  page.drawRectangle({
    x: 22, y: 22,
    width: width - 44,
    height: height - 44,
    borderWidth: 2,
    borderColor: border
  });
  page.drawRectangle({
    x: 34, y: 34,
    width: width - 68,
    height: height - 68,
    borderWidth: 1,
    borderColor: rgb(0.86, 0.88, 0.92)
  });

  // Corner accents (no polygon)
  // Top-right block
  page.drawRectangle({ x: width - 230, y: height - 120, width: 230, height: 120, color: red });
  // Thin strip under top-right block
  page.drawRectangle({ x: width - 320, y: height - 18, width: 320, height: 18, color: rgb(0.95, 0.95, 0.96) });

  // Bottom-left block
  page.drawRectangle({ x: 0, y: 0, width: 320, height: 130, color: redDark });

  // Gold seal (top-left)
  drawGoldSeal(page, 86, height - 86, 34);

  // Header text
  drawCentered(page, fontBold, 44, "CERTIFICATE", height - 140, redDark);
  drawCentered(page, font, 16, "of Completion", height - 170, rgb(0.20, 0.20, 0.20));

  // Issuer line (small, centered)
  const issuerLine = `${safeStr(issuerOrg)} · ${safeStr(issuerDept)}`;
  drawCentered(page, font, 11, issuerLine, height - 192, rgb(0.35, 0.35, 0.35));

  // Presented to
  drawCentered(page, font, 11, "This certificate is presented to", height - 225, rgb(0.30, 0.30, 0.30));

  // Name (script-like)
  const nm = safeStr(name, "Participant");
  const nameMaxW = width - 200;
  const nameSize = fitText(fontSerifItalic, nm, nameMaxW, 56, 26);
  drawCentered(page, fontSerifItalic, nameSize, nm, height - 290, ink);

  // Completed line
  drawCentered(page, font, 12, "for successfully completing the course", height - 320, rgb(0.25, 0.25, 0.25));

  // Course title (bold, fit)
  const ct = safeStr(courseTitle, "Course Title");
  const courseMaxW = width - 220;
  const courseSize = fitText(fontBold, ct, courseMaxW, 22, 13);
  drawCentered(page, fontBold, courseSize, ct, height - 360, ink);

  // Optional: standard reference / level / score
  const subParts = [
    level ? `Level: ${level}` : "",
    score !== "" ? `Score: ${score}` : "",
    standardRef ? `Ref: ${standardRef}` : ""
  ].filter(Boolean);
  if (subParts.length) {
    drawCentered(page, font, 10.5, subParts.join("   •   "), height - 386, rgb(0.38, 0.38, 0.38));
  }

  // Right info box (premium details)
  const boxX = width - 330;
  const boxY = 150;
  const boxW = 276;
  const boxH = 190;

  page.drawRectangle({
    x: boxX, y: boxY,
    width: boxW, height: boxH,
    color: rgb(0.98, 0.98, 0.99),
    borderColor: rgb(0.90, 0.91, 0.94),
    borderWidth: 1
  });

  page.drawText("DETAILS", { x: boxX + 16, y: boxY + boxH - 24, size: 11, font: fontBold, color: rgb(0.25,0.25,0.25) });
  page.drawLine({
    start: { x: boxX + 16, y: boxY + boxH - 32 },
    end: { x: boxX + boxW - 16, y: boxY + boxH - 32 },
    thickness: 1,
    color: rgb(0.90, 0.91, 0.94)
  });

  const dtIssued = fmtDateTime(issuedAt);
  const dur = safeStr(durationText, "Duration: —");
  const hrs = safeStr(hours, "Total: —");
  const pr = periodFrom && periodTo ? `${periodFrom} → ${periodTo}` : (periodFrom || periodTo || "");

  let yy = boxY + boxH - 52;
  const row = (label, value) => {
    drawLabelValue(page, {
      x: boxX + 16,
      y: yy,
      label,
      value,
      font,
      fontBold,
      size: 10.5,
      gap: 80,
      color: rgb(0.14, 0.14, 0.14)
    });
    yy -= 18;
  };

  row("Cert No:", certNo);
  row("Issued:", dtIssued);
  row("Issued by:", issuedBy);
  row("Instructor:", instructor);
  row("Duration:", dur.replace(/^Duration:\s*/i, ""));
  row("Hours:", hrs.replace(/^Total:\s*/i, ""));
  if (pr) row("Period:", pr);

  // QR (bottom-right)
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 7 });
  const qrBytes = await dataUrlToBytes(qrDataUrl);
  const qrImage = await pdf.embedPng(qrBytes);

  const qrSize = 118;
  const qrX = width - qrSize - 78;
  const qrY = 70;

  page.drawRectangle({
    x: qrX - 10,
    y: qrY - 10,
    width: qrSize + 20,
    height: qrSize + 28,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.88, 0.90, 0.94),
    borderWidth: 1
  });
  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  page.drawText("VERIFY ONLINE", {
    x: qrX + 12,
    y: qrY + qrSize + 6,
    size: 9,
    font: fontBold,
    color: rgb(0.30, 0.30, 0.30)
  });

  // Bottom-left meta box on red background
  const metaX = 36;
  const metaY = 40;
  const metaW = 300;
  const metaH = 84;

  page.drawRectangle({
    x: metaX,
    y: metaY,
    width: metaW,
    height: metaH,
    color: rgb(0.86, 0.10, 0.12),
    opacity: 0.95
  });

  page.drawText(`Certificate No: ${certNo}`, { x: metaX + 14, y: metaY + 54, size: 11, font: fontBold, color: rgb(1,1,1) });
  page.drawText(`Issued: ${dtIssued}`, { x: metaX + 14, y: metaY + 34, size: 10.5, font, color: rgb(1,1,1) });

  if (hash) {
    const hs = String(hash);
    const hashSize = fitText(font, `Hash: ${hs}`, metaW - 28, 9.5, 7);
    page.drawText(`Hash: ${hs}`, { x: metaX + 14, y: metaY + 16, size: hashSize, font, color: rgb(1,1,1), opacity: 0.9 });
  }

  // Signatures
  const sigY = 120;
  const leftX1 = 170;
  const leftX2 = 370;
  const rightX1 = width - 370;
  const rightX2 = width - 170;

  page.drawLine({ start: { x: leftX1, y: sigY }, end: { x: leftX2, y: sigY }, thickness: 1, color: gray, opacity: 0.65 });
  page.drawLine({ start: { x: rightX1, y: sigY }, end: { x: rightX2, y: sigY }, thickness: 1, color: gray, opacity: 0.65 });

  const leftNameW = textWidth(fontBold, 11, signLeftName);
  page.drawText(signLeftName, { x: (leftX1 + leftX2) / 2 - leftNameW / 2, y: sigY - 22, size: 11, font: fontBold, color: ink });
  const leftRoleW = textWidth(font, 9, signLeftRole);
  page.drawText(signLeftRole, { x: (leftX1 + leftX2) / 2 - leftRoleW / 2, y: sigY - 36, size: 9, font, color: gray });

  const rightNameW = textWidth(fontBold, 11, signRightName);
  page.drawText(signRightName, { x: (rightX1 + rightX2) / 2 - rightNameW / 2, y: sigY - 22, size: 11, font: fontBold, color: ink });
  const rightRoleW = textWidth(font, 9, signRightRole);
  page.drawText(signRightRole, { x: (rightX1 + rightX2) / 2 - rightRoleW / 2, y: sigY - 36, size: 9, font, color: gray });

  // Small footer URL (verifyUrl short)
  const footerY = 30;
  const footerText = safeStr(verifyUrl, "");
  if (footerText) {
    const ftSize = fitText(font, footerText, width - 120, 8.5, 6.5);
    page.drawText(footerText, { x: 60, y: footerY, size: ftSize, font, color: rgb(0.55,0.55,0.60) });
  }

  const bytes = await pdf.save();
  return bytes;
}

/**
 * Download helper (popup blockerga chidamli)
 */
export function downloadBytes(bytes, filename = "certificate.pdf") {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const w = window.open(url, "_blank");
  if (!w) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
