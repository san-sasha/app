Лабораторная работа: Модуль справочной информации бизнес-приложения

Выполнил: Драчан Александр Владимирович
Студент: 3 курс, 2 группа
Хостинг: https://san-sasha.github.io/app/

Шаг 1: Описание справочников
В рамках работы разработаны два взаимосвязанных справочника для информационной системы управления персоналом.

1. Справочник «Отделы» (Departments)
Содержит информацию о структурных подразделениях компании.

id (uuid): Уникальный идентификатор записи.
название (text): Наименование отдела.
описание (text): Многострочное поле для подробной информации об отделе.
дата_создания (date): Дата основания отдела.
этаж (numeric, целое число): Номер этажа, на котором располагается отдел.
премиальный_коэффициент (numeric, тип с фиксированной запятой): Коэффициент для расчёта премии сотрудников отдела.

2. Справочник «Сотрудники» (Employees)
Хранит личные и профессиональные данные работников.

id (uuid): Уникальный идентификатор записи.
фамилия (text): Фамилия сотрудника.
имя (text): Имя сотрудника.
отчество (text): Отчество сотрудника.
должность (text): Занимаемая должность.
дата_приёма (date): Дата трудоустройства.
табельный_номер (numeric, целое число): Уникальный табельный номер сотрудника.
оклад (numeric, тип с фиксированной запятой): Фиксированная заработная плата.
department_id (uuid): Внешний ключ, ссылающийся на id отдела.

Шаг 2: Схема базы данных
СУБД: Supabase (PostgreSQL).
В базе данных реализованы внешние ключи для обеспечения целостности данных и индексы для быстрого поиска.

Визуальная схема (ER-диаграмма)


SQL‑структура
-- Таблица "Отделы" (Departments)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATE DEFAULT CURRENT_DATE,
    floor INTEGER,
    bonus_coefficient DECIMAL(10, 2),
    is_deleted BOOLEAN DEFAULT FALSE,
    last_modified_id INTEGER
);

-- Таблица "Сотрудники" (Employees)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    position VARCHAR(255),
    hire_date DATE,
    staff_number INTEGER UNIQUE,
    salary DECIMAL(15, 2),
    department_id INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    last_modified_id INTEGER,
    
    CONSTRAINT fk_department
        FOREIGN KEY(department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);
Пояснение:
Поля is_deleted и last_modified_id реализуют «мягкое удаление» и механизм версионирования записей (совместимость с DataService).
Внешний ключ department_id связывает сотрудника с отделом. При удалении отдела значение department_id у сотрудников станет NULL (ON DELETE SET NULL), что предотвращает потерю данных о сотрудниках.

Шаг 3: Техническая реализация приложения
Приложение разработано как Web‑ориентированный толстый клиент (Fat Client). Вся основная логика обработки данных, фильтрации, сортировки и валидации сосредоточена в коде браузерного приложения (Angular), в то время как база данных (Supabase/PostgreSQL) используется как надёжное хранилище с доступом через API.

🛠 Технологический стек
Frontend: Angular 19 (Standalone Components, Signals)
Стили: SCSS с использованием CSS‑переменных и Flexbox/Grid
База данных: Supabase (PostgreSQL) с поддержкой SERIAL, NUMERIC и DATE
Язык: TypeScript
API‑слой: @supabase/supabase-js

📂 Файловая структура модуля
text
src/
├── app/
│   ├── app.component.ts          # Главный контроллер: управление вкладками, сортировка, модальные окна
│   ├── app.component.html        # Разметка интерфейса
│   ├── app.component.scss        # Стили приложения
│   ├── services/
│   │   └── data.service.ts       # Слой связи с Supabase API (CRUD операции)
│   ├── security/
│   │   └── validation.ts         # Логика валидации и санитайзинга полей
│   └── models/
│       ├── department.model.ts   # Интерфейс данных отдела
│       └── employee.model.ts     # Интерфейс данных сотрудника
🚀 Инструкция по запуску проекта
Для запуска приложения вам понадобятся Node.js (версия 18+) и Angular CLI.

Подготовка окружения
Если Angular CLI ещё не установлен, выполните в терминале:

npm install -g @angular/cli

Клонирование и установка зависимостей
Склонируйте репозиторий и перейдите в папку проекта:

git clone <ссылка_на_ваш_репозиторий>
cd hr-department-app

Настройка базы данных (Supabase)
Создайте проект на supabase.com.
В разделе SQL Editor выполните SQL‑скрипт из Шага 2 (он создаст таблицы departments и employees).
В настройках проекта (Settings → API) скопируйте Project URL и anon public key.

Конфигурация приложения
Откройте файл src/app/services/data.service.ts и вставьте ваши ключи в конструктор:
this.supabase = createClient(
  'ВАШ_PROJECT_URL',
  'ВАШ_ANON_KEY'
);

Запуск
Запустите локальный сервер разработки:
ng serve -o
После компиляции приложение автоматически откроется в браузере по адресу http://localhost:4200/.



Связь: Поле department_id в справочнике «Сотрудники» ссылается на поле id в справочнике «Отделы». Это организует связь «один ко многим»: один отдел может содержать множество сотрудников. Хранение организовано через UUID (универсальные уникальные идентификаторы), что исключает ошибки при совпадении названий отделов или имён сотрудников.
