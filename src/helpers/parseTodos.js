export default function (event) {
  const { id, text } = event.data
  let todos = []

  if (text) {
    todos = text.split("\n").map((line, index) => {
      const text = line.replace(/^x /, "")
      const done = line[0] === "x" && line[1] === " "

      return { text, done }
    })
  }

  return { id, todos }
}

