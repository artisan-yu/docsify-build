#!/usr/bin/env node
var path = require('path')
var cp = require('./cp')
var Renderer = require('./docsify-build-renderer')
const fs = require('fs');
var util = require('./util')
var renderer
const yArgsParser = require("yargs-parser");
const args = yArgsParser(process.argv.slice(2));

if (args['help']) {
    console.log(`[build docsify program as html]
dosify-build args:
    --o output path default ./dist
    --d docs path default ./
    --t template path
    --c config path
`);
    return
}
var outputPath = args['o']?args['o']:path.join(process.cwd(),'dist')
var basePath = args['d']?args['d']:'./'
var configPath = args['c']?args['c']:path.join(__dirname,'config.js')
var templatePath = args['t']?args['t']:path.join(__dirname,'template.html')
var customConfig = require(configPath)
const {getRelativePath, readFile} = require("./util");
var docsPath = util.getRelativePath(basePath)
var config = {}
config.template=util.readFile(templatePath)
config.config=customConfig
config.config.basePath = basePath
async function build(_config){
    if (!checkIndexHtml()){
        console.error("please select a correct docsify directory")
        return
    }
    cp.copy(docsPath, outputPath)
    renderer = new Renderer(config)
    await generateHtml('/', getContent(docsPath))
}

function checkIndexHtml(){
    try {
        let data = readFile(path.join(docsPath,'index.html'))
        return data.includes('docsify')
    }catch(e){
    }
    return false
}












function getContent(_path, _dir = "/") {
    const blacklist = [
        '_sidebar.md',
        'img',
        "CNAME", "node_modules",'dist'
    ]
    let fsResult = (fs.readdirSync(_path)).filter(item => !((/^\.+.*/).test(item)))
    fsResult = fsResult.filter(item => blacklist.indexOf(item) < 0)
    fsResult.sort((a, b) => {
        return a - b
    })
    let result = {}
    for (const i in fsResult) {
        let item = fsResult[i]
        let title = getTitle(_path + "/" + item, item)
        if (fs.lstatSync(_path + "/" + item).isDirectory()) {
            result[title] = (getContent(_path + "/" + item, item))
        } else if (/.*\.md$/.test(item)) {
            let mdPath = (_path.replace(docsPath, "") + "/" + item)
                .replace(/\s/g, '%20')
                .replace(/\?/g, '%3F')
                .replace(/\)/g, '%29')
                .replace(/#/g, '%23')
            if (mdPath.indexOf('/') == 0) {
                mdPath = mdPath.slice(1)
            }
            result[title] = mdPath
        }
    }
    return result
}
function getTitle(path, md) {
    //默认用文件名做标题
    let title = md.substr(0, md.length - 3)
    if (md.toLowerCase() == "readme.md") {
        //readme文件用根目录表示
        title = "README"
    } else if (md.indexOf('.md') < 1) {
        //非md文件
        title = md
    } else {
        let data = fs.readFileSync(path, 'utf8').split("\n")
        for (const i in data) {
            if (/^(\s*#){1}\s+.*/.test(data[i])) title = data[i].replace(/^(\s*#){1}\s+/, "");
            break
        }
    }
    return title
}

async function generateHtml(currPath, dirObj) {
    let temp = ""
    for (let key in dirObj) {
        //可能是链接，可能是文件夹
        let item = dirObj[key]
        if (typeof item == "string") {
            item = item.replace(/\.md/g, '')
            let dirPath = path.join(outputPath, currPath)
            cp.mkdir(dirPath)
            let savePath = decodeURIComponent(path.join(outputPath, item))//.replace(/\s/g,'\ ')
            await renderAndSave(savePath, "/" + item)
        } else if (typeof item == "object") {
            await generateHtml(currPath + '/' + key, item)
        }
    }
    return temp
}
async function renderAndSave(savePath, url) {
    url = decodeURIComponent(url)
    console.log("\nrender html:\n", url, "\n", savePath, "\n")
    let html = await renderer.renderToString(url)
    savePath = savePath.replace(/readme/gi, 'index')
    fs.writeFile(savePath+'.html', html, {encoding: 'utf8'}, err => {
        if (err) {
            throw err;
        }
    });
}

build(config)
