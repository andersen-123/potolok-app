// Экспорт в JSON
export function exportToJSON(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `potolok-расчет-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Ошибка экспорта:', error);
    return false;
  }
}

// Импорт из JSON
export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Валидация
        if (!data.tableData || !Array.isArray(data.tableData)) {
          throw new Error('Неверный формат данных');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Ошибка парсинга JSON: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    
    reader.readAsText(file);
  });
}
