function createDOM(fiber) {
  //创建元素
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? //如果是text类型
        document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props)
    //排除children
    .filter((key) => key !== "children")
    //赋予节点属性
    .forEach((key) => (dom[key] = fiber.props[key]));
  //递归child
  // fiber.props.children.forEach((child) => {render(child, dom)});
  return dom;
}
//commit阶段
function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}
function commitWork(fiber) {
  if(!fiber) return ;
  const domParent =fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
function render(element, container: Element) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    sibling: null,
    child: null,
    parent: null,
  };
  nextUnitOfWork = wipRoot;
  //最佳元素到container节点
  //   container.append(dom);
}

let nextUnitOfWork: any = null;
let wipRoot: any = null;
//调度函数
function workLoop(deadLine) {
  //是否退出
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    //做渲染工作
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    //询问是否还有时间
    shouldYield = deadLine.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
//第一次请求
requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  //创建dom元素
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }
  //渲染dom 
  // if (fiber.parent) {
  //   fiber.parent.dom.append(fiber.dom);
  // }
  //给children创建新fiber
  const elements = fiber.props.children;
  let prevSibling: any = null;
  //构建fiber的联系
  for (let i = 0; i < elements.length; i++) {
    const newFiber = {
      type: elements[i].type,
      props: elements[i].props,
      parent: fiber,
      dom: null,
      child: null,
      sibling: null,
    };
    if (i === 0) {
      //第一个儿子
      fiber.child = newFiber;
    } else {
      //儿子的兄弟
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
export default render;
