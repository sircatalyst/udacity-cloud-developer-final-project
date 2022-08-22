export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  title: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
  description: string
}
