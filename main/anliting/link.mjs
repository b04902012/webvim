import fs from'fs'
import rollup from'rollup'
let
    skip=[
        'https://cdn.rawgit.com/anliting/module/533c10b65a8b71c14de16f5ed99e466ddf8a2bae/src/esm/moduleLoader.js',
        'https://gitcdn.link/cdn/anliting/simple.js/3b5e122ded93bb9a5a7d5099ac645f1e1614a89b/src/simple.static.js',
    ]
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
        external:s=>skip.includes(s),
    })
    fs.writeFileSync(
        file,
        `/*${fs.readFileSync('license')}*/${
            (await bundle.generate({
                format:'es',
                paths:s=>skip.includes(s)&&s,
            })).output[0].code
        }`
    )
}
link(`main/Vim.js`,`dist/Vim.js`)