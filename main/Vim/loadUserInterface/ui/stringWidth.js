import npmStringWidth from '../../../../lib/string-width.js'
function charWidth(c){
    if(c=='\t')
        return 8
    return npmStringWidth(c)
}
function stringWidth(s){
    let res=0
    for(let i=0;i<s.length;i++)
        res+=charWidth(s[i])
    return res
}
export default stringWidth
