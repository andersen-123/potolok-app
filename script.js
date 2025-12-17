// Основные переменные
let selectedMaterials = {};
let selectedEquipment = {};
let calculationsHistory = [];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    renderMaterials();
    renderEquipment();
    updateHistory();
    
    // Автоматически считать при изменении
    document.getElementById('area').addEventListener('input', calculate);
    document.getElementById('system').addEventListener('change', function() {
        renderMaterials();
        calculate();
    });
});

// Отображение материалов
function renderMaterials() {
    const system = document.getElementById('system').value;
    const materials = systems[system].materials;
    const container = document.getElementById('materialsList');
    
    container.innerHTML = '';
    
    materials.forEach(material => {
        const qty = selectedMaterials[material.id] || 0;
        const div = document.createElement('div');
        div.className = 'material-item';
        div.innerHTML = `
            <div class="item-row">
                <div class="item-name">${material.name}</div>
                <div class="item-price">${material.price} ₽/${material.unit}</div>
            </div>
            <div class="item-controls">
                <button class="qty-btn" onclick="updateQty('material', ${material.id}, -1)">-</button>
                <input type="number" class="qty-input" value="${qty}" 
                       onchange="setQty('material', ${material.id}, this.value)"
                       data-id="${material.id}">
                <button class="qty-btn" onclick="updateQty('material', ${material.id}, 1)">+</button>
                <div style="margin-left: auto; font-weight: 600;">
                    ${(qty * material.price).toLocaleString('ru-RU')} ₽
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Отображение оборудования
function renderEquipment() {
    const container = document.getElementById('equipmentList');
    container.innerHTML = '';
    
    equipment.forEach(item => {
        const qty = selectedEquipment[item.id] || 0;
        const div = document.createElement('div');
        div.className = 'equipment-item';
        div.innerHTML = `
            <div class="item-row">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price} ₽/${item.unit}</div>
            </div>
            <div class="item-controls">
                <button class="qty-btn" onclick="updateQty('equipment', ${item.id}, -1)">-</button>
                <input type="number" class="qty-input" value="${qty}" 
                       onchange="setQty('equipment', ${item.id}, this.value)">
                <button class="qty-btn" onclick="updateQty('equipment', ${item.id}, 1)">+</button>
                <div style="margin-left: auto; font-weight: 600;">
                    ${(qty * item.price).toLocaleString('ru-RU')} ₽
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Управление количеством
function updateQty(type, id, delta) {
    const storage = type === 'material' ? selectedMaterials : selectedEquipment;
    const current = storage[id] || 0;
    const newValue = Math.max(0, current + delta);
    setQty(type, id, newValue);
}

function setQty(type, id, value) {
    const storage = type === 'material' ? selectedMaterials : selectedEquipment;
    storage[id] = parseFloat(value) || 0;
    
    // Обновить отображение
    const input = document.querySelector(`.qty-input[data-id="${id}"]`);
    if (input) {
        input.value = storage[id];
        
        // Обновить сумму
        const totalElement = input.parentNode.querySelector('div');
        if (totalElement) {
            const price = type === 'material' 
                ? systems[document.getElementById('system').value].materials.find(m => m.id === id).price
                : equipment.find(e => e.id === id).price;
            totalElement.textContent = (storage[id] * price).toLocaleString('ru-RU') + ' ₽';
        }
    }
    
    calculate();
    saveToStorage();
}

// Основной расчет
function calculate() {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const system = document.getElementById('system').value;
    
    if (!area || area <= 0) {
        showResult('Введите площадь помещения');
        return;
    }
    
    // Расчет материалов
    let materialsTotal = 0;
    let materialsList = [];
    
    systems[system].materials.forEach(material => {
        const qty = selectedMaterials[material.id] || 0;
        if (qty > 0) {
            const total = qty * material.price;
            materialsTotal += total;
            materialsList.push({
                name: material.name,
                qty: qty,
                unit: material.unit,
                price: material.price,
                total: total
            });
        }
    });
    
    // Расчет оборудования
    let equipmentTotal = 0;
    let equipmentList = [];
    
    equipment.forEach(item => {
        const qty = selectedEquipment[item.id] || 0;
        if (qty > 0) {
            const total = qty * item.price;
            equipmentTotal += total;
            equipmentList.push({
                name: item.name,
                qty: qty,
                unit: item.unit,
                price: item.price,
                total: total
            });
        }
    });
    
    // Итог
    const total = materialsTotal + equipmentTotal;
    const prepayment = total * 0.5;
    
    // Сохранить расчет
    const calculation = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        area: area,
        system: systems[system].name,
        materialsTotal: materialsTotal,
        equipmentTotal: equipmentTotal,
        total: total,
        prepayment: prepayment
    };
    
    calculationsHistory.unshift(calculation);
    if (calculationsHistory.length > 10) calculationsHistory.pop();
    
    // Показать результат
    showResult(calculation, materialsList, equipmentList);
    updateHistory();
    saveToStorage();
}

// Показать результат
function showResult(calc, materials, equipment) {
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');
    
    if (typeof calc === 'string') {
        resultContent.innerHTML = `<p style="color: #e74c3c;">${calc}</p>`;
        resultCard.style.display = 'block';
        return;
    }
    
    let html = `
        <div style="margin-bottom: 20px;">
            <p><strong>Дата:</strong> ${calc.date}</p>
            <p><strong>Площадь:</strong> ${calc.area} м²</p>
            <p><strong>Система:</strong> ${calc.system}</p>
        </div>
    `;
    
    if (materials && materials.length > 0) {
        html += `<p><strong>Материалы:</strong> ${calc.materialsTotal.toLocaleString('ru-RU')} ₽</p>`;
    }
    
    if (equipment && equipment.length > 0) {
        html += `<p><strong>Оборудование:</strong> ${calc.equipmentTotal.toLocaleString('ru-RU')} ₽</p>`;
    }
    
    html += `
        <div class="result-total">
            <p><strong>Общая стоимость:</strong> ${calc.total.toLocaleString('ru-RU')} ₽</p>
            <p><strong>Предоплата (50%):</strong> ${calc.prepayment.toLocaleString('ru-RU')} ₽</p>
        </div>
    `;
    
    resultContent.innerHTML = html;
    resultCard.style.display = 'block';
    
    // Сохранить текущий расчет в window для PDF
    window.lastCalculation = {
        ...calc,
        materials: materials || [],
        equipment: equipment || []
    };
}

// Сохранить PDF
function saveToPDF() {
    if (!window.lastCalculation) {
        alert('Сначала выполните расчет');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('PotolokForLife', 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text('Смета на натяжной потолок', 105, 30, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Дата: ${window.lastCalculation.date}`, 20, 45);
        doc.text(`Площадь: ${window.lastCalculation.area} м²`, 20, 52);
        doc.text(`Система: ${window.lastCalculation.system}`, 20, 59);
        
        let y = 75;
        
        // Материалы
        if (window.lastCalculation.materials.length > 0) {
            doc.text('Материалы:', 20, y);
            y += 10;
            
            window.lastCalculation.materials.forEach(item => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`${item.name} (${item.qty} ${item.unit})`, 25, y);
                doc.text(`${item.total.toLocaleString('ru-RU')} ₽`, 180, y, { align: 'right' });
                y += 8;
            });
            
            doc.setFont(undefined, 'bold');
            doc.text('Итого материалы:', 25, y);
            doc.text(`${window.lastCalculation.materialsTotal.toLocaleString('ru-RU')} ₽`, 
                    180, y, { align: 'right' });
            y += 15;
            doc.setFont(undefined, 'normal');
        }
        
        // Оборудование
        if (window.lastCalculation.equipment.length > 0) {
            doc.text('Оборудование:', 20, y);
            y += 10;
            
            window.lastCalculation.equipment.forEach(item => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`${item.name} (${item.qty} ${item.unit})`, 25, y);
                doc.text(`${item.total.toLocaleString('ru-RU')} ₽`, 180, y, { align: 'right' });
                y += 8;
            });
            
            doc.setFont(undefined, 'bold');
            doc.text('Итого оборудование:', 25, y);
            doc.text(`${window.lastCalculation.equipmentTotal.toLocaleString('ru-RU')} ₽`, 
                    180, y, { align: 'right' });
            y += 15;
            doc.setFont(undefined, 'normal');
        }
        
        // Итог
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('ОБЩАЯ СТОИМОСТЬ:', 20, y + 10);
        doc.text(`${window.lastCalculation.total.toLocaleString('ru-RU')} ₽`, 
                190, y + 10, { align: 'right' });
        
        doc.setFontSize(12);
        doc.text(`Предоплата (50%): ${window.lastCalculation.prepayment.toLocaleString('ru-RU')} ₽`, 
                20, y + 20);
        
        // Сохранить
        const filename = `Potolok_${window.lastCalculation.date.replace(/\./g, '-')}.pdf`;
        doc.save(filename);
    } catch (error) {
        console.error('Ошибка PDF:', error);
        alert('Создайте расчет и попробуйте снова');
    }
}

// Поделиться через Telegram
function shareViaTelegram() {
    if (!window.lastCalculation) {
        alert('Сначала выполните расчет');
        return;
    }
    
    const text = `Расчет потолка:
Площадь: ${window.lastCalculation.area} м²
Система: ${window.lastCalculation.system}
Итого: ${window.lastCalculation.total.toLocaleString('ru-RU')} ₽
Предоплата: ${window.lastCalculation.prepayment.toLocaleString('ru-RU')} ₽`;
    
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Поделиться через WhatsApp
function shareViaWhatsApp() {
    if (!window.lastCalculation) {
        alert('Сначала выполните расчет');
        return;
    }
    
    const text = `*Расчет потолка:*
Площадь: ${window.lastCalculation.area} м²
Система: ${window.lastCalculation.system}
Итого: ${window.lastCalculation.total.toLocaleString('ru-RU')} ₽
Предоплата: ${window.lastCalculation.prepayment.toLocaleString('ru-RU')} ₽`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// История
function updateHistory() {
    const container = document.getElementById('historyList');
    
    if (calculationsHistory.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d; text-align: center;">Нет расчетов</p>';
        return;
    }
    
    container.innerHTML = calculationsHistory.map(calc => `
        <div class="history-item" onclick="loadHistory(${calc.id})">
            <div style="display: flex; justify-content: space-between;">
                <strong>${calc.date}</strong>
                <span style="color: #27ae60;">${calc.total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div style="font-size: 14px; color: #7f8c8d;">
                ${calc.area} м² • ${calc.system}
            </div>
        </div>
    `).join('');
}

function loadHistory(id) {
    const calc = calculationsHistory.find(c => c.id === id);
    if (calc) {
        document.getElementById('area').value = calc.area;
        calculate();
    }
}

function resetForm() {
    if (confirm('Сбросить все данные?')) {
        selectedMaterials = {};
        selectedEquipment = {};
        document.getElementById('area').value = '';
        document.getElementById('system').value = 'garpun';
        
        renderMaterials();
        renderEquipment();
        document.getElementById('resultCard').style.display = 'none';
        
        saveToStorage();
    }
}

// Сохранение в LocalStorage
function saveToStorage() {
    const data = {
        selectedMaterials: selectedMaterials,
        selectedEquipment: selectedEquipment,
        calculationsHistory: calculationsHistory,
        savedAt: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('potolokData', JSON.stringify(data));
    } catch (e) {
        console.log('Ошибка сохранения:', e);
    }
}

function loadFromStorage() {
    try {
        const data = JSON.parse(localStorage.getItem('potolokData') || '{}');
        
        if (data.selectedMaterials) selectedMaterials = data.selectedMaterials;
        if (data.selectedEquipment) selectedEquipment = data.selectedEquipment;
        if (data.calculationsHistory) calculationsHistory = data.calculationsHistory;
    } catch (e) {
        console.log('Ошибка загрузки:', e);
    }
}
