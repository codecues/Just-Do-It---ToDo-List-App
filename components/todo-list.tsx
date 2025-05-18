"use client"

import { useState } from "react"
import type { Todo } from "@/types/todo"
import { TodoItem } from "./todo-item"
import { AnimatePresence, motion } from "framer-motion"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onUpdate, onDelete }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TodoItem
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isEditing={editingId === todo.id}
              onEditStart={() => setEditingId(todo.id)}
              onEditEnd={() => setEditingId(null)}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
