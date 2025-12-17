import React, { useState } from 'react';

function QuickEditPanel({ onAddCommonItem, onUpdatePrice }) {
  const [customItem, setCustomItem] = useState({
    name: '',
    unit: 'шт.',
    price: 0
  });

  const commonItems = [
    { name: 'Светильник встраиваемый', unit: 'шт.', price: 600 },
    { name: 'Люстра накладная', unit: 'шт.', price: 900 },
    { name: 'Вентилятор теневой', unit: 'шт.', price: 1200 },
    { name: 'Светодиодная лента', unit: 'м.п.', price: 300 },
    { name: 'Профиль гарпунный', unit: 'м.п.', price: 310 },
    { name: 'Полотно матовое', unit: 'м²', price: 610 },
  ];

  const handleAddCustom = () => {
    if (customItem.name.trim() && customItem.price > 0) {
      onAddCommonItem(customItem);
      setCustomItem({ name: '', unit: 'шт.', price: 0 });
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">Быстрые действия</div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <h6 className="mb-3">Часто используемые позиции:</h6>
            <div className="row g-2">
              {commonItems.map((item, idx) => (
                <div className="col-6 col-md-4" key={idx}>
                  <button
                    className="btn btn-outline-secondary w-100 text-start"
                    onClick={() => onAddCommonItem(item)}
                    title={`${item.name} - ${item.price} руб.`}
                  >
                    <small>
                      <strong>{item.name}</strong><br/>
                      {item.price} руб./{item.unit}
                    </small>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-md-4">
            <h6 className="mb-3">Своя позиция:</h6>
            <div className="mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Название"
                value={customItem.name}
                onChange={(e) => setCustomItem({...customItem, name: e.target.value})}
              />
            </div>
            <div className="row g-2 mb-2">
              <div className="col-6">
                <select 
                  className="form-select form-select-sm"
                  value={customItem.unit}
                  onChange={(e) => setCustomItem({...customItem, unit: e.target.value})}
                >
                  <option value="шт.">шт.</option>
                  <option value="м²">м²</option>
                  <option value="м.п.">м.п.</option>
                </select>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Цена"
                  value={customItem.price}
                  onChange={(e) => setCustomItem({...customItem, price: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm w-100"
              onClick={handleAddCustom}
              disabled={!customItem.name.trim() || customItem.price <= 0}
            >
              Добавить свою позицию
            </button>
          </div>
        </div>
        
        <hr className="my-3" />
        
        <div>
          <h6>Массовое изменение цен:</h6>
          <div className="btn-group" role="group">
            <button 
              className="btn btn-outline-success"
              onClick={() => onUpdatePrice('increase', 10)}
            >
              +10%
            </button>
            <button 
              className="btn btn-outline-warning"
              onClick={() => onUpdatePrice('decrease', 10)}
            >
              -10%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickEditPanel;
