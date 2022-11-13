// 导入日期格式化库：moment
// 

module.exports = {
  // 增强SEO的描述
  title: "小辉的博客",
  head: [
    // 添加一个自定义的favicon(网页标签图标)
    ["link", { rel: "icon", href: "/avatar.png" }],
    ["meta", { name: "author", content: "小辉" }],
    [
      "meta",
      { name: "keywords", content: "vue,react,git,vuepress,个人博客，小辉" },
    ],
  ],
  // 设置路径别名
  configureWebpack: {
    resolve: {
      alias: {
        "@gitImgs": "./public/utilsImgs/gitImgs",
      },
    },
  },
  // 默认主题的配置
  themeConfig: {
    lastUpdated: "更新时间：", //git提交的最后时间
    logo: "/avatar.png", //左上角logo
    displayAllHeaders: true, // 显示所有页面的标题链接
    // 导航栏配置
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "前端技术栈",
        items: [
          {
            text: "vue",
            link: "/vue/",
            items: [
              { text: "es6相关内容", link: "/vue/es6/" },
              { text: "vuecli", link: "/vue/vuecli" },
              { text: "vueBase", link: "/vue/vueBase" },
              { text: "vuex", link: "/vue/vuex" },
            ],
          },
          {
            text: "工具",
            link: "/utils/",
            items: [{ text: "git基础", link: "/utils/git" }],
          },
          {
            text: "react",
            link: "/react/",
            items: [{ text: "react钩子", link: "/react/" }],
          },
        ],
      },
      {
        text: "面试题",
        link: "/interview/",
      },
    ],
    // 侧边栏配置
    sidebar: "auto", //根据内容自动展示
    // sidebar: {
    //   "/vue/": [
    //     "",
    //     "vuecli",
    //     "vuex",
    //   ],
    //   "/react/": ["", "react"],
    //   // 根路径，路径节点少的一定要放下面
    //   "/": ["", "/vue/"],
    // },
  },
};
