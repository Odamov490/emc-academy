import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

function toPngBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function textWidth(font, size, text) {
  return font.widthOfTextAtSize(text, size);
}

function drawCenteredText(page, text, font, size, y, color) {
  const { width } = page.getSize();
  const w = textWidth(font, size, text);
  page.drawText(text, { x: (width - w) / 2, y, size, font, color });
}

function drawSeal(page, x, y, r) {
  // Gold seal (gradient yo'q, shuning uchun 3 qatlam)
  page.drawCircle({
    x,
    y,
    size: r,
    color: rgb(0.92, 0.74, 0.23),
    borderColor: rgb(0.75, 0.55, 0.12),
    borderWidth: 2,
  });
  page.drawCircle({
    x,
    y,
    size: r * 0.82,
    color: rgb(0.98, 0.86, 0.35),
    borderColor: rgb(0.80, 0.60, 0.15),
    borderWidth: 1,
  });
  page.drawCircle({
    x,
    y,
    size: r * 0.62,
    color: rgb(0.94, 0.78, 0.28),
  });
  // kichik highlight
  page.drawCircle({
    x: x - r * 0.18,
    y: y + r * 0.18,
    size: r * 0.22,
    color: rgb(1, 0.95, 0.75),
    opacity: 0.55,
  });
}

function drawCornerRibbons(page) {
  const { width, height } = page.getSize();
  const red1 = rgb(0.78, 0.06, 0.08); // deep red
  const red2 = rgb(0.90, 0.13, 0.15); // bright red
  const red3 = rgb(0.62, 0.03, 0.05); // darker

  // Top-right corner ribbons (triangles)
  // Big bright
  page.drawPolygon({
    points: [
      { x: width, y: height },
      { x: width - 210, y: height },
      { x: width, y: height - 140 },
    ],
    color: red2,
    opacity: 0.95,
  });
  // Dark overlay
  page.drawPolygon({
    points: [
      { x: width, y: height },
      { x: width - 140, y: height },
      { x: width, y: height - 95 },
    ],
    color: red3,
    opacity: 0.92,
  });
  // Mid ribbon
  page.drawPolygon({
    points: [
      { x: width - 120, y: height },
      { x: width - 250, y: height - 80 },
      { x: width, y: height - 210 },
      { x: width, y: height - 120 },
    ],
    color: red1,
    opacity: 0.85,
  });

  // Bottom-left corner ribbons
  // Big bright
  page.drawPolygon({
    points: [
      { x: 0, y: 0 },
      { x: 230, y: 0 },
      { x: 0, y: 160 },
    ],
    color: red2,
    opacity: 0.95,
  });
  // Dark overlay
  page.drawPolygon({
    points: [
      { x: 0, y: 0 },
      { x: 150, y: 0 },
      { x: 0, y: 105 },
    ],
    color: red3,
    opacity: 0.92,
  });
  // Mid ribbon
  page.drawPolygon({
    points: [
      { x: 0, y: 120 },
      { x: 0, y: 220 },
      { x: 210, y: 0 },
      { x: 120, y: 0 },
    ],
    color: red1,
    opacity: 0.85,
  });

  // Bottom-right subtle red strip (rasmga yaqin)
  page.drawPolygon({
    points: [
      { x: width - 320, y: 0 },
      { x: width, y: 0 },
      { x: width, y: 60 },
    ],
    color: red1,
    opacity: 0.55,
  });
}

function fitTextToWidth(font, text, maxWidth, startSize) {
  let size = startSize;
  while (size > 10 && textWidth(font, size, text) > maxWidth) size -= 1;
  return size;
}

