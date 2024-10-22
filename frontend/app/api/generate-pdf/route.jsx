// app/api/generate-pdf/route.js
import { NextResponse } from 'next/server';
import docxWasm from 'docx-wasm';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.json();

    // Generate the .docx buffer
    const docxBuffer = await generateDocxBuffer(formData);

    // Initialize docx-wasm
    await docxWasm.init();

    // Convert .docx buffer to PDF buffer
    const pdfBuffer = await docxWasm.convertToPdf(docxBuffer);

    // Return the PDF file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=document.pdf',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error converting document to PDF' },
      { status: 500 }
    );
  }
}

// Utility function to generate .docx buffer
async function generateDocxBuffer(formData) {
  const templatePath = path.join(process.cwd(), 'templates', 'template.docx');
  const content = fs.readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.setData(formData);

  try {
    // Render the document
    doc.render();
  } catch (error) {
    throw new Error('Error generating document');
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });
  return buffer;
}
