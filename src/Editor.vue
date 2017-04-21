<template lang="pug">
  div#app
    textarea.debug(v-if="debug" v-model="notes" disabled)
    ul.todo-list
      li(v-for="todo in todos" :class="{ 'done': todo.done }" class="todo-item")
        input.todo-item-checkbox(type="checkbox" v-model="todo.done")
        input.todo-item-input(type="text" placeholder="Enter a todo..." v-model="todo.text" :disabled="todo.done")
    input.new-todo-item(type="text" placeholder="Enter a todo and press return..." autofocus v-model="newTodoText" @change="addTodo")
    button(v-if="hasCompletedTodos" @click="archive") Clear Completed
</template>

<script>
import parse from 'url-parse'

export default {
  name: 'editor',
  data () {
    const debug = parse(location.href, true).query.debug === "true"

    return {
      debug,
      newTodoText: "",
      notes: "",
      noteId: "",
      todos: []
    }
  },
  computed: {
    hasCompletedTodos () {
      return this.todos.filter(t => t.done).length > 0
    }
  },
  created () {
    window.parent.postMessage({ status: "ready" }, "*")
    window.addEventListener("message", this.parseTodos, false)
  },
  methods: {
    addTodo () {
      this.todos.push({ text: this.newTodoText, done: false, index: this.todos.length + 1 })
      this.newTodoText = ""
    },
    archive () {
      this.todos = this.todos.filter(todo => !todo.done)
    },
    parseTodos (event) {
      const notes = event.data.text
      const noteId = event.data.id

      if (!notes) {
        this.todos = []
        return
      }

      this.noteId = noteId
      this.notes = notes
      this.todos = this.notes.split("\n").map((line, index) => {
        const text = line.replace(/^x /, "")
        const done = line[0] === "x" && line[1] === " "

        return { index, text, done  }
      })
    }
  },
  watch: {
    todos: {
      deep: true,
      handler (newTodos) {
        this.notes = newTodos.map(todo => `${todo.done ? "x " : "" }${todo.text}`).join("\n")
      }
    },
    notes (newNotes) {
      window.parent.postMessage({ text: newNotes, id: this.noteId }, "*")
    }
  }
}
</script>

<style lang="sass" scoped>
* {
  box-sizing: border-box;
}

#app {
  font-family: Helvetica;

  .debug {
    width: 100%;
    height: 70px;
    border: 1px solid #ccc;
  }

  .new-todo-item {
    margin-left: 22px;
    font-size: 16px;
    color: #444;
    border: none;
    outline: none;
    padding: 1em;
    width: 80%;
  }

  .todo-list {
    list-style-type: none;
    padding: 0;

    .todo-item {
      padding: 0.5em;
      margin: 0.25em 0;
      display: flex;
    }

    .todo-item-checkbox {
      position: relative;
      top: 2px;
    }

    .todo-item-input {
      position: relative;
      left: 8px;
      border: none;
      width: 100%;
      flex-grow: 1;
      font-size: 16px;
      color: #444;

      &:focus {
        outline: none;
      }
    }

    .done {
      .todo-item-input {
        color: #ccc;
        background: white;
        text-decoration: line-through;
      }
    }
  }
}
</style>