export async function createCertificatePdfBytes({
  name,
  courseTitle,
  certNo,
  issuedAt,
  verifyUrl,
  hash,
  // ixtiyoriy: signature names
  signLeftName = "Isabel Mercado",
  signLeftRole = "SUPERVISOR",
  signRightName = "Adora Montminy",
  signRightRole = "VICE PRESIDENT",
}) {
  const pdf = await PDFDocument.create();

  // Landscape A4-ish
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();

  // Fonts
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontSerifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const fontSerif = await pdf.embedFont(StandardFonts.TimesRoman);

  // Base background (white)
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // Corner ribbons like sample
  drawCornerRibbons(page);

  // Thin light border
  page.drawRectangle({
    x: 18,
    y: 18,
    width: width - 36,
    height: height - 36,
    borderWidth: 1.2,
    borderColor: rgb(0.86, 0.88, 0.92),
  });

  // Gold seal (top-left)
  drawSeal(page, 80, height - 85, 36);

  // Header "CERTIFICATE" (center, red)
  const redTitle = rgb(0.62, 0.03, 0.05);
  drawCenteredText(page, "CERTIFICATE", fontBold, 44, height - 135, redTitle);

  drawCenteredText(page, "of appreciation", font, 16, height - 165, rgb(0.15, 0.15, 0.15));
  drawCenteredText(page, "is presented to :", font, 11, height - 188, rgb(0.25, 0.25, 0.25));

  // Name in script-like italic serif, centered
  const nameMaxW = width - 180;
  const nameSize = fitTextToWidth(fontSerifItalic, name, nameMaxW, 54);
  drawCenteredText(page, name, fontSerifItalic, nameSize, height - 265, rgb(0.08, 0.08, 0.08));

  // Body text
  const bodyText =
    "For successful completion of the training program";
  drawCenteredText(page, bodyText, font, 12, height - 315, rgb(0.20, 0.20, 0.20));

  // Course title (center)
  const courseMaxW = width - 220;
  const courseSize = fitTextToWidth(fontSerif, courseTitle, courseMaxW, 16);
  drawCenteredText(page, courseTitle, fontSerif, courseSize, height - 340, rgb(0.10, 0.10, 0.10));

  // Footer meta (small, left-bottom)
  const metaColor = rgb(0.30, 0.30, 0.30);
  page.drawText(`Certificate No: ${certNo}`, { x: 60, y: 70, size: 11, font, color: metaColor });
  page.drawText(`Issued: ${new Date(issuedAt).toLocaleString()}`, { x: 60, y: 54, size: 11, font, color: metaColor });

  // Hash (very small)
  if (hash) {
    page.drawText(`Hash: ${hash}`, { x: 60, y: 38, size: 8, font, color: rgb(0.45, 0.45, 0.45) });
  }

  // Signatures (bottom area like sample)
  const lineY = 120;
  const leftX1 = 170;
  const leftX2 = 360;
  const rightX1 = width - 360;
  const rightX2 = width - 170;

  page.drawLine({
    start: { x: leftX1, y: lineY },
    end: { x: leftX2, y: lineY },
    thickness: 1,
    color: rgb(0.25, 0.25, 0.25),
    opacity: 0.65,
  });
  page.drawLine({
    start: { x: rightX1, y: lineY },
    end: { x: rightX2, y: lineY },
    thickness: 1,
    color: rgb(0.25, 0.25, 0.25),
    opacity: 0.65,
  });

  // Left sign name + role
  const leftNameW = textWidth(fontBold, 11, signLeftName);
  page.drawText(signLeftName, {
    x: (leftX1 + leftX2) / 2 - leftNameW / 2,
    y: lineY - 22,
    size: 11,
    font: fontBold,
    color: rgb(0.12, 0.12, 0.12),
  });
  const leftRoleW = textWidth(font, 9, signLeftRole);
  page.drawText(signLeftRole, {
    x: (leftX1 + leftX2) / 2 - leftRoleW / 2,
    y: lineY - 36,
    size: 9,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  // Right sign name + role
  const rightNameW = textWidth(fontBold, 11, signRightName);
  page.drawText(signRightName, {
    x: (rightX1 + rightX2) / 2 - rightNameW / 2,
    y: lineY - 22,
    size: 11,
    font: fontBold,
    color: rgb(0.12, 0.12, 0.12),
  });
  const rightRoleW = textWidth(font, 9, signRightRole);
  page.drawText(signRightRole, {
    x: (rightX1 + rightX2) / 2 - rightRoleW / 2,
    y: lineY - 36,
    size: 9,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  // QR bottom-right (kichikroq, chiroyli)
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 6 });
  const qrBytes = toPngBytes(qrDataUrl);
  const qrImage = await pdf.embedPng(qrBytes);

  const qrSize = 110;
  const qrX = width - qrSize - 70;
  const qrY = 42;

  page.drawRectangle({
    x: qrX - 10,
    y: qrY - 10,
    width: qrSize + 20,
    height: qrSize + 28,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.88, 0.90, 0.94),
    borderWidth: 1,
  });

  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });

  page.drawText("VERIFY", {
    x: qrX + 26,
    y: qrY + qrSize + 6,
    size: 9,
    font: fontBold,
    color: rgb(0.25, 0.25, 0.25),
  });

  const bytes = await pdf.save();
  return bytes;
}

export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
