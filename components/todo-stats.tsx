"use client"

import type { Todo } from "@/types/todo"
import { Progress } from "@/components/ui/progress"

interface TodoStatsProps {
  todos: Todo[]
}

export function TodoStats({ todos }: TodoStatsProps) {
  if (todos.length === 0) return null

  const completed = todos.filter((todo) => todo.completed).length
  const total = todos.length
  const percentage = Math.round((completed / total) * 100)

  const highPriority = todos.filter((todo) => todo.priority === "high").length
  const dueSoon = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed) return false
    const dueDate = new Date(todo.dueDate)
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    return dueDate <= tomorrow
  }).length

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>
          {completed} of {total} tasks completed ({percentage}%)
        </span>
        {highPriority > 0 && <span className="text-red-500">{highPriority} high priority</span>}
        {dueSoon > 0 && <span className="text-amber-500">{dueSoon} due soon</span>}
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}
