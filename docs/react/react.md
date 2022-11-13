# 钩子函数(Hook)：

​	Hook是一些可以让你在函数组件里“钩入”React state以及生命周期等特性的函数，是React16.9的新增特性，它可以让我们在不编写class的情况下使用state以及其他的React特性。Hook不能在class组件中使用，简单来说，Hook是专门在函数式组件中使用的，使其拥有class组件一样的功能。

​	**Hook的优点：**

  - 是完全可选的。我们无需重写任何已有的代码就可以使用Hook，不想用则不用。
  - 100%向后兼容。Hook不包含任何破坏性的改动。
  - Hook为已知的React概念提供了更直接的API：props,state,context,refs以及生命周期等。
  - 使得组件间和社区共享Hook变得更便捷。Hook可以让我们从组件中提取状态逻辑，使得这谢谢逻辑可以单独测试并服用。

## useState(state)

​	useState()是一个绑定状态的钩子函数，通过调用它来给组件添加一些内部state。React会在重复渲染时保留这个state。

​	**参数：**

​		state：添加到内部state中的初始值。且该参数只会在第一次渲染时会被用到。

​	**返回值：**

​		数组：

​		- 第一个值：用来获取React中state的值。

​		- 第二个值：修改state值的函数。

**useState()的使用：**

```jsx
// 导入useState()钩子函数
import { useState} from "react";
// 创建函数组件
const Test = ()=>{
    // 绑定数据
    const [count,setCount]  = useState(0)
    const onAdd=()=>{
        setCount((prev) => prev + 1);
    }
    const onSub = ()=>{
          setCount((prev) => prev - 1);
    }
    return (
      <div>
        <h2 style={{ color: "red" }}>{count}</h2>
        <button onClick={onSub}>-</button>
        <button onClick={onAdd}>+</button>
      </div>
    );
}
// 导出函数组件
export default Test
```

## useReducer(reducer,initVal,init)

​	useReducer()是一个useState()的替代版本。常在state逻辑复杂且包含多个子值，或者下一个statey依赖于之前的state时使用，如：购物车中的数据需要进行增删查改多种变化。

​	**参数：**

​		`reducer(state,action)`：整合函数。

		- 对当前state的所有操作都应该在该函数中定义。
		- 该函数的返回值会成为state的新值。
		- state为当前状态，action是派发器传进来的参数。

​		`initVal`：state的初始值，作用和useState(state)中的state一样。

​		`init`：

​	**返回值：**

​		数组：

 - 第一个值：state，用来获取React中state的值。
 - 第二个值：setDispatch，修改state的派发器。用派发器传入的参数来控制reducer函数中对state的操作。

**useReducer()的使用：**

```jsx
// 导入useReducer()钩子函数
import {useReducer} from "react";

const Test = ()=>{
  // 为了避免函数重复渲染，将reducer函数定义在外面
  const reducer = (state, action) => {
    // state:当前count的值     action：setDispatch()传进来值
    switch(action.type){
        case 'add':
          return state + 1;
        case 'sub':
          return state - 1;
    }
  };
  const [count, setDispatch] = useReducer(reducer, 0);

  const onAdd=()=>{
    setDispatch({type:'add'});
  }
  const onSub = ()=>{
    setDispatch({ type: 'sub' });
  }
  return (
    <div>
      <h2 style={{ color: "red" }}>{count}</h2>
      <button onClick={onSub}>-</button>
      <button onClick={onAdd}>+</button>
        {/* 简写版本 */}
      <button onClick={() => setDispatch({ type: "sub" })}>--</button>
      <button onClick={() => setDispatch({ type: "add" })}>++</button>
    </div>
  );
}
export default Test
```

## useEffect(callback,arr)

​	useEffect()是一个“副作用”函数，如获取数据、设置订阅或者手动更改React组件中的DOM等操作都是属于副作用。其实也就是几个生命周期函数（挂载、更新、卸载）的组合。

​	与一般生命周期函数的区别：useEffect()是多个生命周期函数的集合体。

​	useEffect()可以传递两个参数：一个回调函数和需要监听state的数组。数组中可以添加多个state，如果数组为空则表示不监听state，该函数则只会在组件初次渲染时执行一次。

​	**使用场景：**一般在需要在多个生命周期函数中执行同一个操作时使用，而且在函数式组件中不能使用其他生命周期函数，只能通过useEffect()实现该功能。

