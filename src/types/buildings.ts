import type { Room, Exit } from '@/pages/Index';

export interface BuildingPlan {
  id: string;
  name: string;
  description: string;
  floors: number;
  rooms: Room[];
  exits: Exit[];
  stairs?: { x: number; y: number; width: number; height: number; floor: number }[];
}

export const buildingTemplates: BuildingPlan[] = [
  {
    id: 'office-1floor',
    name: 'Офис (1 этаж)',
    description: 'Офисное помещение с открытым пространством и кабинетами',
    floors: 1,
    rooms: [
      { id: '1', x: 50, y: 50, width: 300, height: 200, name: 'Открытое пространство' },
      { id: '2', x: 400, y: 50, width: 250, height: 200, name: 'Переговорная' },
      { id: '3', x: 50, y: 300, width: 200, height: 150, name: 'Кабинет 1' },
      { id: '4', x: 300, y: 300, width: 350, height: 150, name: 'Коридор' },
    ],
    exits: [
      { id: '1', x: 680, y: 220, width: 40 },
      { id: '2', x: 20, y: 220, width: 40 },
    ],
  },
  {
    id: 'school-1floor',
    name: 'Школа (1 этаж)',
    description: 'Школьное здание с классами и коридором',
    floors: 1,
    rooms: [
      { id: '1', x: 40, y: 40, width: 150, height: 120, name: 'Класс 1' },
      { id: '2', x: 210, y: 40, width: 150, height: 120, name: 'Класс 2' },
      { id: '3', x: 380, y: 40, width: 150, height: 120, name: 'Класс 3' },
      { id: '4', x: 550, y: 40, width: 130, height: 120, name: 'Учительская' },
      { id: '5', x: 40, y: 180, width: 640, height: 100, name: 'Коридор' },
      { id: '6', x: 40, y: 300, width: 150, height: 140, name: 'Столовая' },
      { id: '7', x: 210, y: 300, width: 220, height: 140, name: 'Актовый зал' },
      { id: '8', x: 450, y: 300, width: 230, height: 140, name: 'Спортзал' },
    ],
    exits: [
      { id: '1', x: 10, y: 225, width: 35 },
      { id: '2', x: 685, y: 225, width: 35 },
      { id: '3', x: 340, y: 455, width: 40 },
    ],
  },
  {
    id: 'hospital-1floor',
    name: 'Больница (1 этаж)',
    description: 'Медицинское учреждение с палатами и процедурными',
    floors: 1,
    rooms: [
      { id: '1', x: 50, y: 50, width: 200, height: 80, name: 'Регистратура' },
      { id: '2', x: 270, y: 50, width: 180, height: 80, name: 'Приемное отделение' },
      { id: '3', x: 470, y: 50, width: 200, height: 80, name: 'Диагностика' },
      { id: '4', x: 50, y: 150, width: 620, height: 60, name: 'Главный коридор' },
      { id: '5', x: 50, y: 230, width: 130, height: 100, name: 'Палата 1' },
      { id: '6', x: 200, y: 230, width: 130, height: 100, name: 'Палата 2' },
      { id: '7', x: 350, y: 230, width: 130, height: 100, name: 'Палата 3' },
      { id: '8', x: 500, y: 230, width: 170, height: 100, name: 'Процедурная' },
      { id: '9', x: 50, y: 350, width: 280, height: 100, name: 'Операционная' },
      { id: '10', x: 350, y: 350, width: 320, height: 100, name: 'Реанимация' },
    ],
    exits: [
      { id: '1', x: 10, y: 175, width: 35 },
      { id: '2', x: 685, y: 175, width: 35 },
    ],
  },
  {
    id: 'mall-1floor',
    name: 'Торговый центр (1 этаж)',
    description: 'Торговое помещение с магазинами',
    floors: 1,
    rooms: [
      { id: '1', x: 50, y: 50, width: 150, height: 150, name: 'Магазин 1' },
      { id: '2', x: 220, y: 50, width: 200, height: 150, name: 'Магазин 2' },
      { id: '3', x: 440, y: 50, width: 210, height: 150, name: 'Магазин 3' },
      { id: '4', x: 50, y: 220, width: 600, height: 80, name: 'Торговая галерея' },
      { id: '5', x: 50, y: 320, width: 180, height: 130, name: 'Фудкорт' },
      { id: '6', x: 250, y: 320, width: 140, height: 130, name: 'Кинозал 1' },
      { id: '7', x: 410, y: 320, width: 240, height: 130, name: 'Кинозал 2' },
    ],
    exits: [
      { id: '1', x: 10, y: 255, width: 35 },
      { id: '2', x: 330, y: 465, width: 40 },
      { id: '3', x: 675, y: 255, width: 35 },
    ],
  },
  {
    id: 'office-2floors',
    name: 'Офис (2 этажа)',
    description: 'Двухэтажное офисное здание с лестницами',
    floors: 2,
    rooms: [
      { id: '1-1', x: 50, y: 50, width: 280, height: 180, name: '1 этаж: Холл' },
      { id: '1-2', x: 350, y: 50, width: 150, height: 180, name: '1 этаж: Конференц-зал' },
      { id: '1-3', x: 520, y: 50, width: 130, height: 80, name: '1 этаж: Лестница' },
      { id: '1-4', x: 50, y: 250, width: 200, height: 150, name: '1 этаж: Кафетерий' },
      { id: '1-5', x: 270, y: 250, width: 380, height: 150, name: '1 этаж: Open Space' },
      { id: '2-1', x: 50, y: 50, width: 200, height: 150, name: '2 этаж: Кабинет 1' },
      { id: '2-2', x: 270, y: 50, width: 210, height: 150, name: '2 этаж: Кабинет 2' },
      { id: '2-3', x: 500, y: 50, width: 150, height: 80, name: '2 этаж: Лестница' },
      { id: '2-4', x: 50, y: 220, width: 600, height: 70, name: '2 этаж: Коридор' },
      { id: '2-5', x: 50, y: 310, width: 280, height: 140, name: '2 этаж: Кабинет 3' },
      { id: '2-6', x: 350, y: 310, width: 300, height: 140, name: '2 этаж: Переговорная' },
    ],
    exits: [
      { id: '1', x: 10, y: 140, width: 35 },
      { id: '2', x: 675, y: 330, width: 35 },
    ],
    stairs: [
      { x: 520, y: 50, width: 130, height: 80, floor: 1 },
      { x: 500, y: 50, width: 150, height: 80, floor: 2 },
    ],
  },
  {
    id: 'hotel-3floors',
    name: 'Отель (3 этажа)',
    description: 'Трехэтажный отель с номерами',
    floors: 3,
    rooms: [
      { id: '1-1', x: 50, y: 50, width: 250, height: 150, name: '1 этаж: Ресепшен' },
      { id: '1-2', x: 320, y: 50, width: 180, height: 150, name: '1 этаж: Ресторан' },
      { id: '1-3', x: 520, y: 50, width: 130, height: 150, name: '1 этаж: Лестница' },
      { id: '1-4', x: 50, y: 220, width: 600, height: 80, name: '1 этаж: Холл' },
      { id: '1-5', x: 50, y: 320, width: 300, height: 130, name: '1 этаж: Конференц-зал' },
      { id: '1-6', x: 370, y: 320, width: 280, height: 130, name: '1 этаж: Бар' },
      { id: '2-1', x: 50, y: 50, width: 120, height: 100, name: '2 этаж: Номер 201' },
      { id: '2-2', x: 190, y: 50, width: 120, height: 100, name: '2 этаж: Номер 202' },
      { id: '2-3', x: 330, y: 50, width: 120, height: 100, name: '2 этаж: Номер 203' },
      { id: '2-4', x: 470, y: 50, width: 180, height: 100, name: '2 этаж: Лестница' },
      { id: '2-5', x: 50, y: 170, width: 600, height: 60, name: '2 этаж: Коридор' },
      { id: '2-6', x: 50, y: 250, width: 120, height: 100, name: '2 этаж: Номер 204' },
      { id: '2-7', x: 190, y: 250, width: 120, height: 100, name: '2 этаж: Номер 205' },
      { id: '2-8', x: 330, y: 250, width: 320, height: 100, name: '2 этаж: Люкс' },
      { id: '3-1', x: 50, y: 50, width: 120, height: 100, name: '3 этаж: Номер 301' },
      { id: '3-2', x: 190, y: 50, width: 120, height: 100, name: '3 этаж: Номер 302' },
      { id: '3-3', x: 330, y: 50, width: 120, height: 100, name: '3 этаж: Номер 303' },
      { id: '3-4', x: 470, y: 50, width: 180, height: 100, name: '3 этаж: Лестница' },
      { id: '3-5', x: 50, y: 170, width: 600, height: 60, name: '3 этаж: Коридор' },
      { id: '3-6', x: 50, y: 250, width: 280, height: 150, name: '3 этаж: Пентхаус 1' },
      { id: '3-7', x: 350, y: 250, width: 300, height: 150, name: '3 этаж: Пентхаус 2' },
    ],
    exits: [
      { id: '1', x: 10, y: 255, width: 35 },
      { id: '2', x: 675, y: 255, width: 35 },
    ],
    stairs: [
      { x: 520, y: 50, width: 130, height: 150, floor: 1 },
      { x: 470, y: 50, width: 180, height: 100, floor: 2 },
      { x: 470, y: 50, width: 180, height: 100, floor: 3 },
    ],
  },
];
