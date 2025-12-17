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
        
        // Валидация структуры данных
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

// Синхронизация с IndexedDB
export function initDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('IndexedDB не поддерживается');
      resolve(null);
      return;
    }
    
    const request = indexedDB.open('PotolokDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Создаем хранилище для расчетов
      if (!db.objectStoreNames.contains('calculations')) {
        const store = db.createObjectStore('calculations', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      
      // Создаем хранилище для прайсов
      if (!db.objectStoreNames.contains('prices')) {
        const store = db.createObjectStore('prices', { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Сохранение расчета в IndexedDB
export async function saveCalculation(calculation) {
  try {
    const db = await initDatabase();
    if (!db) return false;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['calculations'], 'readwrite');
      const store = transaction.objectStore('calculations');
      
      const record = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...calculation
      };
      
      const request = store.add(record);
      
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error('Ошибка сохранения в базу данных:', error);
    return false;
  }
}

// Загрузка истории расчетов
export async function loadCalculations() {
  try {
    const db = await initDatabase();
    if (!db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['calculations'], 'readonly');
      const store = transaction.objectStore('calculations');
      const index = store.index('date');
      
      const request = index.getAll();
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Ошибка загрузки из базы данных:', error);
    return [];
  }
}
