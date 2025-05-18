"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { TodoList } from "./todo-list"
import { TodoInput } from "./todo-input"
import { TodoFilter } from "./todo-filter"
import { TodoStats } from "./todo-stats"
import { ThemeToggle } from "./theme-toggle"
import type { Todo, Filter, Priority } from "@/types/todo"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [filter, setFilter] = useState<Filter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = (text: string, priority: Priority = "medium", dueDate?: Date) => {
    if (text.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text,
          completed: false,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : undefined,
          createdAt: new Date().toISOString(),
        },
      ])
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed
      if (filter === "completed") return todo.completed
      if (filter === "high") return todo.priority === "high"
      if (filter === "medium") return todo.priority === "medium"
      if (filter === "low") return todo.priority === "low"
      return true
    })
    .filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // Sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }

    // Then by due date if available
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    // Finally by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Minimal Tasks</h1>
        <ThemeToggle />
      </div>

      <div className="space-y-6">
        <TodoInput onAddTodo={addTodo} />

        <TodoFilter
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <TodoStats todos={todos} />

        <TodoList todos={sortedTodos} onToggle={toggleTodo} onUpdate={updateTodo} onDelete={deleteTodo} />

        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <PlusCircle className="h-12 w-12 mb-4 opacity-20" />
            <p>Add your first task to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
