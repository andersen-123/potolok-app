import React from 'react';
import EditableRow from './EditableRow';

function Table({ 
  data, 
  editingMode, 
  editingRow, 
  onEditRow, 
  onSaveRow, 
  onCancelEdit, 
  onDeleteRow, 
  onAddRow 
}) {
  return (
    <>
      <table className="table table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th width="40">№</th>
            <th>Наименование</th>
            <th width="80">Ед.изм.</th>
            <th width="100">Кол-во</th>
            <th width="120">Цена, руб.</th>
            <th width="140">Сумма, руб.</th>
            <th>Примечание</th>
            {editingMode && <th width="100" className="no-print">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={editingMode ? 8 : 7} className="text-center text-muted py-4">
                Нет данных. Загрузите файл Excel или добавьте позиции вручную.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              editingRow === index ? (
                <EditableRow
                  key={`edit-${index}`}
                  row={row}
                  index={index}
                  onSave={onSaveRow}
                  onCancel={onCancelEdit}
                  onDelete={onDeleteRow}
                />
              ) : (
                <tr key={index} className={row.D > 0 ? 'table-active' : ''}>
                  <td>{index + 1}</td>
                  <td>{row.B || '—'}</td>
                  <td>{row.C || '—'}</td>
                  <td className={row.D > 0 ? 'fw-bold' : ''}>
                    {row.D ? parseFloat(row.D).toFixed(2) : '0'}
                  </td>
                  <td>{row.E ? parseFloat(row.E).toLocaleString('ru-RU') : '0'}</td>
                  <td className="fw-bold text-primary">
                    {row.F ? parseFloat(row.F).toLocaleString('ru-RU') : '0'}
                  </td>
                  <td className="text-muted small">{row.G || '—'}</td>
                  {editingMode && (
                    <td className="no-print">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => onEditRow(index)}
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onDeleteRow(index)}
                          title="Удалить"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            ))
          )}
        </tbody>
      </table>
      
      {editingMode && (
        <div className="text-center mb-4 no-print">
          <button
            className="btn btn-primary"
            onClick={() => {
              const newRow = {
                A: data.length + 1,
                B: 'Новая позиция',
                C: 'шт.',
                D: 0,
                E: 0,
                F: 0,
                G: ''
              };
              onAddRow(newRow);
            }}
          >
            ➕ Добавить позицию
          </button>
        </div>
      )}
    </>
  );
}

export default Table;
