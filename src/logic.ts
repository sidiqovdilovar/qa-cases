import type { TestCase, Status } from './types'

export interface Stats { total: number; pass: number; fail: number; blocked: number; passRate: number }

export function calcStats(cases: TestCase[]): Stats {
  const pass = cases.filter(c => c.status === 'pass').length
  const fail = cases.filter(c => c.status === 'fail').length
  const blocked = cases.filter(c => c.status === 'blocked').length
  const done = pass + fail
  return { total: cases.length, pass, fail, blocked, passRate: done ? Math.round(pass / done * 100) : 0 }
}

export function filterCases(cases: TestCase[], status: Status | 'all', query: string): TestCase[] {
  const q = query.trim().toLowerCase()
  return cases.filter(c =>
    (status === 'all' || c.status === status) &&
    (!q || c.title.toLowerCase().includes(q) || c.module.toLowerCase().includes(q)))
}

export interface Validation { ok: boolean; message: string }

export function validateCaseFields(title: string, module: string, existing: TestCase[]): Validation {
  if (title.trim().length < 5) return { ok: false, message: 'Название короче 5 символов — так тест-кейс не найдут' }
  if (title.trim().length > 120) return { ok: false, message: 'Название длиннее 120 символов' }
  if (!module.trim()) return { ok: false, message: 'Укажите модуль' }
  if (existing.some(c => c.title.trim().toLowerCase() === title.trim().toLowerCase()))
    return { ok: false, message: 'Кейс с таким названием уже есть' }
  return { ok: true, message: '' }
}

export function nextId(cases: TestCase[]): string {
  const max = cases.reduce((m, c) => Math.max(m, Number(c.id.replace(/\D/g, '')) || 0), 0)
  return 'c' + (max + 1)
}
