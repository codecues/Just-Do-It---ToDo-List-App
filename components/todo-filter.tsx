"use client"

import type { Filter } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TodoFilterProps {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TodoFilter({ filter, onFilterChange, searchQuery, onSearchChange }: TodoFilterProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => onFilterChange("all")}>
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("completed")}
        >
          Completed
        </Button>
        <Button variant={filter === "high" ? "default" : "outline"} size="sm" onClick={() => onFilterChange("high")}>
          High Priority
        </Button>
        <Button
          variant={filter === "medium" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("medium")}
        >
          Medium Priority
        </Button>
        <Button variant={filter === "low" ? "default" : "outline"} size="sm" onClick={() => onFilterChange("low")}>
          Low Priority
        </Button>
      </div>
    </div>
  )
}
