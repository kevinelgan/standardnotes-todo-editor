<template lang="pug">
  div#app
    textarea.debug(v-if="debug" v-model="notes" disabled)
    ul.todo-list
      li(v-for="todo in todos" :class="{ 'done': todo.done }" class="todo-item")
        input.todo-item-checkbox(type="checkbox" v-model="todo.done")
        input.todo-item-input(type="text" v-model="todo.text" :disabled="todo.done")
    button(@click="addTodo") +
    button(@click="archive") Clear Completed
    button(@click="toggleDebug") Toggle Debug
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
      notes: "",
      noteId: "",
      todos: [],
      debug: false
    }
  },
  created () {
    window.parent.postMessage({ status: "ready" }, "*")
    window.addEventListener("message", this.parseTodos, false)
  },
  methods: {
    addTodo () {
      this.todos.push({ text: "", done: false, index: this.todos.length + 1 })
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
    },
    toggleDebug () {
      this.debug = !this.debug
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

  .todo-list {
    list-style-type: none;
    padding: 0;

    .todo-item {
      border: 1px solid #eee;
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
        text-decoration: line-through;
      }
    }
  }
}
</style>
