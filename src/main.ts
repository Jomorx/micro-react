import {render,createElement} from '../micro-react'

const root = document.querySelector("#root")!
const handleInput = (e)=>{
  renderer(e.target.value)
}
  const renderer = (value)=>{
      const element = createElement("div",{},
      createElement("input",{onInput:handleInput},null),
      createElement("h1",{},value),
      )
      render(element,root)
  }

renderer("")
export {}