import createElement from "../micro-react/createElement"
const element = createElement('h1',{
    id:'title'
},'H',createElement('h2',{
    id:'h2'
}))
console.log(element)
export {}