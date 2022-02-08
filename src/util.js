var path = require('path')
var fs = require('fs');
var isAbsolutePath = function (p) {
    return (/^\/.*/).test(p)
}
var getFullPath = function(p) {
    return isAbsolutePath(p)?p:path.join(process.cwd(),p)
}
var readFile =  function(p) {
    return fs.readFileSync(getFullPath(p), 'utf-8')
}
var getRelativePath = function (p) {
    let commonPath = path.join(process.cwd(),'/')

    if (p.substr(0,1)!='/') {
        console.log(1)

        return p
    }
    if ((/^\./).test(p)){
        console.log(2)

        return p
    }
    if (commonPath==path.join(p,'/')){
        console.log(3)

        return './'
    }
    if (p.includes(commonPath)){
        console.log(4)
        return p.replace(commonPath,'./')
    }
    console.log(5)
    let pArr = (p.split('/')).filter(item => item.length)
    let cArr = (commonPath.split('/')).filter(item => item.length)
    let clen = cArr.length
    let newCommonPath = ''
    let i = 0
    for (i;i<clen;i++) {
        if (pArr[i]!=cArr[i]){
            break
        }
        newCommonPath+='/'+cArr[i]
    }
    return path.join("../".repeat(cArr.slice(i).length),p.replace(path.join(newCommonPath,'/'),''))
}
module.exports = {isAbsolutePath,getFullPath,readFile,getRelativePath}