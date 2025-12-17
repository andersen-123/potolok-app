import React from 'react';

function Table({ data, editingMode }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        📝 Нет данных. Начните добавлять позиции.
      </div>
    );
  }

  return (
    <table className="table table-sm">
      <thead className="table-light">
        <tr>
          <th>№</th>
          <th>Наименование</th>
          <th>Ед.</th>
          <th>Кол-во</th>
          <th>Цена</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className={row.D > 0 ? 'table-active' : ''}>
            <td>{index + 1}</td>
            <td className="small">{row.B || '—'}</td>
            <td>{row.C || '—'}</td>
            <td><strong>{row.D || 0}</strong></td>
            <td>{row.E ? parseFloat(row.E).toLocaleString('ru-RU') : 0}</td>
            <td className="text-primary fw-bold">
              {row.F ? parseFloat(row.F).toLocaleString('ru-RU') : 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
