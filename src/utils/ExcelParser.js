import * as XLSX from 'xlsx';

export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Берем первый лист
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Парсим данные
        const result = parseExcelData(jsonData);
        resolve(result);
      } catch (error) {
        reject(new Error('Ошибка парсинга Excel файла: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

function parseExcelData(data) {
  const result = {
    objectInfo: {
      objectType: '',
      address: '',
      roomCount: '',
      area: 0,
      perimeter: 0,
      height: 0
    },
    tableData: []
  };
  
  // Парсим информацию об объекте
  for (let i = 0; i < Math.min(data.length, 15); i++) {
    const row = data[i];
    if (row && row.length > 1) {
      const cell = String(row[0]).trim();
      const value = String(row[1] || '').trim();
      
      if (cell.includes('Обьект:')) {
        result.objectInfo.objectType = value;
      } else if (cell.includes('Адрес:')) {
        result.objectInfo.address = value;
      } else if (cell.includes('Помещений:')) {
        result.objectInfo.roomCount = value;
      } else if (cell === 'S:') {
        result.objectInfo.area = parseFloat(value) || 0;
      } else if (cell === 'P:') {
        result.objectInfo.perimeter = parseFloat(value) || 0;
      } else if (cell === 'h:') {
        result.objectInfo.height = parseFloat(value) || 0;
      }
    }
  }
  
  // Находим таблицу
  let tableStart = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i][0] === '№ п.п') {
      tableStart = i;
      break;
    }
  }
  
  if (tableStart !== -1) {
    for (let i = tableStart + 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 6) continue;
      
      if (String(row[1]).includes('Итого')) continue;
      
      const rowData = {
        A: i - tableStart,
        B: String(row[1] || '').trim(),
        C: String(row[2] || '').trim(),
        D: parseFloat(row[3]) || 0,
        E: parseFloat(row[4]) || 0,
        F: parseFloat(row[5]) || 0,
        G: String(row[6] || '').trim()
      };
      
      if (rowData.B && rowData.E > 0) {
        result.tableData.push(rowData);
      }
    }
  }
  
  return result;
}
