# Todo Editor for Standard Notes

A simple WYSIWYG editor for Standard Notes that saves in the [todo.txt format](https://github.com/ginatrapani/todo.txt-cli/wiki/The-Todo.txt-Format).

![](https://github.com/cfdrake/standardnotes-todo-editor/raw/master/.github/screenshot.png)

## Usage

Open your editor list in Standard Notes by selecting the **Editor** menu, paste `https://cfdrake.github.io/standardnotes-todo-editor/?name=Todos` into the "Add new editor via URL" textbox, then press <kbd>return</kdb>.

## Build Requirements

Install all requirements via NPM:

```
# install dependencies
npm install
```

## Building

To run a local instance of this editor, run:

```
# serve with hot reload at localhost:8080
npm start
```

To build for production, run:

```
npm run build
```

The bundled Javascript will be written to `dist/`.
