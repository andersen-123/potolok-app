import React, { useState, useEffect } from 'react';

function EditableRow({ row, index, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    name: row.B || '',
    unit: row.C || '',
    quantity: row.D || 0,
    price: row.E || 0,
    note: row.G || ''
  });

  useEffect(() => {
    // Автофокус на первое поле при редактировании
    document.querySelector('.editable-row input')?.focus();
  }, []);

  const handleSave = () => {
    const updatedRow = { ...row };
    updatedRow.B = formData.name.trim();
    updatedRow.C = formData.unit;
    updatedRow.D = parseFloat(formData.quantity) || 0;
    updatedRow.E = parseFloat(formData.price) || 0;
    updatedRow.G = formData.note.trim();
    updatedRow.F = updatedRow.D * updatedRow.E;
    
    onSave(updatedRow, index);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <tr className="editable-row table-warning">
      <td>{index + 1}</td>
      <td>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="form-control form-control-sm"
          placeholder="Наименование работы/материала"
          onKeyDown={handleKeyDown}
        />
      </td>
      <td>
        <select 
          value={formData.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
          className="form-select form-select-sm"
        >
          <option value="м²">м²</option>
          <option value="м.п.">м.п.</option>
          <option value="шт.">шт.</option>
          <option value="компл.">компл.</option>
          <option value="у.е.">у.е.</option>
          <option value="день">день</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          className="form-control form-control-sm"
          step="0.01"
          min="0"
          onKeyDown={handleKeyDown}
        />
      </td>
      <td>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          className="form-control form-control-sm"
          step="0.01"
          min="0"
          onKeyDown={handleKeyDown}
        />
      </td>
      <td className="fw-bold">
        {(formData.quantity * formData.price).toLocaleString('ru-RU')}
      </td>
      <td>
        <input
          type="text"
          value={formData.note}
          onChange={(e) => handleChange('note', e.target.value)}
          className="form-control form-control-sm"
          placeholder="Примечание, артикул, цвет и т.д."
          onKeyDown={handleKeyDown}
        />
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <button onClick={handleSave} className="btn btn-success" title="Сохранить">
            ✓
          </button>
          <button onClick={onCancel} className="btn btn-secondary" title="Отмена">
            ✕
          </button>
          <button onClick={() => onDelete(index)} className="btn btn-danger" title="Удалить">
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
}

export default EditableRow;
