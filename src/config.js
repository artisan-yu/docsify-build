module.exports =  {
    suffix:'.html',
    name: 'YU Blog',
    repo: 'ayu-666/blog',
    routerMode: 'history',
    loadSidebar: true,
    subMaxLevel: 2,
    auto2top: true,// 切换文档自动回顶部
    search: {
        maxAge: 86400000,// 索引过期时间，单位毫秒，默认一天
        paths: 'auto',
        placeholder: '搜索',
        noData: '找不到结果',
        depth: 3,// 搜索标题的最大层级, 1 - 6
        hideOtherSidebarContent: false, // 是否隐藏其他侧边栏内容
    },
    count: {countable: true, fontsize: '0.9em', color: 'rgb(90,90,90)', language: 'chinese'},
}
