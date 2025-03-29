/**
 * Utility functions for importing and exporting files in the application
 */

// Generate CSV content from data
export function generateCSV<T extends Record<string, any>>(data: T[], columns: { key: keyof T, header: string }[]): string {
  // Create header row
  const headerRow = columns.map(col => `"${col.header}"`).join(',');
  
  // Create data rows
  const dataRows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      // Ensure strings with commas are properly quoted
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value !== undefined && value !== null ? String(value) : '';
    }).join(',');
  });
  
  // Combine all rows
  return [headerRow, ...dataRows].join('\n');
}

// Export data as CSV file
export function exportToCSV<T extends Record<string, any>>(
  data: T[], 
  columns: { key: keyof T, header: string }[],
  filename: string
): void {
  const csvContent = generateCSV(data, columns);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export data as Excel file
export function exportToExcel<T extends Record<string, any>>(
  data: T[], 
  columns: { key: keyof T, header: string }[],
  filename: string,
  sheetName: string = 'Sheet1'
): void {
  // For better Excel support, we're using CSV with UTF-8 BOM
  // This makes Excel recognize the UTF-8 encoding properly
  const csvContent = '\ufeff' + generateCSV(data, columns);
  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Parse CSV data into an array of objects
export function parseCSV<T>(csvData: string, headerMap: Record<string, keyof T>): T[] {
  const lines = csvData.split('\n');
  if (lines.length < 2) return [];
  
  // Parse headers
  const headers = parseCSVLine(lines[0]);
  
  // Map CSV data to objects
  const result: T[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const obj = {} as T;
    
    // Map each value to the corresponding property
    headers.forEach((header, index) => {
      const key = headerMap[header];
      if (key && index < values.length) {
        (obj as any)[key] = values[index];
      }
    });
    
    result.push(obj);
  }
  
  return result;
}

// Helper function to parse a CSV line respecting quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Check if it's an escaped quote
      if (i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip the next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
}

// Import data from a file
export function importFromFile<T>(
  file: File, 
  headerMap: Record<string, keyof T>,
  onSuccess: (data: T[]) => void,
  onError: (error: string) => void
): void {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const fileContent = e.target?.result as string;
      if (!fileContent) {
        onError('Failed to read file');
        return;
      }
      
      // Parse the file
      let data: T[];
      if (file.name.endsWith('.csv')) {
        data = parseCSV<T>(fileContent, headerMap);
      } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        // For Excel files, we're treating them as CSV since we don't have a full Excel parser
        data = parseCSV<T>(fileContent, headerMap);
      } else {
        onError('Unsupported file format. Please use CSV or Excel file.');
        return;
      }
      
      onSuccess(data);
    } catch (error) {
      onError(`Error parsing file: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  reader.onerror = () => {
    onError('Error reading file');
  };
  
  reader.readAsText(file);
}