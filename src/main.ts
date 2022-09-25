import {render,createElement} from '../micro-react'
const root = document.querySelector("#root")!
const element = createElement('h1',{
    id:'title',
    style:'background-color:red'
},
'H'
,createElement('h2',{
    id:'h2',
},'132'))
render(element,root)
export {}