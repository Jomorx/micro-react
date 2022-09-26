function render(element,container:Element) {
    //创建元素
    const dom = element.type==='TEXT_ELEMENT'?
    //如果是text类型
    document.createTextNode(''):
    document.createElement(element.type);
    
    Object.keys(element.props)
    //排除children
    .filter(key=>key!=='children')
    //赋予节点属性
    .forEach(key=>dom[key]=element.props[key])
    //递归child
     element.props.children.forEach(child=>render(child,dom))
    //最佳元素到container节点
    container.append(dom)
}

let nextUnitOfWork:any = null;
//调度函数
function workLoop(deadLine){
    //是否退出
    let shouldYield = false;
    while (nextUnitOfWork&&!shouldYield){
        //做渲染工作
       nextUnitOfWork= performUnitOfWork(nextUnitOfWork);
       //询问是否还有时间
       shouldYield=deadLine.timeRemaining()<1
    }
    requestIdleCallback(workLoop)
}
//第一次请求
requestIdleCallback(workLoop)

function performUnitOfWork(work){

}
export default render