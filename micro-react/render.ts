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
  fiber.props.children.forEach((child) => render(child, dom));
  return dom;
}

function render(element, container: Element) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
    sibiling: null,
    child: null,
    parent: null,
  };
  //最佳元素到container节点
//   container.append(dom);
}

let nextUnitOfWork: any = null;
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
  requestIdleCallback(workLoop);
}
//第一次请求
requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  //创建dom元素
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }
  //追加到父节点
  if (fiber.parent) {
    fiber.parent.dom.append(fiber.dom);
  }
  //给children创建新fiber
  const elements = fiber.props.children;
  let preSibling:any = null;
  //构建fiber的联系
  for (let i = 0; i < elements.length; i++) {
    const newFiber = {
      type: elements[i].type,
      props: elements[i].props,
      parent: fiber,
      dom: null,
      children: null,
      sibling: null,
    };
    if(i===0){
        //第一个儿子
        fiber.child=newFiber
    }else{
        //儿子的兄弟
        preSibling.sibling=newFiber
    }
    preSibling=newFiber
  }
  if(fiber.child){
    return fiber.child
  }
  let nextFiber =fiber
  while(nextFiber){
    if(nextFiber.sibiling){
        return nextFiber.sibiling
    }
    nextFiber=nextFiber.parent
  }
}
export default render;
