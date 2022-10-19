/**
 * 创建dom元素
 * @param fiber 需要创建元素的fiber节点
 * @returns 创建出来的dom元素
 */
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
    .forEach((key) => {
      if (key.startsWith("on")) {
        // dom[key.toLowerCase()] = fiber.props[key];
        
        dom.addEventListener(key.substring(2).toLowerCase(), fiber.props[key]);
      } else {
        dom[key] = fiber.props[key];
      }
    });

  //递归child
  // fiber.props.children.forEach((child) => {render(child, dom)});

  return dom;
}
/**
 * commit 阶段渲染dom
 */
function commitRoot() {
  deletion.forEach(commitWork);
  currentRoot = wipRoot;
  commitWork(wipRoot.child);
  wipRoot = null;
}
/**
 * 递归commit 渲染dom元素
 * @param fiber 需要渲染的fiber节点
 * @returns 
 */
function commitWork(fiber) {
  if (!fiber) return;
  //函数组件没有dom 需要跳过函数组件绑到fn的上面的dom
  let domParentFiber = fiber.parent
  while(!domParentFiber.dom){
    //向上查找
    domParentFiber=domParentFiber.parent
  }
  const parentDom=domParentFiber.dom
  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    parentDom.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETION" && fiber.dom) {
    // parentDom.removeChild(fiber.dom);
    commitDeletion(fiber,parentDom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
//更新dom
function updateDom(dom: HTMLElement, prevProps, nextProps) {
  const isEvent = (key: string) => key.startsWith("on");
  //删除已经没有的事件处理函数
  Object.keys(prevProps)
    .filter(isEvent)
    //没有或者已经改变的事件处理函数
    .filter((key) => !(key in nextProps) || prevProps[key] !== nextProps[key])
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[key]);
    });
  //添加新的处理函数
  Object.keys(nextProps)
    .filter(isEvent)
    .filter((key) => prevProps[key] !== nextProps[key])
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[key]);
    });

  //删除已经没有props
  Object.keys(prevProps)
    // 过滤children
    .filter((key) => key !== "children")
    // 没有在新的props的props
    .filter((key) => !(key in nextProps))
    .forEach((key) => {
      dom[key] = "";
    });
  //赋予新的或者改变的props
  Object.keys(nextProps)
    // 过滤children
    .filter((key) => key !== "children")
    // 判断已有的props是不是都相等
    .filter((key) => prevProps[key] !== nextProps[key])
    .forEach((key) => {
      dom[key] = nextProps[key];
    });
}
/**
 * 
 * @param fiber 需要删除的dom
 * @param domParent 删除的dom的parent
 */
function commitDeletion(fiber,domParent){
  if(fiber.dom){
    domParent.removeChild(fiber.dom)
  }else{
    commitDeletion(fiber.child,domParent)
  }
}
/**
 * 
 * @param element 需要渲染的element对象
 * @param container 挂载的root容器
 */
function render(element, container: Element) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    sibling: null,
    child: null,
    parent: null,
    //储存上一次的wipRoot
    alternate: currentRoot,
  };
  deletion = [];
  nextUnitOfWork = wipRoot;
  //最佳元素到container节点
  //   container.append(dom);
}
//下一次的工作
let nextUnitOfWork: any = null;
// 正在rootFiber 便于commit阶段时提交
let wipRoot: any = null;
//上一次fiber的root节点
let currentRoot = null;
//需要删除的数组的集合
let deletion: any = null;
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
/**
 *  执行的每一次最小单元
 * @param fiber fiber节点 
 */
function performUnitOfWork(fiber) {

  const isFunctionComponent=fiber.type instanceof Function
  if(isFunctionComponent){
      updateFunctionComponent(fiber)
  }else{
    updateHostComponent(fiber)
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


//处理非函数试组件
const updateHostComponent=(fiber)=>{
  //创建dom元素
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}

const updateFunctionComponent=(fiber)=>{
  const children =[fiber.type(fiber.props)]
  reconcileChildren(fiber,children)
}
/**
 *  diff算法
 * @param wipFiber 当前执行的fiber
 * @param elements 需要渲染的elements对象
 */
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling: any = null;
  while (index < elements.length || oldFiber) {
    const element = elements[index];
    //如果type相同，那么只需要更新props
    const sameType = element && oldFiber && element.type === oldFiber.type;
    let newFiber: any = null;
    // 更新type相同
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    //新建
    if (element && !oldFiber) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    // 删除
    if (!oldFiber && sameType) {
      oldFiber.effectTag = "DELETION";
      deletion.push(oldFiber);
    }
    //遍历上一次的fiber，因为是一个fiber所以只能用sibling遍历
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      //第一个儿子
      wipFiber.child = newFiber;
    } else {
      //儿子的兄弟
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;

    //遍历新的element
    index++;
  }
}
export default render;
