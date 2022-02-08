const fs = require('fs')
const path = require("path");
var blacklist = [
    'push', '.gitignore', '.git', 'index.html', '.idea', 'gen-sidebar.js',
    'gen-sidebar.min.js','node_modules','.DS_Store','package-lock.json','package.json'
]
// let t = "asdasdff"
//
// ((t.includes('.html')&&t.includes('?')))
var copy = function (src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录
    blacklist.push(dst.slice(dst.lastIndexOf('/')))
    paths = paths.filter(item => blacklist.includes(item) < 0)
    paths.forEach(function (path) {
        var _src = src + '/' + path;
        var _dst = dst + '/' + path;
        fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
            if (err) throw err;
            if (stats.isFile()) { //如果是个文件则拷贝
                let readable = fs.createReadStream(_src);//创建读取流
                let writable = fs.createWriteStream(_dst);//创建写入流
                readable.pipe(writable);
            } else if (stats.isDirectory()) { //是目录则 递归
                checkDirectory(_src, _dst, copy);
            }
        });
    });
}
var checkDirectory = function (src, dst, callback) {
    fs.access(dst, fs.constants.F_OK, (err) => {
        if (err) {
            mkdir(dst);
            callback(src, dst);
        } else {
            callback(src, dst);
        }
    });
}

module.exports = {
    copy,mkdir
}

function mkdir(dirPath) {
    let dir = ''
    if (dirPath.indexOf('/') === 0) {
        dir = '/'
    }
    if (fs.existsSync(dirPath)) {
        return
    }
    const arr = dirPath.split('/');
    for (const dirElement of arr) {
        dir = path.join(dir, dirElement)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}