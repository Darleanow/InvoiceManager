// app/api/generate-document/route.js
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.json();

    // Load the docx file as binary content
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'invoice_template_1.docx'
    );
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
      console.error(error);
      return NextResponse.json(
        { error: 'Error generating document' },
        { status: 500 }
      );
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Return the .docx file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=document.docx',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
