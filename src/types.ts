export type Status = 'pass' | 'fail' | 'blocked' | 'draft'
export type Priority = 'high' | 'medium' | 'low'

export interface TestCase {
  id: string
  title: string
  module: string
  status: Status
  priority: Priority
}

export const STATUS_LABELS: Record<Status, string> = {
  pass: 'Проходит', fail: 'Падает', blocked: 'Заблокирован', draft: 'Черновик',
}
export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'Высокий', medium: 'Средний', low: 'Низкий',
}
