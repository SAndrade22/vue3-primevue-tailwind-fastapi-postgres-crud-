import { defineStore } from 'pinia'

export interface Todo {
  id: number
  title: string
  completed: boolean
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    nextId: 1,
  }),
  actions: {
    addTodo(title: string) {
      this.todos.push({ id: this.nextId++, title, completed: false })
    },
    toggleTodo(id: number) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) todo.completed = !todo.completed
    },
    deleteTodo(id: number) {
      this.todos = this.todos.filter(t => t.id !== id)
    },
  },
})
