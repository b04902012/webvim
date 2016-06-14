module.debug=true
module.import('../src/Vim.js').then(Vim=>{
    let
        vim=new Vim,
        textarea_source=document.getElementById('textarea_source')
    vim.on('textchange',()=>{
        textarea_source.value=vim.text
    })
    vim.text=textarea_source.value
    vim.setup(textarea_source)
    vim.activated=true
    vim.update()
})