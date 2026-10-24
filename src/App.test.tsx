import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App'

beforeEach(() => localStorage.clear())

describe('Форма добавления', () => {
  it('показывает ошибку на короткое название и не добавляет кейс', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'abc' } })
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/короче 5/)
    expect(screen.queryByText('abc')).not.toBeInTheDocument()
  })

  it('добавляет валидный кейс в начало списка как черновик', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Чекаут: таймаут оплаты' } })
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText('Чекаут: таймаут оплаты')).toBeInTheDocument()
    const item = screen.getByText('Чекаут: таймаут оплаты').closest('li')!
    expect(within(item).getByText('Черновик', { selector: '.badge' })).toBeInTheDocument()
  })
})

describe('Фильтр и поиск', () => {
  it('по запросу остаётся нужный кейс', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Поиск'), { target: { value: 'заблокированного' } })
    expect(screen.getByText('Логин заблокированного аккаунта')).toBeInTheDocument()
    expect(screen.queryByText('Логин с валидными данными')).not.toBeInTheDocument()
  })

  it('пустой результат показывает заглушку', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Поиск'), { target: { value: 'несуществующаястрока' } })
    expect(screen.getByText(/Ничего не найдено/)).toBeInTheDocument()
  })
})

describe('Сводка', () => {
  it('seed: 6 кейсов, pass-rate 75 (3 проходят из 4 прогнанных)', () => {
    render(<App />)
    const stats = screen.getByLabelText('Сводка')
    expect(stats).toHaveTextContent('6')
    expect(stats).toHaveTextContent('75%')
  })
})
