const domToString = (dom) => {
    let tmpNode = document.createElement("div");
    tmpNode.appendChild(dom.cloneNode(true));
    return tmpNode.innerHTML;
}

module.exports = {
    domToString
}