import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generatePDF(objectInfo, tableData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const date = new Date().toLocaleDateString('ru-RU');
  
  // Заголовок
  doc.setFontSize(20);
  doc.setTextColor(52, 152, 219);
  doc.text('PotolokForLife', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Дата: ${date}`, 20, 45);
  doc.text(`№: ПФЛ-${Date.now().toString().slice(-6)}`, 20, 50);
  
  // Информация об объекте
  doc.setFontSize(12);
  doc.text('Информация об объекте:', 20, 65);
  
  doc.setFontSize(10);
  let y = 70;
  if (objectInfo.objectType) {
    doc.text(`• Объект: ${objectInfo.objectType}`, 25, y);
    y += 6;
  }
  if (objectInfo.address) {
    doc.text(`• Адрес: ${objectInfo.address}`, 25, y);
    y += 6;
  }
  if (objectInfo.roomCount) {
    doc.text(`• Помещений: ${objectInfo.roomCount}`, 25, y);
    y += 6;
  }
  if (objectInfo.area) {
    doc.text(`• Площадь: ${objectInfo.area} м²`, 25, y);
    y += 6;
  }
  
  // Разделительная линия
  doc.setDrawColor(52, 152, 219);
  doc.setLineWidth(0.5);
  doc.line(20, y + 5, pageWidth - 20, y + 5);
  
  // Таблица
  const worksData = tableData
    .filter(row => row.D > 0)
    .map((row, index) => [
      index + 1,
      row.B || '',
      row.C || '',
      parseFloat(row.D || 0).toFixed(2),
      parseFloat(row.E || 0).toLocaleString('ru-RU'),
      parseFloat(row.F || 0).toLocaleString('ru-RU')
    ]);
  
  if (worksData.length > 0) {
    doc.autoTable({
      startY: y + 10,
      head: [['№', 'Наименование', 'Ед.изм.', 'Кол-во', 'Цена, руб.', 'Сумма, руб.']],
      body: worksData,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: { 
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255]
      }
    });
  }
  
  // Итого
  const totalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 20;
  const total = worksData.reduce((sum, row) => sum + parseFloat(row[5].replace(/\s/g, '')), 0);
  
  doc.setFontSize(12);
  doc.text('ИТОГО:', pageWidth - 70, totalY);
  doc.text(`${total.toLocaleString('ru-RU')} руб.`, pageWidth - 20, totalY, { align: 'right' });
  
  // Условия
  doc.setFontSize(11);
  doc.text('Условия оплаты:', 20, totalY + 20);
  
  doc.setFontSize(10);
  doc.text('1. Предоплата 50% не позднее 3-х дней до планируемой даты выполнения монтажа.', 25, totalY + 28);
  doc.text('2. Окончательный расчет 50% в день завершения всех работ.', 25, totalY + 34);
  
  // Контакты
  doc.setFontSize(11);
  doc.text('Контакты:', 20, totalY + 52);
  
  doc.setFontSize(10);
  doc.text('PotolokForLife - Натяжные потолки на всю жизнь', 25, totalY + 60);
  doc.text('Пушкино, Московская область', 25, totalY + 66);
  doc.text('Email: Potolokforlife@yandex.ru', 25, totalY + 72);
  doc.text('Тел.: 8(977)5311099, 8(977)7093843', 25, totalY + 78);
  
  // Подпись
  doc.text('С уважением,', 25, totalY + 90);
  doc.text('_______________________', 25, totalY + 100);
  doc.text('Генеральный директор', 25, totalY + 106);
  
  // Сохраняем
  const fileName = `Предложение_${date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
