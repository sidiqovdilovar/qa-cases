import { useMemo, useState } from 'react'
import type { Priority, Status, TestCase } from './types'
import { STATUS_LABELS, PRIORITY_LABELS } from './types'
import { loadCases, saveCases, SEED } from './store'
import { calcStats, filterCases, validateCaseFields, nextId } from './logic'
import './styles.css'

const STATUSES: Status[] = ['pass', 'fail', 'blocked', 'draft']
const PRIORITIES: Priority[] = ['high', 'medium', 'low']

export default function App() {
  const [cases, setCases] = useState<TestCase[]>(() => loadCases(SEED))
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [module, setModule] = useState('Авторизация')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState('')

  const stats = useMemo(() => calcStats(cases), [cases])
  const visible = useMemo(() => filterCases(cases, status, query), [cases, status, query])

  function update(next: TestCase[]) {
    setCases(next)
    saveCases(next)
  }

  function addCase(e: React.FormEvent) {
    e.preventDefault()
    const v = validateCaseFields(title, module, cases)
    if (!v.ok) { setError(v.message); return }
    setError('')
    update([{ id: nextId(cases), title: title.trim(), module: module.trim(), status: 'draft' as Status, priority }, ...cases])
    setTitle('')
  }

  function changeStatus(id: string, s: Status) {
    update(cases.map(c => c.id === id ? { ...c, status: s } : c))
  }

  function remove(id: string) {
    update(cases.filter(c => c.id !== id))
  }

  return (
    <main className="app">
      <h1>Трекер тест-кейсов</h1>
      <p className="muted">Демо-приложение: React + TypeScript, состояние в localStorage, валидация формы, юнит-тесты логики.</p>

      <div className="stats" aria-label="Сводка">
        <div className="stat"><b>{stats.total}</b><span>всего кейсов</span></div>
        <div className="stat stat--pass"><b>{stats.pass}</b><span>проходят</span></div>
        <div className="stat stat--fail"><b>{stats.fail}</b><span>падают ({stats.blocked} заблок.)</span></div>
        <div className="stat"><b>{stats.passRate}%</b><span>pass-rate по прогнанным</span></div>
      </div>

      <form onSubmit={addCase} noValidate>
        <h2>Добавить тест-кейс</h2>
        <div className="grid">
          <div>
            <label htmlFor="t">Название</label>
            <input id="t" value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: логин с пробелом в конце пароля" aria-describedby="err" />
          </div>
          <div>
            <label htmlFor="m">Модуль</label>
            <input id="m" value={module} onChange={e => setModule(e.target.value)} />
          </div>
          <div>
            <label htmlFor="p">Приоритет</label>
            <select id="p" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="primary" type="submit">Добавить</button>
          </div>
        </div>
        <p className="error" id="err" role="alert">{error}</p>
      </form>

      <div className="toolbar">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по названию или модулю" aria-label="Поиск" />
        <select value={status} onChange={e => setStatus(e.target.value as Status | 'all')} aria-label="Фильтр по статусу">
          <option value="all">Все статусы</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="empty">Ничего не найдено. Ослабьте фильтр или добавьте новый кейс формой выше.</div>
      ) : (
        <ul className="list">
          {visible.map(c => (
            <li className="case" key={c.id}>
              <div>
                <div className="case__title">{c.title}</div>
                <div className="case__meta">Модуль: {c.module}</div>
              </div>
              <span className={`badge badge--${c.status}`}>{STATUS_LABELS[c.status]}</span>
              <select value={c.status} onChange={e => changeStatus(c.id, e.target.value as Status)} aria-label={`Статус: ${c.title}`}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <button className="del" type="button" onClick={() => remove(c.id)} aria-label={`Удалить: ${c.title}`} title="Удалить">×</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
