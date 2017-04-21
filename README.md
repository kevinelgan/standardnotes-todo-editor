# Todo Editor for Standard Notes

A simple `todo.txt` format-esque editor for Standard Notes. More of a proof of concept than anything right now.

![](https://github.com/cfdrake/standardnotes-todo-editor/raw/master/.github/screenshot.png)

Currently, the editor expects a note of the format:

    Item one here
    Item two here
    x Item three is done
    x So is four!
    Five however, is not

The editor will display a list of five items, with a checkmark in front of each one. Editing an item will regenerate
the `todo.txt` formatted note and push it back to the parent window, where the Standard Notes app will save your changes.

## Demo

Try a demo deployment by adding the following editor URL: `https://sn-todotxt-poc-demo.surge.sh/?name=Todo%20Editor%20(Demo)`.

Do not use this for critical data! It is only a proof of concept.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
