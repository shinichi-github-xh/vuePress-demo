---
siderbar：4
---
# vuePress-demo
## 🔆基础环境搭建

    - node.js
    - yarn(推荐)或npm

### 初始化项目：

创建文件目录并进入该文件目录下：

    $ mkdir vuepress-demo
    $ cd vuepress-demo

初始化项目：

    $ yarn init -y

### 安装vuepress:

​	安装为本地依赖（官方不建议全局安装）

```css
$ yarn add -D vuepress  
```

### 实现holle world：

​	1、创建docs文件夹：

```css
$ mkdir docs
```

​	2、将`# Hello VuePress!`写入README.md文件：

```css
$ echo '# Hello VuePress!' > docs/README.md
```

​	3、在`package.json`文件中添加`script`配置：

```css
 "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
```

​	4、启动本地服务器：

```css
$ yarn docs:dev 
```

​	5、打开网站：

```css
http://localhost:8080/
```

