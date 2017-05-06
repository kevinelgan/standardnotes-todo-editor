<template lang="pug">
  div.app-editor
    ul.todo-list
      li.todo-item(v-for="todo in todos" :class="{ done: todo.done }")
        input(type="checkbox" v-model="todo.done")
        input(type="text" :placeholder="todoPlaceholder" v-model="todo.text" :disabled="todo.done" @keydown.delete="deleteTodo(todo)")
    input.todo-new(type="text" autofocus :placeholder="todoPlaceholder" v-model="newTodo" @change="addTodo")
    div.controls
      a(href="#" v-if="uncompletedTodos.length > 0" @click="markAllTodosDone") Mark All as Completed
      a(href="#" v-if="completedTodos.length > 0" @click="clearCompletedTodos") Clear Completed
</template>

<script>
import parseTodos from "../helpers/parseTodos.js"

export default {
  name: "app-editor",
  data () {
    return {
      todoPlaceholder: "What do you want to do?",
      newTodo: "",
      todos: [],
      noteId: null
    }
  },
  computed: {
    completedTodos () {
      return this.todos.filter(t => t.done)
    },
    iframe () {
      return window !== window.top
    },
    notes () {
      return this.todos
        .map(t => `${t.done ? "x " : "" }${t.text}`)
        .join("\n")
    },
    uncompletedTodos () {
      return this.todos.filter(t => !t.done)
    }
  },
  created () {
    if (!this.iframe) {
      return
    }

    window.parent.postMessage({ status: "ready" }, "*")
    window.addEventListener("message", (event) => {
      const { id, todos } = parseTodos(event)

      this.noteId = id
      this.todos = todos
    }, false)
  },
  methods: {
    addTodo () {
      this.todos.push({ text: this.newTodo, done: false })
      this.newTodo = ""
    },
    deleteTodo (todo) {
      // Only delete on delete key if there if the todo is empty.
      if (!todo.text) {
        const index = this.todos.indexOf(todo)
        this.todos.splice(index, 1)
      }
    },
    clearCompletedTodos () {
      this.todos = this.todos.filter(todo => !todo.done)
    },
    markAllTodosDone () {
      this.todos = this.todos.map(t => Object.assign(t, { done: true }))
    }
  },
  watch: {
    todos: {
      deep: true,
      handler (newTodos) {
        if (!this.iframe) {
          return
        }

        window.parent.postMessage({ text: this.notes, id: this.noteId }, "*")
      }
    }
  }
}
</script>

<style lang="sass?indentedSyntax">
@import "../styles/app"
</style>
