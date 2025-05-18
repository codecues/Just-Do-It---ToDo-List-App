"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { Pencil, Trash2, Calendar, Check, X } from "lucide-react"
import type { Todo, Priority } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  isEditing: boolean
  onEditStart: () => void
  onEditEnd: () => void
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete, isEditing, onEditStart, onEditEnd }: TodoItemProps) {
  const [editText, setEditText] = useState(todo.text)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(todo.dueDate ? new Date(todo.dueDate) : undefined)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, {
        text: editText,
        priority: editPriority,
        dueDate: editDueDate?.toISOString(),
      })
      onEditEnd()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setEditText(todo.text)
      setEditPriority(todo.priority)
      setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined)
      onEditEnd()
    }
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-3 transition-colors",
        todo.completed ? "bg-muted/50 text-muted-foreground" : "bg-card hover:bg-accent/10",
      )}
    >
      <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} className="mt-1" />

      <div className="flex-1 space-y-1">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />

            <div className="flex flex-wrap gap-2">
              <Select value={editPriority} onValueChange={(value) => setEditPriority(value as Priority)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {editDueDate ? format(editDueDate, "MMM d") : "Set due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={editDueDate} onSelect={setEditDueDate} initialFocus />
                </PopoverContent>
              </Popover>

              <div className="flex gap-1 ml-auto">
                <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8">
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditText(todo.text)
                    onEditEnd()
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className={cn("break-words text-sm", todo.completed && "line-through")}>{todo.text}</p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 font-medium",
                  priorityColors[todo.priority],
                )}
              >
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>

              {todo.dueDate && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-muted-foreground",
                    new Date(todo.dueDate) < new Date() && !todo.completed && "text-red-500",
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  {format(new Date(todo.dueDate), "MMM d")}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={onEditStart} className="h-8 w-8">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )}
    </div>
  )
}
