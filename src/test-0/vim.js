module.styleByPath('vim.css')
module.debug=true
module.shareImport('../Vim.js').then(Vim=>{
    let vim=createVim()
    let vimViewDiv=createVimViewDiv(vim)
    document.body.appendChild(vimViewDiv)
    vim.on('quit',()=>document.body.removeChild(vimViewDiv))
    vim.focus()
    function createVim(){
        let vim=new Vim
        vim.text=`<!doctype html>
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <!-- this is a comment -->
        <p>
            存在先於本質
    </body>
</html>
`
        return vim
    }
})
function createVimViewDiv(vim){
    let div=document.createElement('div')
    div.style.border='1px solid lightgray'
    div.style.width='min-content'
    div.style.margin='0 auto'
    div.addEventListener('click',()=>
        vim.focus()
    )
    vim.width=80
    vim.height=24
    div.appendChild(vim.div)
    return div
}
