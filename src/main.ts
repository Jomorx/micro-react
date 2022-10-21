import { render, createElement } from "../micro-react";
import { useState } from "../micro-react/render";

const root = document.querySelector("#root")!;
const Counter = ({ text }) => {
  const [count, setCount] = useState(0);
  return createElement(
    "h1",
    {},
    count,
    createElement("br"),
    createElement(
      "button",
      { onClick: () => setCount((prev) => prev + 1) },
      text
    )
  );
};
const element = createElement(
  "div",
  { style: { "color":"red","font-size":"120px","font-weight":"500" },"data-a":20 },
  createElement(Counter, { text: "ADD" })
);
render(element, root);
export {};
