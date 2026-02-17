import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

/** DataURL -> bytes (stable) */
async function dataUrlToBytes(dataUrl) {
  const res = await fetch(dataUrl);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
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

// Wrap text by words into multiple lines (best-effort)
function wrapText(font, text, size, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (textWidth(font, size, test) <= maxWidth) line = test;
    else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawCentered(page, font, size, text, y, color) {
  const { width } = page.getSize();
  const w = textWidth(font, size, text);
  page.drawText(String(text || ""), { x: (width - w) / 2, y, size, font, color });
}

function drawGoldSeal(page, x, y, r) {
  page.drawCircle({
    x, y, size: r,
    color: rgb(0.93, 0.78, 0.26),
    borderColor: rgb(0.74, 0.55, 0.14),
    borderWidth: 2,
  });
  page.drawCircle({
    x, y, size: r * 0.82,
    color: rgb(0.98, 0.88, 0.35),
    borderColor: rgb(0.80, 0.62, 0.17),
    borderWidth: 1,
  });
  page.drawCircle({
    x: x - r * 0.18,
    y: y + r * 0.18,
    size: r * 0.22,
    color: rgb(1, 0.97, 0.78),
    opacity: 0.55,
  });
}

function fmtDateTime(d) {
  try {
    const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
    return dt.toLocaleString();
  } catch {
    return String(d || "");
  }
}

function safe(v, fallback = "") {
  const s = String(v ?? "").trim();
  return s || fallback;
}

/**
 * PREMIUM MINIMAL CERTIFICATE (NO DETAILS PANEL)
 */
export async function createCertificatePdfBytes({
  // required
  name,
  courseTitle,
  certNo,
  issuedAt,
  verifyUrl,
  hash,

  // issuer + people
  issuerOrg = "EMC Lab",
  issuerDept = "EMC Academy",
  trainingFormat = "Online formatda", // faqat meta blokda ishlatamiz (xohlasang olib tashlaymiz)
  directorName = "Abdurashidov Davron",
  instructorName = "Reyimbayev Xushnud",

  // duration (meta blokda)
  durationLabel = "2 hafta", // "1 hafta" | "2 hafta" | "1 oy"
  hours = "—",
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // landscape A4-ish
  const { width, height } = page.getSize();

  // Fonts
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontSerifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  // Palette
  const red = rgb(0.78, 0.06, 0.08);
  const redDark = rgb(0.62, 0.03, 0.05);
  const ink = rgb(0.10, 0.10, 0.10);
  const gray = rgb(0.35, 0.35, 0.35);
  const border = rgb(0.72, 0.74, 0.78);

  // Background white
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // Premium frame
  page.drawRectangle({
    x: 22, y: 22,
    width: width - 44,
    height: height - 44,
    borderWidth: 2,
    borderColor: border,
  });
  page.drawRectangle({
    x: 34, y: 34,
    width: width - 68,
    height: height - 68,
    borderWidth: 1,
    borderColor: rgb(0.86, 0.88, 0.92),
  });

  // Corner accents
  page.drawRectangle({ x: width - 230, y: height - 120, width: 230, height: 120, color: red });
  page.drawRectangle({ x: 0, y: 0, width: 320, height: 130, color: redDark });

  // Seal
  drawGoldSeal(page, 86, height - 86, 34);

  // Header
  drawCentered(page, fontBold, 44, "CERTIFICATE", height - 140, redDark);
  drawCentered(page, font, 16, "of Completion", height - 170, rgb(0.20, 0.20, 0.20));
  drawCentered(
    page,
    font,
    11,
    `${safe(issuerOrg)} / ${safe(issuerDept)} · Electromagnetic Compatibility Training Platform`,
    height - 192,
    rgb(0.35, 0.35, 0.35)
  );

  // Content safe zone (center)
  const contentX = 80;
  const contentW = width - 160;

  // Presented to
  drawCentered(page, font, 11, "This certificate is presented to", height - 230, rgb(0.30, 0.30, 0.30));

  // Name (big, auto-fit)
  const nm = safe(name, "Participant");
  const nameSize = fitText(fontSerifItalic, nm, contentW - 40, 58, 24);
  drawCentered(page, fontSerifItalic, nameSize, nm, height - 300, ink);

  // Completion line
  drawCentered(page, font, 12, "for successfully completing the course", height - 330, rgb(0.25, 0.25, 0.25));

  // Course title (wrap max 2 lines)
  const ct = safe(courseTitle, "Course Title");
  let courseSize = fitText(fontBold, ct, contentW - 60, 24, 14);
  let lines = wrapText(fontBold, ct, courseSize, contentW - 60);

  while (lines.length > 2 && courseSize > 14) {
    courseSize -= 1;
    lines = wrapText(fontBold, ct, courseSize, contentW - 60);
  }
  lines = lines.slice(0, 2);

  let cy = height - 380;
  for (const line of lines) {
    drawCentered(page, fontBold, courseSize, line, cy, ink);
    cy -= (courseSize + 8);
  }

  // --- Bottom LEFT meta (red box) ---
  const issuedStr = fmtDateTime(issuedAt);

  const metaX = 36;
  const metaY = 40;
  const metaW = 360;
  const metaH = 92;

  page.drawRectangle({
    x: metaX,
    y: metaY,
    width: metaW,
    height: metaH,
    color: rgb(0.86, 0.10, 0.12),
    opacity: 0.95,
  });

  page.drawText(`Certificate No: ${safe(certNo, "—")}`, {
    x: metaX + 14,
    y: metaY + 62,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Issued: ${issuedStr}`, {
    x: metaX + 14,
    y: metaY + 42,
    size: 10.5,
    font,
    color: rgb(1, 1, 1),
  });

  // ixtiyoriy: muddat/format/soat — faqat meta ichida (agar xohlamasang olib tashlayman)
  const extra = `Muddat: ${durationLabel}  |  Format: ${trainingFormat}  |  Soat: ${hours}`;
  const extraSize = fitText(font, extra, metaW - 28, 9.2, 7.2);
  page.drawText(extra, {
    x: metaX + 14,
    y: metaY + 26,
    size: extraSize,
    font,
    color: rgb(1, 1, 1),
    opacity: 0.92,
  });

  if (hash) {
    const hs = `Hash: ${hash}`;
    const hsSize = fitText(font, hs, metaW - 28, 9.0, 7.0);
    page.drawText(hs, {
      x: metaX + 14,
      y: metaY + 10,
      size: hsSize,
      font,
      color: rgb(1, 1, 1),
      opacity: 0.85,
    });
  }

  // verify URL tiny (optional)
  if (verifyUrl) {
    const u = safe(verifyUrl, "");
    const uSize = fitText(font, u, width - 120, 8.5, 6.5);
    page.drawText(u, {
      x: 60,
      y: 30,
      size: uSize,
      font,
      color: rgb(0.55, 0.55, 0.60),
    });
  }

  // --- Bottom RIGHT QR (separate, clean) ---
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 7 });
  const qrBytes = await dataUrlToBytes(qrDataUrl);
  const qrImage = await pdf.embedPng(qrBytes);

  const qrSize = 140;
  const qrBoxW = qrSize + 26;
  const qrBoxH = qrSize + 38;
  const qrBoxX = width - qrBoxW - 60;
  const qrBoxY = 56;

  page.drawRectangle({
    x: qrBoxX,
    y: qrBoxY,
    width: qrBoxW,
    height: qrBoxH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.88, 0.90, 0.94),
    borderWidth: 1,
  });

  page.drawText("VERIFY ONLINE", {
    x: qrBoxX + 18,
    y: qrBoxY + qrBoxH - 20,
    size: 9,
    font: fontBold,
    color: rgb(0.30, 0.30, 0.30),
  });

  page.drawImage(qrImage, {
    x: qrBoxX + 13,
    y: qrBoxY + 10,
    width: qrSize,
    height: qrSize,
  });

  // --- Signatures (center bottom, clean) ---
  const sigY = 155;
  const leftX1 = 180;
  const leftX2 = 380;
  const rightX1 = width - 380;
  const rightX2 = width - 180;

  page.drawLine({ start: { x: leftX1, y: sigY }, end: { x: leftX2, y: sigY }, thickness: 1, color: gray, opacity: 0.65 });
  page.drawLine({ start: { x: rightX1, y: sigY }, end: { x: rightX2, y: sigY }, thickness: 1, color: gray, opacity: 0.65 });

  // Left signature (Instructor)
  {
    const n = safe(instructorName, "Instructor");
    const r = "Instructor (EMC Academy)";
    const nSize = fitText(fontBold, n, 260, 11, 9);
    const nW = textWidth(fontBold, nSize, n);
    page.drawText(n, { x: (leftX1 + leftX2) / 2 - nW / 2, y: sigY - 22, size: nSize, font: fontBold, color: ink });

    const rW = textWidth(font, 9, r);
    page.drawText(r, { x: (leftX1 + leftX2) / 2 - rW / 2, y: sigY - 36, size: 9, font, color: gray });
  }

  // Right signature (Director)
  {
    const n = safe(directorName, "Director");
    const r = "Director (EMC Lab)";
    const nSize = fitText(fontBold, n, 260, 11, 9);
    const nW = textWidth(fontBold, nSize, n);
    page.drawText(n, { x: (rightX1 + rightX2) / 2 - nW / 2, y: sigY - 22, size: nSize, font: fontBold, color: ink });

    const rW = textWidth(font, 9, r);
    page.drawText(r, { x: (rightX1 + rightX2) / 2 - rW / 2, y: sigY - 36, size: 9, font, color: gray });
  }

  return await pdf.save();
}

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
