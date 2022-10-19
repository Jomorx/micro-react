import { render, createElement } from "../micro-react";

const root = document.querySelector("#root")!;
const App = (props) => {
  return createElement(
    "div",
    {},
    createElement(
      "h1",
      {
        onClick: () => {
          console.log(123);
        },
      },
      "hi",
      createElement(Home,{name:123})
    )
  );
};
const Home = ({name}) => {
  return createElement("h2", {}, name);
};
const element = createElement(App, { name: "kervin" });
render(element, root);
export {};
