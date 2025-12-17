import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generatePDF(objectInfo, tableData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const date = new Date().toLocaleDateString('ru-RU');
  
  // Логотип и заголовок
  doc.setFontSize(20);
  doc.setTextColor(52, 152, 219);
  doc.text('PotolokForLife', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Дата: ${date}`, 20, 45);
  doc.text(`№ предложения: ПФЛ-${Date.now().toString().slice(-6)}`, 20, 50);
  
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
  if (objectInfo.perimeter) {
    doc.text(`• Периметр: ${objectInfo.perimeter} м.п.`, 25, y);
    y += 6;
  }
  
  // Разделительная линия
  doc.setDrawColor(52, 152, 219);
  doc.setLineWidth(0.5);
  doc.line(20, y + 5, pageWidth - 20, y + 5);
  
  // Таблица с работами
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
        cellPadding: 3,
        overflow: 'linebreak'
      },
      headStyles: { 
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 15 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      }
    });
  }
  
  // Итого
  const totalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 20;
  const total = worksData.reduce((sum, row) => sum + parseFloat(row[5].replace(/\s/g, '')), 0);
  
  doc.setFontSize(12);
  doc.text('ИТОГО:', pageWidth - 70, totalY);
  doc.text(`${total.toLocaleString('ru-RU')} руб.`, pageWidth - 20, totalY, { align: 'right' });
  
  doc.setFontSize(10);
  doc.text(`в том числе НДС 20%: ${(total * 0.1667).toLocaleString('ru-RU')} руб.`, pageWidth - 20, totalY + 7, { align: 'right' });
  
  // Условия
  doc.setFontSize(11);
  doc.text('Условия оплаты:', 20, totalY + 20);
  
  doc.setFontSize(10);
  doc.text('1. Предоплата 50% не позднее 3-х дней до планируемой даты выполнения монтажа.', 25, totalY + 28);
  doc.text('2. Окончательный расчет 50% в день завершения всех работ.', 25, totalY + 34);
  doc.text('3. Оплата за материалы и оборудование производится 100% до начала выполнения работ.', 25, totalY + 40);
  
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
  
  // Футер
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Документ сгенерирован в приложении PotolokForLife ${date}`, pageWidth / 2, 285, { align: 'center' });
  
  // Сохраняем PDF
  const fileName = `Предложение_${objectInfo.objectType || 'объект'}_${date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
