export function exportCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((value) => {
    const cell = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
    return `"${cell.replaceAll('"', '""')}"`;
  }).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
