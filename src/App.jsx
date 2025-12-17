import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import QuickEditPanel from './components/QuickEditPanel';
import { generatePDF } from './components/PDFGenerator';
import { exportToJSON, importFromJSON } from './utils/DataManager';
import { parseExcelFile } from './utils/ExcelParser';

function App() {
  const [tableData, setTableData] = useState([]);
  const [objectInfo, setObjectInfo] = useState({
    objectType: '',
    address: '',
    roomCount: '',
    area: 0,
    perimeter: 0,
    height: 0
  });
  const [editingMode, setEditingMode] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('basic');

  // Загрузка файла Excel
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const data = await parseExcelFile(file);
        setTableData(data.tableData);
        setObjectInfo(data.objectInfo);
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        alert('Ошибка при загрузке файла. Проверьте формат.');
      }
    }
  };

  // Сохранение в localStorage
  useEffect(() => {
    if (tableData.length > 0) {
      const saveData = {
        tableData,
        objectInfo,
        activeTemplate,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('potolokAppData', JSON.stringify(saveData));
    }
  }, [tableData, objectInfo, activeTemplate]);

  // Загрузка из localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('potolokAppData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTableData(parsedData.tableData || []);
        setObjectInfo(parsedData.objectInfo || {});
        setActiveTemplate(parsedData.activeTemplate || 'basic');
      } catch (e) {
        console.error('Ошибка загрузки сохранённых данных:', e);
      }
    }
  }, []);

  // Обработчики редактирования
  const handleEditRow = (index) => {
    setEditingRow(index);
  };

  const handleSaveRow = (updatedRow, index) => {
    const newData = [...tableData];
    newData[index] = updatedRow;
    setTableData(newData);
    setEditingRow(null);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
  };

  const handleDeleteRow = (index) => {
    if (window.confirm('Удалить эту позицию?')) {
      const newData = tableData.filter((row, i) => i !== index);
      setTableData(newData);
      setEditingRow(null);
    }
  };

  const handleAddRow = (newRow) => {
    setTableData([...tableData, {
      ...newRow,
      A: tableData.length + 1
    }]);
  };

  // QuickEditPanel handlers
  const handleAddCommonItem = (item) => {
    const newRow = {
      A: tableData.length + 1,
      B: item.name,
      C: item.unit,
      D: 1,
      E: item.price,
      F: item.price,
      G: ''
    };
    handleAddRow(newRow);
  };

  const handleUpdatePrice = (type, percent) => {
    const factor = type === 'increase' ? (1 + percent / 100) : (1 - percent / 100);
    const newData = tableData.map(row => {
      if (row.E && row.E > 0) {
        const newPrice = Math.round(row.E * factor);
        return {
          ...row,
          E: newPrice,
          F: (row.D || 0) * newPrice
        };
      }
      return row;
    });
    setTableData(newData);
  };

  // Генерация PDF
  const handleGeneratePDF = () => {
    generatePDF(objectInfo, tableData);
  };

  // Экспорт/импорт
  const handleExportJSON = () => {
    const data = { tableData, objectInfo };
    exportToJSON(data);
  };

  const handleImportJSON = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const data = await importFromJSON(file);
        setTableData(data.tableData || []);
        setObjectInfo(data.objectInfo || {});
        alert('Данные успешно загружены!');
      } catch (error) {
        console.error('Ошибка при импорте JSON:', error);
        alert('Ошибка при загрузке файла JSON');
      }
    }
  };

  const handleClearData = () => {
    if (window.confirm('Очистить все данные?')) {
      setTableData([]);
      setObjectInfo({
        objectType: '',
        address: '',
        roomCount: '',
        area: 0,
        perimeter: 0,
        height: 0
      });
      localStorage.removeItem('potolokAppData');
    }
  };

  // Расчет итого
  const total = tableData.reduce((sum, row) => sum + (parseFloat(row.F) || 0), 0);

  return (
    <div className="App container mt-3">
      <header className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3">🏠 PotolokForLife</h1>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => window.print()}>
              🖨 Печать
            </button>
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={handleClearData}
              title="Очистить все данные"
            >
              🗑
            </button>
          </div>
        </div>
        <p className="text-muted">Калькулятор натяжных потолков</p>
      </header>

      {/* Управление файлами */}
      <div className="card mb-3">
        <div className="card-header">Файлы</div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label">Загрузить Excel</label>
              <input 
                type="file" 
                accept=".xlsx,.xls" 
                onChange={handleFileUpload} 
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Импорт JSON</label>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportJSON} 
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Экспорт</label>
              <button className="btn btn-outline-primary w-100" onClick={handleExportJSON}>
                📥 Скачать JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Информация об объекте */}
      <div className="card mb-3">
        <div className="card-header">Информация об объекте</div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3">
              <label className="form-label">Объект</label>
              <input
                type="text"
                className="form-control"
                value={objectInfo.objectType}
                onChange={(e) => setObjectInfo({...objectInfo, objectType: e.target.value})}
                placeholder="Квартира, офис, дом"
              />
            </div>
            <div className="col-md-5">
              <label className="form-label">Адрес</label>
              <input
                type="text"
                className="form-control"
                value={objectInfo.address}
                onChange={(e) => setObjectInfo({...objectInfo, address: e.target.value})}
                placeholder="Адрес объекта"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Помещений</label>
              <input
                type="number"
                className="form-control"
                value={objectInfo.roomCount}
                onChange={(e) => setObjectInfo({...objectInfo, roomCount: e.target.value})}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Площадь, м²</label>
              <input
                type="number"
                className="form-control"
                value={objectInfo.area}
                onChange={(e) => setObjectInfo({...objectInfo, area: parseFloat(e.target.value) || 0})}
                step="0.01"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Периметр, м.п.</label>
              <input
                type="number"
                className="form-control"
                value={objectInfo.perimeter}
                onChange={(e) => setObjectInfo({...objectInfo, perimeter: parseFloat(e.target.value) || 0})}
                step="0.01"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Высота, м</label>
              <input
                type="number"
                className="form-control"
                value={objectInfo.height}
                onChange={(e) => setObjectInfo({...objectInfo, height: parseFloat(e.target.value) || 0})}
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Панель управления */}
      <div className="mb-3">
        <div className="btn-group" role="group">
          <button 
            className={`btn ${editingMode ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setEditingMode(!editingMode)}
          >
            {editingMode ? '✏️ Режим редактирования' : '📋 Только просмотр'}
          </button>
          <button 
            className="btn btn-success" 
            onClick={handleGeneratePDF}
            disabled={tableData.length === 0}
          >
            📄 Создать PDF
          </button>
          <button 
            className="btn btn-info" 
            onClick={() => navigator.clipboard.writeText(JSON.stringify({tableData, objectInfo}))}
            title="Копировать данные в буфер"
          >
            📋 Копировать
          </button>
        </div>
      </div>

      {/* Быстрое редактирование */}
      {editingMode && (
        <QuickEditPanel
          onAddCommonItem={handleAddCommonItem}
          onUpdatePrice={handleUpdatePrice}
        />
      )}

      {/* Таблица */}
      <div className="table-container">
        <Table
          data={tableData}
          editingMode={editingMode}
          editingRow={editingRow}
          onEditRow={handleEditRow}
          onSaveRow={handleSaveRow}
          onCancelEdit={handleCancelEdit}
          onDeleteRow={handleDeleteRow}
          onAddRow={handleAddRow}
        />
      </div>

      {/* Итого */}
      {tableData.length > 0 && (
        <div className="total-summary mt-4">
          <div className="row">
            <div className="col-md-6">
              <h4 className="text-success">
                Итого: <strong>{total.toLocaleString('ru-RU')} руб.</strong>
              </h4>
              <small className="text-muted">Предоплата 50%: {(total * 0.5).toLocaleString('ru-RU')} руб.</small>
            </div>
            <div className="col-md-6 text-end">
              <p className="text-muted mb-1">Последнее сохранение: {new Date().toLocaleTimeString('ru-RU')}</p>
              <p className="text-muted">Работает оффлайн ✓</p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-4 text-center text-muted small">
        <p>PotolokForLife © {new Date().getFullYear()} | Версия 1.0</p>
        <p>Приложение работает даже без интернета. Данные сохраняются автоматически.</p>
      </footer>
    </div>
  );
}

export default App;
