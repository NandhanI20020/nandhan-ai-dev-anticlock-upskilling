import type { DealListItem } from '../../../shared/types/deal';

export function downloadCsv(rows: Record<string, string>[], filename: string): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers, ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`))].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function exportToCsv(deals: DealListItem[], filename: string): void {
  const headers = ['Title', 'Value', 'Currency', 'Stage', 'Organization', 'Owner', 'Expected Close Date', 'Status', 'Created Date'];
  const rows = deals.map((d) => [
    d.title,
    String(d.value),
    d.currency,
    d.stageName,
    d.orgName ?? '',
    d.ownerName,
    d.expectedCloseDate ?? '',
    d.status,
    d.createdAt.slice(0, 10),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
