import { reports } from '../api/admin';

const MIME_BY_FORMAT = {
  JSON: 'application/json',
  CSV: 'text/csv;charset=utf-8',
  PDF: 'application/pdf',
  EXCEL: 'text/csv;charset=utf-8',
};

function extensionForFormat(format) {
  if (format === 'EXCEL') return 'csv';
  return (format || 'JSON').toLowerCase();
}

async function parseBlobError(blob) {
  try {
    const text = await blob.text();
    const json = JSON.parse(text);
    return json.error?.message || json.message || 'فشل تحميل التقرير';
  } catch {
    return 'فشل تحميل التقرير';
  }
}

/**
 * Download a completed report with correct MIME type so files open in Excel/PDF viewers.
 */
export async function downloadReportFile(report) {
  const response = await reports.download(report.id);
  const contentType = response.headers['content-type'] || '';

  if (contentType.includes('application/json') && !(response.data instanceof Blob && response.data.type?.includes('pdf'))) {
    const message = await parseBlobError(response.data);
    throw new Error(message);
  }

  const ext = extensionForFormat(report.format);
  const mime = MIME_BY_FORMAT[report.format] || response.headers['content-type'] || 'application/octet-stream';
  const blob = new Blob([response.data], { type: mime });

  const safeName = (report.name || 'report').replace(/[^\w\u0600-\u06FF.\- ]+/g, '_').trim() || 'report';
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${safeName}.${ext}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
