import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import HTMLtoDOCX from 'html-to-docx';
import { getInvoiceStyles } from '@/styles/_templates/getInvoiceStyles';

export async function POST(req) {
  const { html, format, data } = await req.json();

  const invoiceStyles = getInvoiceStyles();

  console.log('html:', html);
  const styledHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: Arial, sans-serif;
          background-color: #1f1f23;
          color: #fff;
          padding: 20px;
        }
          ${invoiceStyles}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  try {
    if (format === 'pdf') {
      const browser = await puppeteer.launch({
        headless: 'new',
      });
      const page = await browser.newPage();

      await page.setViewport({ width: 900, height: 1200 });
      await page.setContent(styledHTML, {
        waitUntil: 'networkidle0',
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
        preferCSSPageSize: true,
      });

      await browser.close();

      return new NextResponse(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=invoice-${Date.now()}.pdf`,
        },
      });
    } else if (format === 'docx') {
      const docxStyles = styledHTML
        .replace(/<style>/, '<style type="text/css">')
        .replace(
          'background-color: #1f1f23;',
          'background-color: #1f1f23 !important;'
        );

      const docx = await HTMLtoDOCX(docxStyles, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
        margins: { top: 0, right: 0, bottom: 0, left: 0 },
        font: 'Arial',
      });

      return new NextResponse(docx, {
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename=invoice-${Date.now()}.docx`,
        },
      });
    }
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}
