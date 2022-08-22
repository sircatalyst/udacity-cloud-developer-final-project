/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  title: string
  dueDate: string
  done: boolean
}