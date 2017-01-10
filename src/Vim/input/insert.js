module.import('../ascii.js').then(ascii=>{
    function main(vim,val){
        if(val instanceof KeyboardEvent){
            if(val.key=='Backspace')
                val=ascii.bs
            else if(val.key=='Enter')
                val=ascii.cr
            else if(
                val.key=='Escape'||
                val.ctrlKey&&val.key=='c'||
                val.ctrlKey&&val.key=='['
            )
                val=ascii.esc
            else if(val.key=='Delete')
                val=ascii.del
        }
        if(val==ascii.bs){
            if(vim._text){
                let
                    text=
                        vim.text.substring(0,vim._cursor.abs-1)+
                        vim.text.substring(vim._cursor.abs),
                    pos=
                        vim._cursor.abs-1
                vim._text=text
                if(vim._text)
                    vim._cursor.moveTo(pos)
            }
            return
        }
        if(val==ascii.esc){
            vim.mode='normal'
            return
        }
        if(val==ascii.del){
            if(vim._text){
                vim._text=
                    vim._text.substring(0,vim._cursor.abs)+
                    vim._text.substring(vim._cursor.abs+1)
            }
            return
        }
        vim._text||(vim._text='\n')
        vim._text=
            vim._text.substring(0,vim._cursor.abs)+
            val.replace(/\r/,'\n')+
            vim._text.substring(vim._cursor.abs)
        vim._cursor.moveTo(vim._cursor.abs+val.length)
    }
    return(vim,val)=>{
        let r=main(vim,val)
        vim._view()
        return r
    }
})
