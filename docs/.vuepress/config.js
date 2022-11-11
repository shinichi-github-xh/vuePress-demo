module.exports = {
  title: "小辉的博客",
  head: [
    // 添加一个自定义的favicon(网页标签图标)
    ["link", { rel: "icon", href: "/avatar.png" }],
  ],
  themeConfig: {
    logo: "/avatar.png", //左上角logo
    // 导航栏配置
    nav: [
      { text: "首页", link: "/" },
      {
        text: "笔记主页",
        link: "/test/",
      },
    ],
    sidebar: "auto", //侧边栏配置
  },
};