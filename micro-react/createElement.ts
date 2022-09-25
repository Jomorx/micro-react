function createElement(type,props,...children){
    return  {
        type,
        props:{
            ...props,
            children:children.map(child=>typeof child==='object'?child:createText(child))
        }
    }
}
function createText (text){
    return {
        type:'TEXT_ELEMENT',
        props:{
            nodeValue:text,
            children:[]
        }
    }
}
export default createElement