<template lang="pug">
  div.app-editor
    ul.todo-list
      li.todo-item(v-for="todo in todos" :class="{ done: todo.done }")
        input(type="checkbox" v-model="todo.done")
        input(type="text" :placeholder="todoPlaceholder" v-model="todo.text" :editable="!todo.done")
    input.todo-new(type="text" autofocus :placeholder="todoPlaceholder" v-model="newTodo" @change="addTodo")
    button(v-if="completedTodos.length > 0" @click="clearCompletedTodos") Clear Completed
</template>

<script>
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
    notes () {
      return this.todos
        .map(t => `${t.done ? "x " : "" }${t.text}`)
        .join("\n")
    }
  },
  created () {
    if (!window.frameElement) {
      return
    }

    window.parent.postMessage({ status: "ready" }, "*")
    window.addEventListener("message", this.parseTodos, false)
  },
  methods: {
    addTodo () {
      this.todos.push({ text: this.newTodo, done: false })
      this.newTodo = ""
    },
    clearCompletedTodos () {
      this.todos = this.todos.filter(todo => !todo.done)
    },
    parseTodos (event) {
      const notes = event.data.text

      this.noteId = event.data.id

      if (notes) {
        this.todos = notes.split("\n").map((line, index) => {
          const text = line.replace(/^x /, "")
          const done = line[0] === "x" && line[1] === " "

          return { index, text, done  }
        })
      } else {
        this.todos = []
        return
      }
    }
  },
  watch: {
    todos: {
      deep: true,
      handler (newTodos) {
        if (!window.frameElement) {
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
