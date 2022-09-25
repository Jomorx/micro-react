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

export default render