const PDFDocument = require('pdfkit');

function buildPDF(dataCallback, endCallback, NID,vaccine_id, vac_name) {
  const doc = new PDFDocument({ bufferPages: true, font: 'Courier' });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  doc.fontSize(20).text(`Certificate for ${NID}`);

  doc
    .fontSize(12)
    .text(
      `${vac_name} was provided. Vaccine number: ${vaccine_id}`
    );
  doc.end();
}

module.exports = { buildPDF };