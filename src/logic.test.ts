import { describe, it, expect } from 'vitest'
import { calcStats, filterCases, validateCaseFields, nextId } from './logic'
import type { TestCase } from './types'

const cases: TestCase[] = [
  { id: 'c1', title: 'Логин с валидными данными', module: 'Авторизация', status: 'pass', priority: 'high' },
  { id: 'c2', title: 'Поиск: пустой запрос', module: 'Каталог', status: 'fail', priority: 'medium' },
  { id: 'c3', title: 'Корзина: пересчёт суммы', module: 'Корзина', status: 'blocked', priority: 'high' },
]

describe('calcStats', () => {
  it('считает pass-rate только по прогнанным (blocked не входит в знаменатель)', () => {
    const s = calcStats(cases)
    expect(s).toEqual({ total: 3, pass: 1, fail: 1, blocked: 1, passRate: 50 })
  })
  it('пустой список — 0 везде, без деления на ноль', () => {
    expect(calcStats([]).passRate).toBe(0)
  })
})

describe('filterCases', () => {
  it('фильтрует по статусу', () => {
    expect(filterCases(cases, 'fail', '')).toHaveLength(1)
  })
  it('ищет без учёта регистра и с пробелами по краям', () => {
    expect(filterCases(cases, 'all', '  ЛОГИН ')).toHaveLength(1)
  })
  it('пробельный запрос равен пустому', () => {
    expect(filterCases(cases, 'all', '   ')).toHaveLength(3)
  })
  it('совмещает статус и запрос', () => {
    expect(filterCases(cases, 'blocked', 'корзина')).toHaveLength(1)
  })
})

describe('validateCaseFields', () => {
  it('отклоняет короткое название', () => {
    expect(validateCaseFields('abc', 'Модуль', []).ok).toBe(false)
  })
  it('отклоняет дубль без учёта регистра', () => {
    expect(validateCaseFields('ЛОГИН с валидными данными', 'Модуль', cases).ok).toBe(false)
  })
  it('принимает уникальное длинное название', () => {
    expect(validateCaseFields('Новый валидный кейс', 'Заказ', cases).ok).toBe(true)
  })
  it('требует модуль', () => {
    expect(validateCaseFields('Нормальное название', ' ', []).ok).toBe(false)
  })
})

describe('nextId', () => {
  it('монотонно растёт', () => { expect(nextId(cases)).toBe('c4') })
  it('с пустого списка — c1', () => { expect(nextId([])).toBe('c1') })
})
