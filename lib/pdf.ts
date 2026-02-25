import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PdfOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

export function generateReportPdf({ title, subtitle, headers, rows, filename }: PdfOptions) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(99, 102, 241); // indigo
  doc.text('FinanceHub', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 140);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 28);

  // Title
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 50);
  doc.text(title, 14, 40);

  if (subtitle) {
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 140);
    doc.text(subtitle, 14, 47);
  }

  // Table
  autoTable(doc, {
    startY: subtitle ? 54 : 48,
    head: [headers],
    body: rows.map((r) => r.map(String)),
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 70] },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 170);
    doc.text(`FinanceHub — Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(filename);
}
