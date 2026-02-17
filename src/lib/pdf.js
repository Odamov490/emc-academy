import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

function toPngBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export async function createCertificatePdfBytes({
  name,
  courseTitle,
  certNo,
  issuedAt,
  verifyUrl,
  hash
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // landscape A4-ish points
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Background
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderWidth: 2, borderColor: rgb(0.1, 0.1, 0.12) });
  page.drawRectangle({ x: 36, y: 36, width: width - 72, height: height - 72, borderWidth: 1, borderColor: rgb(0.7, 0.7, 0.75) });

  // Title
  page.drawText('CERTIFICATE', {
    x: 60,
    y: height - 110,
    size: 42,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.12)
  });

  page.drawText('EMC Academy', {
    x: 60,
    y: height - 145,
    size: 18,
    font,
    color: rgb(0.25, 0.25, 0.3)
  });

  // Name
  page.drawText('This certifies that', {
    x: 60,
    y: height - 210,
    size: 16,
    font,
    color: rgb(0.25, 0.25, 0.3)
  });

  page.drawText(name, {
    x: 60,
    y: height - 255,
    size: 32,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.12)
  });

  page.drawText('has successfully completed', {
    x: 60,
    y: height - 290,
    size: 16,
    font,
    color: rgb(0.25, 0.25, 0.3)
  });

  // Course
  const courseSize = courseTitle.length > 48 ? 18 : 22;
  page.drawText(courseTitle, {
    x: 60,
    y: height - 330,
    size: courseSize,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.12)
  });

  // Meta
  page.drawText(`Certificate No: ${certNo}`, {
    x: 60,
    y: 110,
    size: 13,
    font,
    color: rgb(0.25, 0.25, 0.3)
  });
  page.drawText(`Issued at: ${new Date(issuedAt).toLocaleString()}`, {
    x: 60,
    y: 90,
    size: 13,
    font,
    color: rgb(0.25, 0.25, 0.3)
  });
  page.drawText(`Hash: ${hash}`, {
    x: 60,
    y: 70,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.45)
  });

  // QR
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 6 });
  const qrBytes = toPngBytes(qrDataUrl);
  const qrImage = await pdf.embedPng(qrBytes);
  const qrSize = 140;
  page.drawImage(qrImage, { x: width - qrSize - 70, y: 70, width: qrSize, height: qrSize });
  page.drawText('Verify', {
    x: width - qrSize - 70,
    y: 55,
    size: 12,
    font,
    color: rgb(0.25, 0.25, 0.3)
  });

  // Signature lines
  page.drawText('Instructor', { x: width - 320, y: 140, size: 12, font, color: rgb(0.25, 0.25, 0.3) });
  page.drawLine({ start: { x: width - 320, y: 125 }, end: { x: width - 70, y: 125 }, thickness: 1, color: rgb(0.7, 0.7, 0.75) });

  const bytes = await pdf.save();
  return bytes;
}

export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
