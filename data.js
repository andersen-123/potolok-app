// Минимальный набор данных для PWA Builder
const systems = {
    garpun: {
        name: "Гарпунная система со вставкой",
        materials: [
            { id: 1, name: "Полотно матовое с установкой", unit: "м²", price: 610 },
            { id: 2, name: "Профиль гарпунный с установкой", unit: "м.п.", price: 310 },
            { id: 3, name: "Вставка по периметру", unit: "м.п.", price: 220 },
            { id: 4, name: "Монтаж светильника", unit: "шт.", price: 780 },
            { id: 5, name: "Монтаж люстры", unit: "шт.", price: 1100 }
        ]
    },
    
    garpun_plus10: {
        name: "Гарпунная система (+10%)",
        materials: [
            { id: 1, name: "Полотно матовое с установкой", unit: "м²", price: 670 },
            { id: 2, name: "Профиль гарпунный с установкой", unit: "м.п.", price: 340 },
            { id: 3, name: "Вставка по периметру", unit: "м.п.", price: 240 },
            { id: 4, name: "Монтаж светильника", unit: "шт.", price: 900 },
            { id: 5, name: "Монтаж люстры", unit: "шт.", price: 1200 }
        ]
    },
    
    shadow: {
        name: "Теневой потолок",
        materials: [
            { id: 1, name: "Полотно матовое с установкой", unit: "м²", price: 760 },
            { id: 2, name: "Профиль теневой с установкой", unit: "м.п.", price: 450 },
            { id: 4, name: "Монтаж светильника", unit: "шт.", price: 900 },
            { id: 5, name: "Монтаж люстры", unit: "шт.", price: 1200 }
        ]
    }
};

const equipment = [
    { id: 101, name: "Светильник", unit: "шт.", price: 600 },
    { id: 102, name: "Светодиодная лента", unit: "м.п.", price: 450 },
    { id: 103, name: "Вентилятор", unit: "шт.", price: 1200 },
    { id: 104, name: "Люстра", unit: "шт.", price: 2000 }
];
