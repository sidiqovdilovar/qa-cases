import type { TestCase } from './types'

const KEY = 'qa-cases-v1'

export function loadCases(seed: TestCase[]): TestCase[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { const data = JSON.parse(raw); if (Array.isArray(data)) return data }
  } catch { /* повреждённое хранилище — работаем с посевными данными */ }
  return seed
}

export function saveCases(cases: TestCase[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(cases)) } catch { /* ignore */ }
}

export const SEED: TestCase[] = [
  { id: 'c1', title: 'Логин с валидными данными', module: 'Авторизация', status: 'pass', priority: 'high' },
  { id: 'c2', title: 'Логин заблокированного аккаунта', module: 'Авторизация', status: 'pass', priority: 'high' },
  { id: 'c3', title: 'Поиск: одна буква в запросе', module: 'Каталог', status: 'fail', priority: 'medium' },
  { id: 'c4', title: 'Корзина: пересчёт суммы при удалении', module: 'Корзина', status: 'pass', priority: 'high' },
  { id: 'c5', title: 'Оформление заказа: телефон с пробелами', module: 'Заказ', status: 'blocked', priority: 'high' },
  { id: 'c6', title: 'Фильтр по цене: граничные значения', module: 'Каталог', status: 'draft', priority: 'low' },
]
