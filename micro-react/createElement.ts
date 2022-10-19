function createElement(type:any,props:Record<string,any>,...children:any[]){
    
    return  {
        type,
        props:{
            ...props,
            children:children.map(child=>typeof child==='object'?child:createText(child))
        }
    }
}

//创建text
function createText (text:string){
    return {
        type:'TEXT_ELEMENT',
        props:{
            nodeValue:text,
            children:[]
        }
    }
}
export default createElement