function Cursor(vim){
    this._x=0
    this._y=0
}
// start 0
Object.defineProperty(Cursor.prototype,'_countOfRows',{get(){
    return this.text.split('\n').length-1
}})
Object.defineProperty(Cursor.prototype,'_countOfCols',{get(){
    return this.text?this.text.split('\n')[this.r].length:0
}})
Object.defineProperty(Cursor.prototype,'_exotic',{get(){
    let c=Object.create(this)
    Object.defineProperty(c,'_x',{set:val=>this._x=val,get:()=>this._x})
    Object.defineProperty(c,'_y',{set:val=>this._y=val,get:()=>this._y})
    return c
}})
Object.defineProperty(Cursor.prototype,'r',{set(val){
    this._y=val
},get(){
    return Math.min(this._countOfRows-1,Math.max(0,this._y))
}})
Object.defineProperty(Cursor.prototype,'c',{set(val){
    this._x=val
},get(){
    return Math.min(availableCols(this)-1,Math.max(0,this._x))
}})
function availableCols(c){
    if(
        c.mode=='normal'||
        c.mode=='cmdline'
    )
        return c._countOfCols
    if(
        c.mode=='visual'||
        c.mode=='insert'
    )
        return c._countOfCols+1
}
Cursor.prototype.line=function(n){
    return this.text.split('\n').slice(0,n).join('').length+n
}
// end 0
// start 1
Cursor.prototype.moveLeft=function(){
    this._x=Math.max(0,this.c-1)
}
Cursor.prototype.moveRight=function(){
    this._x=Math.min(availableCols(this)-1,this.c+1)
}
Cursor.prototype.moveUp=function(){
    this._y=Math.max(0,this._y-1)
}
Cursor.prototype.moveDown=function(){
    this._y=Math.min(this._countOfRows-1,this._y+1)
}
// end 1
// start 1a
Object.defineProperty(Cursor.prototype,'onChar',{get(){
    return 0<=this.c
}})
Object.defineProperty(Cursor.prototype,'abs',{get(){
    return(0<=this.r?this.line(this.r):0)+(0<=this.c?this.c:0)
}})
// end 1a
// start 1b
Cursor.prototype.moveTo=function(n){
    this._y=this.text.substring(0,n).split('\n').length-1
    this._x=n-(
        this.text.split('\n').slice(0,this.r).join('').length+this.r
    )
}
// end 1b
// start 1c
Object.defineProperty(Cursor.prototype,'lineStart',{get(){
    return this.text.substring(0,this.abs).lastIndexOf('\n')+1
}})
Object.defineProperty(Cursor.prototype,'lineEnd',{get(){
    let a=this.abs
    return a+this.text.substring(a).indexOf('\n')+1
}})
// end 1c
// start 2
Cursor.prototype.moveToEOL=function(){
    this.moveTo(this.lineEnd-1)
}
// end 2
// start 2a
{
    // start github.com/b04902012
    function charType(text,a){
        if(text[a]==='\n'&&(!a||text[a-1]==='\n'))
            return "EmptyLine"
        if(/^\s$/.test(text[a]))
            return "WhiteSpace"
        if(/^\w$/.test(text[a]))
            return "AlphaNumeric"
        if(/^[\x00-\x7F]*$/.test(text[a]))
            return "ASCII"
        return "NonASCII"
    }
    /*Cursor.prototype.moveWordRight=function(){
        let a=this.abs
        let t=charType(this.text,a)
        let b=false
        while(a<this.text.length-1&&
          [(b||t),"WhiteSpace"].includes(charType(this.text,a))
        ){
            b=b||(charType(this.text,a)==="WhiteSpace")
            a++
            if(charType(this.text,a)==="EmptyLine")break
        }
        this.moveTo(a)
    }
    Cursor.prototype.moveGeneralWordRight=function(){
        let a=this.abs
        let t=charType(this.text,a)
        let b=false
        while(a<this.text.length-1&&
          (!b||charType(this.text,a)==="WhiteSpace")
        ){
            b=b||(charType(this.text,a)==="WhiteSpace")
            a++
            if(charType(this.text,a)==="EmptyLine")
              break
            if(t==="EmptyLine"&&charType(this.text,a)!=="WhiteSpace")
              break
        }
        this.moveTo(a)
    }*/
    // end github.com/b04902012
    /*Cursor.prototype.moveWordRight=function(){
        let a=this.abs,t=charType(this.text,a)
        if(t=='EmptyLine'){
            if(a+1<this.text.length)
                a++
        }else
            for(;
                a+1<this.text.length&&
                t==charType(this.text,a)
            ;)
                a++
        for(;a+1<this.text.length&&'WhiteSpace'==charType(this.text,a);)
            a++
        this.moveTo(a)
    }
    Cursor.prototype.moveGeneralWordRight=function(){
        let a=this.abs,t=charType(this.text,a)
        if(t=='EmptyLine'){
            if(a+1<this.text.length)
                a++
        }else
            for(;
                a+1<this.text.length&&
                !['EmptyLine','WhiteSpace'].includes(charType(this.text,a))
            ;)
                a++
        for(;a+1<this.text.length&&'WhiteSpace'==charType(this.text,a);)
            a++
        this.moveTo(a)
    }*/
    function isWordBegin(text,a,general){
        if(!a)return true
        if(charType(text,a)==="EmptyLine")return true
        if(charType(text,a)==="WhiteSpace")return false
        if(!general && charType(text,a) !== charType(text, a-1))return true
        if(general && ["WhiteSpace", "EmptyLine"].includes(charType(text,a-1)))return true
        return false
    }
    function isWordEnd(text,a,general){
        if(a===text.length-1)return true
        if(charType(text,a)==="EmptyLine")return true
        if(charType(text,a)==="WhiteSpace")return false
        if(!general && charType(text,a) !== charType(text, a+1))return true
        if(general && ["WhiteSpace", "EmptyLine"].includes(charType(text,a+1)))return true
        return false
    }
    Cursor.prototype.moveToNextWordBegin=function(){
        let a=this.abs+1
        if(a === this.text.length)
          return this.moveTo(this.abs)
        while(a<this.text.length-1 && !isWordBegin(this.text,a,false))a++
        return this.moveTo(a)
    }
    Cursor.prototype.moveToNextGeneralWordBegin=function(){
        let a=this.abs+1
        if(a === this.text.length)
          return this.moveTo(this.abs)
        while(a<this.text.length-1 && !isWordBegin(this.text,a,true))a++
        return this.moveTo(a)
    }
    Cursor.prototype.moveToNextWordEnd=function(){
        let a=this.abs+1
        if(a === this.text.length)
          return this.moveTo(this.abs)
        while(a<this.text.length-1 && !isWordEnd(this.text,a,false))a++
        return this.moveTo(a)
    }
    Cursor.prototype.moveToNextGeneralWordEnd=function(){
        let a=this.abs+1
        if(a === this.text.length)
          return this.moveTo(this.abs)
        while(a<this.text.length-1 && !isWordEnd(this.text,a,true))a++
        return this.moveTo(a)
    }
    Cursor.prototype.moveToPreviousWordBegin=function(){
        let a=this.abs-1
        if(!a)
          return this.moveTo(this.abs)
        while(a>0 && !isWordBegin(this.text,a,false))a--
        return this.moveTo(a)
    }
    Cursor.prototype.moveToPreviousGeneralWordBegin=function(){
        let a=this.abs-1
        if(!a)
          return this.moveTo(this.abs)
        while(a>0 && !isWordBegin(this.text,a,true))a--
        return this.moveTo(a)
    }
}
// end 2a
export default Cursor
