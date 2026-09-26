import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = async ({ certificateId, userName, workshopTitle, dateStr, outputPath }) => {
  return new Promise((resolve, reject) => {
    try {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Create PDF document (Landscape orientation)
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 40,
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Deep dark background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0B0C10');

      // Outer gold/cyan border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(3)
         .stroke('#7B61FF');

      // Inner thin border
      doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56)
         .lineWidth(1)
         .stroke('#45F3FF');

      // Header Branding
      doc.fillColor('#7B61FF')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('TECHBLITZ 2.0', 0, 70, { align: 'center' });

      doc.fillColor('#A0AEC0')
         .fontSize(12)
         .font('Helvetica')
         .text('COSMOS TECHNICAL CLUB • JABALPUR ENGINEERING COLLEGE', 0, 105, { align: 'center' });

      // Title
      doc.fillColor('#FFFFFF')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('CERTIFICATE OF PARTICIPATION', 0, 150, { align: 'center' });

      // Subtitle
      doc.fillColor('#CBD5E0')
         .fontSize(14)
         .font('Helvetica')
         .text('This is proudly presented to', 0, 190, { align: 'center' });

      // Participant Name
      doc.fillColor('#45F3FF')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text(userName.toUpperCase(), 0, 220, { align: 'center' });

      // Body text
      doc.fillColor('#E2E8F0')
         .fontSize(14)
         .font('Helvetica')
         .text('for successfully attending and completing the technical workshop', 0, 265, { align: 'center' });

      doc.fillColor('#FFFFFF')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text(`"${workshopTitle}"`, 0, 295, { align: 'center' });

      doc.fillColor('#A0AEC0')
         .fontSize(12)
         .font('Helvetica')
         .text(`Conducted on ${dateStr}`, 0, 335, { align: 'center' });

      // Certificate ID & Verification URL
      doc.fillColor('#7B61FF')
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(`Certificate ID: ${certificateId}`, 0, 365, { align: 'center' });

      // Signatures Area
      const sigY = 440;
      doc.strokeColor('#4A5568').lineWidth(1);

      // Left Signature (Coordinator)
      doc.moveTo(150, sigY).lineTo(320, sigY).stroke();
      doc.fillColor('#CBD5E0')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Event Coordinator', 150, sigY + 10, { width: 170, align: 'center' });
      doc.fillColor('#718096')
         .fontSize(10)
         .font('Helvetica')
         .text('COSMOS / JEC', 150, sigY + 26, { width: 170, align: 'center' });

      // Right Signature (Speaker)
      doc.moveTo(520, sigY).lineTo(690, sigY).stroke();
      doc.fillColor('#CBD5E0')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Workshop Speaker', 520, sigY + 10, { width: 170, align: 'center' });
      doc.fillColor('#718096')
         .fontSize(10)
         .font('Helvetica')
         .text('TechBlitz 2.0', 520, sigY + 26, { width: 170, align: 'center' });

      doc.end();

      writeStream.on('finish', () => {
        resolve({ success: true, outputPath });
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
