import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

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

// Simple wrap by words (best-effort)
function wrapText(font, text, size, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (textWidth(font, size, test) <= maxWidth) {
      line = test;
    } else {
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

export async function createCertificatePdfBytes({
  // required
  name,
  courseTitle,
  certNo,
  issuedAt,
  verifyUrl,
  hash,

  // branding / issuer
  issuerOrg = "EMC Lab",
  issuerDept = "EMC Academy",
  trainingFormat = "Online formatda",

  // people
  directorName = "Abdurashidov Davron",
  instructorName = "Reyimbayev Xushnud",

  // duration
  durationLabel = "2 hafta", // "1 hafta" | "2 hafta" | "1 oy"
  hours = "—",

  // optional
  level = "",
  score = "",
  standardRef = "",
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // landscape A4-ish
  const { width, height } = page.getSize();

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

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // Frame
  page.drawRectangle({
    x: 22, y: 22, width: width - 44, height: height - 44,
    borderWidth: 2, borderColor: border
  });
  page.drawRectangle({
    x: 34, y: 34, width: width - 68, height: height - 68,
    borderWidth: 1, borderColor: rgb(0.86, 0.88, 0.92)
  });

  // Corner accents (no polygon)
  page.drawRectangle({ x: width - 230, y: height - 120, width: 230, height: 120, color: red });
  page.drawRectangle({ x: 0, y: 0, width: 320, height: 130, color: redDark });

  // Seal
  drawGoldSeal(page, 86, height - 86, 34);

  // Header
  drawCentered(page, fontBold, 44, "CERTIFICATE", height - 140, redDark);
  drawCentered(page, font, 16, "of Completion", height - 170, rgb(0.20, 0.20, 0.20));

  // Issuer line
  drawCentered(
    page,
    font,
    11,
    `${safe(issuerOrg)} / ${safe(issuerDept)} · Electromagnetic Compatibility Training Platform`,
    height - 192,
    rgb(0.35, 0.35, 0.35)
  );

  // Safe layout zones:
  // Left content area (keeps away from right details box)
  const leftX = 70;
  const leftW = width - 70 - 360; // right panel reserved
  const centerX = leftX + leftW / 2;

  // Presented line
  {
    const t = "This certificate is presented to";
    const size = 11;
    const w = textWidth(font, size, t);
    page.drawText(t, { x: centerX - w / 2, y: height - 230, size, font, color: rgb(0.30, 0.30, 0.30) });
  }

  // Name (auto-fit to leftW)
  const nm = safe(name, "Participant");
  const nameSize = fitText(fontSerifItalic, nm, leftW, 56, 24);
  {
    const w = textWidth(fontSerifItalic, nameSize, nm);
    page.drawText(nm, { x: centerX - w / 2, y: height - 295, size: nameSize, font: fontSerifItalic, color: ink });
  }

  // Completion line
  {
    const t = "for successfully completing the course";
    const size = 12;
    const w = textWidth(font, size, t);
    page.drawText(t, { x: centerX - w / 2, y: height - 325, size, font, color: rgb(0.25, 0.25, 0.25) });
  }

  // Course title (wrap to 2 lines max)
  const ct = safe(courseTitle, "Course Title");
  let courseSize = fitText(fontBold, ct, leftW, 22, 13);
  let lines = wrapText(fontBold, ct, courseSize, leftW);

  // if too many lines, reduce font until <=2 lines
  while (lines.length > 2 && courseSize > 13) {
    courseSize -= 1;
    lines = wrapText(fontBold, ct, courseSize, leftW);
  }
  // still many lines? cut after 2
  lines = lines.slice(0, 2);

  let cy = height - 370;
  for (const line of lines) {
    const w = textWidth(fontBold, courseSize, line);
    page.drawText(line, { x: centerX - w / 2, y: cy, size: courseSize, font: fontBold, color: ink });
    cy -= (courseSize + 6);
  }

  // Optional small row: level/score/ref
  const subParts = [
    durationLabel ? `Muddat: ${durationLabel}` : "",
    trainingFormat ? `Format: ${trainingFormat}` : "",
    level ? `Level: ${level}` : "",
    score ? `Score: ${score}` : "",
    standardRef ? `Ref: ${standardRef}` : "",
  ].filter(Boolean);

  if (subParts.length) {
    const line = subParts.join("   •   ");
    const s = fitText(font, line, leftW, 10.5, 8);
    const w = textWidth(font, s, line);
    page.drawText(line, { x: centerX - w / 2, y: cy - 6, size: s, font, color: rgb(0.38, 0.38, 0.38) });
  }

  // RIGHT DETAILS PANEL (anchored lower so it never collides with name/course)
  const boxW = 300;
  const boxH = 210;
  const boxX = width - boxW - 60;
  const boxY = 210; // pastroqda: overlap bo‘lmaydi

  page.drawRectangle({
    x: boxX, y: boxY, width: boxW, height: boxH,
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

  const issuedStr = fmtDateTime(issuedAt);

  const detailRows = [
    ["Cert No:", certNo],
    ["Issued:", issuedStr],
    ["Organization:", `${issuerOrg} / ${issuerDept}`],
    ["Director:", directorName],
    ["Instructor:", instructorName],
    ["Format:", trainingFormat],
    ["Duration:", durationLabel],
    ["Hours:", hours],
  ];

  let yy = boxY + boxH - 54;
  for (const [k, v] of detailRows) {
    page.drawText(k, { x: boxX + 16, y: yy, size: 10.5, font, color: gray });
    const val = safe(v, "—");
    const valSize = fitText(fontBold, val, boxW - 120, 10.5, 8.5);
    page.drawText(val, { x: boxX + 100, y: yy, size: valSize, font: fontBold, color: ink });
    yy -= 18;
  }

  // QR BLOCK (bottom-right, separate box)
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 7 });
  const qrBytes = await dataUrlToBytes(qrDataUrl);
  const qrImage = await pdf.embedPng(qrBytes);

  const qrSize = 130;
  const qrBoxW = qrSize + 26;
  const qrBoxH = qrSize + 38;
  const qrBoxX = width - qrBoxW - 60;
  const qrBoxY = 70;

  page.drawRectangle({
    x: qrBoxX,
    y: qrBoxY,
    width: qrBoxW,
    height: qrBoxH,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.88, 0.90, 0.94),
    borderWidth: 1
  });

  page.drawText("VERIFY ONLINE", {
    x: qrBoxX + 18,
    y: qrBoxY + qrBoxH - 20,
    size: 9,
    font: fontBold,
    color: rgb(0.30, 0.30, 0.30)
  });

  page.drawImage(qrImage, {
    x: qrBoxX + 13,
    y: qrBoxY + 10,
    width: qrSize,
    height: qrSize
  });

  // Bottom-left meta on red background
  const metaX = 36;
  const metaY = 40;
  const metaW = 340;
  const metaH = 88;

  page.drawRectangle({ x: metaX, y: metaY, width: metaW, height: metaH, color: rgb(0.86, 0.10, 0.12), opacity: 0.95 });

  page.drawText(`Certificate No: ${certNo}`, { x: metaX + 14, y: metaY + 58, size: 11, font: fontBold, color: rgb(1,1,1) });
  page.drawText(`Issued: ${issuedStr}`, { x: metaX + 14, y: metaY + 38, size: 10.5, font, color: rgb(1,1,1) });

  if (hash) {
    const hs = `Hash: ${hash}`;
    const hsSize = fitText(font, hs, metaW - 28, 9.2, 7.2);
    page.drawText(hs, { x: metaX + 14, y: metaY + 18, size: hsSize, font, color: rgb(1,1,1), opacity: 0.9 });
  }

  // Verify URL small (under meta, light)
  if (verifyUrl) {
    const u = safe(verifyUrl, "");
    const uSize = fitText(font, u, width - 120, 8.5, 6.5);
    page.drawText(u, { x: 60, y: 30, size: uSize, font, color: rgb(0.55, 0.55, 0.60) });
  }

  // Signatures (bottom center)
  const sigY = 130;
  const leftX1 = 170;
  const leftX2 = 370;
  const rightX1 = width - 370;
  const rightX2 = width - 170;

  page.drawLine({ start: { x: leftX1, y: sigY }, end: { x: leftX2, y: sigY }, thickness: 1, color: gray, opacity: 0.65 });
  page.drawLine({ start: { x: rightX1, y: sigY }, end: { x: rightX2, y: sigY }, thickness: 1, color: gray, opacity: 0.65 });

  // Left: Instructor
  {
    const n = instructorName;
    const r = "Instructor";
    const nw = textWidth(fontBold, 11, n);
    page.drawText(n, { x: (leftX1 + leftX2)/2 - nw/2, y: sigY - 22, size: 11, font: fontBold, color: ink });
    const rw = textWidth(font, 9, r);
    page.drawText(r, { x: (leftX1 + leftX2)/2 - rw/2, y: sigY - 36, size: 9, font, color: gray });
  }

  // Right: Director
  {
    const n = directorName;
    const r = "Director (EMC Lab)";
    const nw = textWidth(fontBold, 11, n);
    page.drawText(n, { x: (rightX1 + rightX2)/2 - nw/2, y: sigY - 22, size: 11, font: fontBold, color: ink });
    const rw = textWidth(font, 9, r);
    page.drawText(r, { x: (rightX1 + rightX2)/2 - rw/2, y: sigY - 36, size: 9, font, color: gray });
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
