import { render, createElement } from "../micro-react";
import { useState } from "../micro-react/render";

const root = document.querySelector("#root")!;
const Counter = ()=>{
 const [count,setCount] =useState(0)
 return createElement("h1",{onClick:()=>{setCount(prev=>prev+1)}},count)
}
const element = createElement("div",{},createElement(Counter))
render(element,root)
export {};
