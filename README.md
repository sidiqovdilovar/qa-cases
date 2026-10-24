# Трекер тест-кейсов (React + TypeScript)

Учебный SPA — сокращённый аналог TestRail/Qase: ведение списка тест-кейсов с модулями,
статусами и приоритетами, фильтрация, поиск, сводка pass-rate. Данные хранятся в
localStorage, интерфейс — русский.

**Live:** https://sidiqovdilovar.github.io/qa-cases/

## Стек

- React 18 + TypeScript (strict), Vite
- Vitest + Testing Library (17 тестов: чистая логика + UI-сценарии)
- CI: GitHub Actions — тесты, сборка, деплой на Pages

## Локальный запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # юнит- и UI-тесты
npm run build    # прод-сборка в dist/
```

## Что тестируется

- `src/logic.ts` — чистые функции: `calcStats` (pass-rate считается только по
  прогнанным — blocked не входит в знаменатель), `filterCases` (регистр/пробелы),
  `validateCaseFields` (длины, дубли без учёта регистра), `nextId`.
- `src/App.tsx` — UI через Testing Library: валидация формы с ошибкой через `role=alert`,
  добавление кейса черновиком, фильтр/поиск/заглушка, сводка.

## Структура

```
src/
  types.ts   — доменные типы + лейблы
  store.ts   — localStorage-адаптер и seed
  logic.ts   — чистая бизнес-логика (покрыта тестами)
  App.tsx    — форма, фильтры, список, сводка
```
