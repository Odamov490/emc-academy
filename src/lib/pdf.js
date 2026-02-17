import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

async function dataUrlToBytes(dataUrl) {
  const res = await fetch(dataUrl);
  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
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
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // OQ FON
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 1)
  });

  // QIZIL BURCHAK (pastki chap)
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 260,
    height: 120,
    color: rgb(0.8, 0.1, 0.1)
  });

  // QIZIL BURCHAK (yuqori o‘ng)
  page.drawRectangle({
    x: width - 260,
    y: height - 120,
    width: 260,
    height: 120,
    color: rgb(0.85, 0.05, 0.05)
  });

  // TASHQI RAMKA
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderWidth: 2,
    borderColor: rgb(0.6, 0.6, 0.6)
  });

  // TITLE
  page.drawText('CERTIFICATE', {
    x: 220,
    y: height - 120,
    size: 42,
    font: fontBold,
    color: rgb(0.6, 0, 0)
  });

  page.drawText('of Completion', {
    x: 320,
    y: height - 160,
    size: 18,
    font,
    color: rgb(0.3, 0.3, 0.3)
  });

  // NAME
  page.drawText(name, {
    x: 220,
    y: height - 260,
    size: 32,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  page.drawText('has successfully completed', {
    x: 260,
    y: height - 290,
    size: 14,
    font,
    color: rgb(0.3, 0.3, 0.3)
  });

  page.drawText(courseTitle, {
    x: 180,
    y: height - 330,
    size: 20,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2)
  });

  // META
  page.drawText(`Certificate No: ${certNo}`, {
    x: 60,
    y: 100,
    size: 12,
    font
  });

  page.drawText(`Issued: ${new Date(issuedAt).toLocaleString()}`, {
    x: 60,
    y: 80,
    size: 12,
    font
  });

  page.drawText(`Hash: ${hash}`, {
    x: 60,
    y: 60,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5)
  });

  // QR
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  const qrBytes = await dataUrlToBytes(qrDataUrl);
  const qrImage = await pdf.embedPng(qrBytes);

  page.drawImage(qrImage, {
    x: width - 180,
    y: 70,
    width: 120,
    height: 120
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
  document.body.appendChild(a);
  a.click();
  a.remove();
}