​	**useEffect()的使用：**

```jsx
// 导入useState()钩子函数
import { useState,useEffect} from "react";
// 创建函数组件
const Test = ()=>{
    // 绑定数据
    const [count,setCount]  = useState(0)
    useEffect(()=>{
    	document.title='数字为：'+count
    	console.log("effect");
        const timeId = setTimeout(()=>{
      		console.log("nihao");
    	},1000)
        // 定义清理函数，该函数会在下一次useEffect()执行后首先执行。
        // 主要用于清除上一次useEffect()带来的影响，如消除定时器
        return ()=>{
             clearTimeout(timeId)
            console.log("初始化后，再次渲染我会比effect先执行。")
        }
  	},[count]);
    const onAdd=()=>{
        setCount((prev) => prev + 1);
    }
    const onSub = ()=>{
          setCount((prev) => prev - 1);
    }
    return (
      <div>
        <h2 style={{ color: "red" }}>{count}</h2>
        <button onClick={onSub}>-</button>
        <button onClick={onAdd}>+</button>
      </div>
    );
}
// 导出函数组件
export default Test
```

## useContent()

## portal

## React.memo()

​	React.memo()是一个高阶函数，它接收另一个组件作为参数，并返回一个具有缓存功能的新组件。经过memo()包装过后，只有组件的props发生变化才会触发组件的重新渲染，反之则只会返回缓存中的内容。

 	**使用场景：**当子组件无变化时，可以不因为父组件的重新渲染而重新渲染。

​	**使用方式：**

```jsx
import React from 'react'
const Test = ()=>{
    return()
}
// 导出函数组件
export default React.memo(Test)
```

## useCallback()

​	useCallback()函数是一个可以对函数进行缓存的钩子函数，可以选择在组件重新渲染时导致函数重复渲染。

​	**参数：**

​	1、回调函数。

​	2、监听的依赖数组

		- 当依赖数组中的变量变化时，函数每次都会重新创建。
		- 不指定依赖数组，回调函数每次都会被重新创建。
		- 指定依赖数组，但没依赖项时，回调函数只会初始化时创建一次。

​	**使用方式：**

```jsx
import {useCallback} from 'react'
const Test = ()=>{
    const test = useCallback(()=>{
        
    },[])
    return ()
}
// 导出函数组件
export default Test
```

## 单页面应用

​	单页面是指只有一个html文件来显示界面，浏览器会只加载一个html文件和全部的js、css文件。

​	优点：

> 1、**良好的交互体验：**由于不需要再重新加载整个界面，页面显示流畅。
>
> 2、**前后端工作分离模式：**后端API通用化，前端负责模板渲染和页面输出。
>
> 3、**减轻服务器压力：**服务器只需要提供数据即可，不用管逻辑和页面合成。	

​	缺点：

>1、**初次加载慢：**由于一次性加载完全部的js和css文件，会导致请求时间加长。
>
>解决方案：
>
>	- vue-roter懒加载（被访问时才按需加载组件）。
>	- 使用CDN加速（使用节点服务器，提高行营速度）。
>	- 服务端渲染（页面由服务端生成）。
>
>2、**不利于SEO：**SEO就是搜索引擎优化的意思，其本质是一个服务器向另一个服务器发起请求，并解析请求内容（url）。由于单页面应用的html在服务器端还没有渲染完部分数据（比如目前的url只是首页的url），这时搜索引擎请求到的html就不是最终全部数据渲染的页面，所以会不利于内容被搜索引擎搜索到。
>
>解决方案
>
>- 服务端渲染（服务器合成完整的html文件再输出到浏览器）。
>- 页面预渲染（prerender-spa-plugin插件实现）。
>- 路由采用h5的history模式（地址栏更优雅）。

## 多页面应用

​	多页面应用是指显示界面是通过多个html文件来实现的，通过请求html文件来获得新的页面。

​	优点：

>1、**具有更强的伸缩性：**可以添加更多的子页面和层级。
>
>2、**SEO功能的优势更突出：**丰富的url可以是搜索引擎能搜索到更多的内容。

​	缺点：

>1、**工作量大：**早期的项目搭建很繁杂。
>
>2、**用户体验差：**页面切换加载缓慢，流畅度不够。



![单、多页面应用区别](C:\Users\24409\Desktop\新建文件夹\img\单、多页面应用区别.png)