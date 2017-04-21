<template lang="pug">
  div#app
    textarea.editor(v-model="notes" disabled)
    ul.todo-list
      li(v-for="todo in todos" :class="{ 'done': todo.done }" class="todo-item")
        input(type="checkbox" v-model="todo.done")
        span &nbsp;
        label {{ todo.text }}
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
      notes: "",
      noteId: "",
      todos: []
    }
  },
  created () {
    window.parent.postMessage({ status: "ready" }, "*")
    window.addEventListener("message", this.parseTodos, false)
  },
  methods: {
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
      window.parent.postMessage({ text: this.notes, id: this.noteId }, "*")
    }
  }
}
</script>

<style lang="sass" scoped>
#app {
  .editor {
    width: 300px;
    height: 70px;
    border: 1px solid #ccc;
  }

  .todo-list {
    list-style-type: none;
    padding: 0;

    .todo-item {
      &.done {
        color: #999;
      }
    }
  }
}
</style>
