import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>PotolokForLife</h1>
      <p>Калькулятор натяжных потолков</p>
      <p>✅ Это PWA приложение</p>
      <p>✅ Манифест: есть</p>
      <p>✅ Service Worker: есть</p>
      <p>✅ HTTPS: GitHub Pages</p>
      <p>✅ Адаптивный дизайн: есть</p>
      
      <div style={{marginTop: '20px'}}>
        <h3>Проверка PWA:</h3>
        <p>1. Откройте DevTools → Application → Manifest</p>
        <p>2. Проверьте на https://pwabuilder.com</p>
        <p>3. Установите на телефон</p>
      </div>
    </div>
  );
}

export default App;
