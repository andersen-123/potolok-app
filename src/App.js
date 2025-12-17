import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import QuickEditPanel from './components/QuickEditPanel';
import { generatePDF } from './components/PDFGenerator';

function App() {
  const [tableData, setTableData] = useState([]);
  const [objectInfo, setObjectInfo] = useState({
    objectType: 'Квартира',
    address: '',
    roomCount: '1',
    area: 0,
    perimeter: 0,
    height: 2.5
  });
  const [editingMode, setEditingMode] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    if (tableData.length > 0) {
      localStorage.setItem('potolokData', JSON.stringify({ tableData, objectInfo }));
    }
  }, [tableData, objectInfo]);

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('potolokData');
    if (saved) {
      const { tableData: savedData, objectInfo: savedInfo } = JSON.parse(saved);
      setTableData(savedData || []);
      setObjectInfo(savedInfo || {});
    }
  }, []);

  const total = tableData.reduce((sum, row) => sum + (parseFloat(row.F) || 0), 0);

  return (
    <div className="App container-fluid py-3">
      {/* Шапка */}
      <header className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 mb-1">🏠 PotolokForLife</h1>
            <p className="text-muted small mb-0">Калькулятор натяжных потолков</p>
          </div>
          {!isMobile && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingMode(!editingMode)}>
              {editingMode ? '✏️ Редактирование' : '👁 Просмотр'}
            </button>
          )}
        </div>
      </header>

      {/* Быстрые действия для мобильных */}
      {isMobile && (
        <div className="mb-3">
          <div className="btn-group w-100" role="group">
            <button className={`btn ${editingMode ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setEditingMode(!editingMode)}>
              {editingMode ? '✏️' : '👁'}
            </button>
            <button className="btn btn-success" onClick={() => generatePDF(objectInfo, tableData)}>
              📄 PDF
            </button>
            <button className="btn btn-info" onClick={() => window.print()}>
              🖨 Печать
            </button>
          </div>
        </div>
      )}

      {/* Блок информации об объекте */}
      <div className="card mb-3">
        <div className="card-header">📋 Информация об объекте</div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <input className="form-control form-control-sm mb-2" placeholder="Адрес"
                value={objectInfo.address} onChange={e => setObjectInfo({...objectInfo, address: e.target.value})} />
            </div>
            <div className="col-6 col-md-3">
              <input type="number" className="form-control form-control-sm mb-2" placeholder="Площадь, м²"
                value={objectInfo.area} onChange={e => setObjectInfo({...objectInfo, area: e.target.value})} />
            </div>
            <div className="col-6 col-md-3">
              <input type="number" className="form-control form-control-sm mb-2" placeholder="Периметр, м"
                value={objectInfo.perimeter} onChange={e => setObjectInfo({...objectInfo, perimeter: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      {/* Панель редактирования */}
      {editingMode && <QuickEditPanel />}

      {/* Таблица */}
      <div className="table-responsive">
        <Table data={tableData} editingMode={editingMode} />
      </div>

      {/* Итого */}
      {total > 0 && (
        <div className="mt-4 p-3 bg-light rounded border">
          <div className="row">
            <div className="col-6">
              <h5 className="text-success mb-1">💰 Итого:</h5>
              <h4 className="text-success">{total.toLocaleString('ru-RU')} руб.</h4>
            </div>
            <div className="col-6 text-end">
              <small className="text-muted d-block">Предоплата 50%:</small>
              <strong>{(total * 0.5).toLocaleString('ru-RU')} руб.</strong>
            </div>
          </div>
        </div>
      )}

      {/* Футер */}
      <footer className="mt-4 text-center text-muted small">
        <p className="mb-1">PotolokForLife © {new Date().getFullYear()}</p>
        <p className="mb-0">📱 Установите это приложение на телефон: меню → "Установить приложение"</p>
      </footer>
    </div>
  );
}

export default App;
