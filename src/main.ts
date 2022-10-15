import {render,createElement} from '../micro-react'
const root = document.querySelector("#root")!
const element = createElement(
    'h1',
    { id: 'title' },
    'Hello React',
    createElement('a', { href: 'https://bilibili.com' }, 'Click Me!')
  );

render(element,root)

export {}