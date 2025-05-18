export type Priority = "low" | "medium" | "high"
export type Filter = "all" | "active" | "completed" | "high" | "medium" | "low"

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  dueDate?: string
  createdAt: string
}
