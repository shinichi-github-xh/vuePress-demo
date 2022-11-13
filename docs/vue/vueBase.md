---
sidebar:4
---
# 🔆 模板语法

​	所谓的模板语法，就是通过一套规定好的编写方式。而Vue的模板语法，就是主要通过template、script和style标签所组成的**一套格式模板**。它使得我们能够声明式地将组件实例的数据绑定到呈现的DOM上，方便我们实现响应式地进行页面的更新。

​	Vue通过其底层机制会**将模板编译成**高度优化的JavaScript代码，结合其响应式系统，Vue能够智能地推导出需要重新渲染组件的最少数量和最少的DOM操作。

​	如果对虚拟DOM的概念比较熟悉的话，也**可以结合可选的JSX手写渲染函数**而不采用模板。但请注意，这将不会享受到和模板同等级别的编译时优化。

# 🔆 响应式基础

## **响应式：** 

​	响应性是一种可以使我们声明式地处理变化的编程范式。

​	Vue的响应式，就是指当js代码中的响应式状态发生改变时，ui视图会随即自动更新。其功能的实现主要就是通过数据劫持侦测数据变化，用发布订阅模式进行依赖收集与视图更新。

## **声明响应式状态示例：**

```vue
<script>
import { reactive，ref } from 'vue'

export default {
  // `setup` 是一个专门用于组合式 API 的特殊钩子函数
  // 要在组件模板中使用响应式状态，需要在setup()函数中定义并返回
  setup() {
    // reactive()函数可以创建一个响应式对象或数组   
    const state = reactive({ count: 0 })
    // ref()函数可以创建一个任意类型的响应式状态   
    const isShow = ref(true)
    
	function increment() {
      state.count++
    }
    // 将状态暴露到模板
    return {
      state,
      isShow,
      increment  
    }
  }
}
</script>
<template>
	<button v-if="isShow" @click="increment">
  		{{ state.count }}
	</button>
</template>
```

​	由于在setup()函数中手动暴露大量的状态和方法非常频繁，所以我们可以通过构建工具来简化该操作，如使用：< script setup>

```vue
<script setup>
  import { reactive } from 'vue'
    
  const state = reactive({ count: 0 })
  function increment() {
    state.count++
  }
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

## **DOM更新时机：**

​	响应式状态更改后，DOM会自动更新。但这并不是同步生效的，而是由Vue将它们缓存在一个队列中，直到下一个“tick”才一起执行。这是为了确保每个组件无论发生几次改变，都仅执行一次更新`(类似于一个防抖的机制吧)`。

​	如果我们想要获取下一次DOM更新的时机，可以使用nextTick()这个工具方法。如：

```vue
<script setup>
import { ref, nextTick } from 'vue'

const count = ref(0)

async function increment() {
  count.value++

  // DOM 还未更新
  console.log(document.getElementById('counter').textContent) // 0
  // nextTick()会在状态改变后立即使用，以等待DOM更新完成
  // nextTick()可以接收一个回调函数作为参数，在该函数内你访问到的值是更新后的值
  await nextTick(()=>{
      console.log("count:",count) // 1
  })
  // DOM 此时已经更新
  console.log(document.getElementById('counter').textContent) // 1
}
</script>

<template>
  <button id="counter" @click="increment">{{ count }}</button>
</template>

```

## 响应式代理 vs. 原始对象:

​	vue的响应式状态是一个代理对象，它和原始对象是不全等的。只有代理对象是响应式的，更改原始对象不会触发更新。

​	为了保证访问代理的一致性，对同一个原始对象调用reactive()总是会返回相同的代理对象，代理对象调用reactive()则返回其代理对象本身。

**示例：**

```vue
<script setup>
    import { reactive} from 'vue'
    const raw = {}
	const proxy = reactive(raw)

	// 代理对象和原始对象不是全等的
	console.log(proxy === raw) // false
	// 在同一个对象上调用 reactive() 会返回相同的代理
	console.log(reactive(raw) === proxy) // true
	// 在一个代理上调用 reactive() 会返回它自己
	console.log(reactive(proxy) === proxy) // true
</script>
```

## reactive()的局限：

 - 仅对`对象类型有效`（如：Object、Array、Map、Set等集合类型），对`原始类型无效`（如：string、number、boolean等）
   - 因为Vue的响应式系统是通过属性访问进行追踪的，因此我们必须`保持该响应式的相同引用`。

```vue
<script setup>
    import { reactive} from 'vue'
	let state = reactive({ count: 0 })
    
	// test这样定义将会报错
    let test = reactive("nihao")
    
	// 上面的引用 ({ count: 0 }) 将不再被追踪（因引用对象发生改变，响应性连接已丢失！）
	state = reactive({ count: 1 })
</script>
```

## ref():

​	`reactive()`的限制归根结底是因为javaScript没有作用于所有值类型的引用机制。为此，Vue提供了`ref()`方法来允许我们创建可以使用任何值的响应式ref。

​	**示例：**

```vue
<script setup>
	import { ref } from 'vue'
	
	const count = ref(0)
    // @ref()是响应性语法糖，通过Vue提供的这种编译时转换，可以省去我们使用.value的麻烦
    let str = $ref("你好")
    console.log(str) // 你好
	console.log(count) // { value: 0 }
	console.log(count.value) // 0
    
	// 响应式地更新count的值
	count.value++
	console.log(count.value) // 1
    
    const objectRef = ref({ count: 0 })
	// 这是响应式的替换
	objectRef.value = { count: 1 }
 	
</script>
```



# 🔆 计算属性

​	是用来描述依赖响应式状态的复杂逻辑，其本质就是计算响应式状态并获得计算后的结果。

​	**特点：**

​		1、计算属性值会基于响应式依赖被缓存，如果依赖的响应式依赖未发生改变，则返回原先的计算结果，也不用重复执行getter函数。

​		2、getter的职责应该仅为计算和返回该值，不应有其他副作用（做其他的操作）。

​		3、计算属性的返回值是派生状态，我们可以把它当为一个响应式依赖的“临时快照”（复制体），每当响应式依赖更新时，就会创建一个新的快照，因此更改计算属性的值是没意义的，我们在使用计算属性时应该更新它所依赖的源状态以触发新的计算。

​	**示例：**

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性 ref
const bookRes = computed(() => {
    //此时的author.books就是一个响应式依赖
    //而vue则会自动追踪响应式依赖并将其于bookRes所绑定起来
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ bookRes }}</span>
</template>

```


# 🔆 侦听器

​	一种通过监听数据变化产生副作用的函数。有时候我们需要在状态发生变化时去执行一些”副作用“：例如根据异步操作的结果去修改另一处的状态。

​	**示例：**

```vue
<script setup>
import { ref, watch } from 'vue'

const url = ref('https://...')
const data = ref(null)

async function fetchData(newData,oldData) {
  const response = await fetch(url.value)
  data.value = await response.json()
}
    
// 函数不会立即执行，当url发生变化时执行fetchData这个回调函数
// 这个是直接触发监听，当监听的状态发生变化则产生副作用
watch(url, fetchData)
    
// 函数会立即执行并自动追踪url.value作为依赖
// 也就是只有负作用产生才会触发监听
watchEffect(async (newData,oldData) => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="url" />
  </p>
  <p>{{ data }}</p>
</template>

```

## 选择侦听器或计算属性：

​	数据变化频繁时使用`侦听器`。

​	需要根据数据变化而产生副作用时使用`侦听器`。

​	需要使用到所监听状态的新值与旧值时使用`侦听器`。

​	数据变化不频繁且需要对数据进行”加工“时使用`计算属性`。

​	总结：监听响应依赖而已的话能用计算属性就用`计算属性`，要做其他的操作的话就用`侦听器`。

# 🔆 单项数据流

​	Vue中所有的props都遵循着**单向绑定**原则，即props会因父组件的更新而变化，自然地将新的状态向下传递给子组件，但并不会逆向传递。因此，我们不该在子组件中更改任意的prop，如果有需要改动prop的需求，基本是出现以下两种场景：

​	**示例：**

```vue
<script>
  // 场景一：prop仅被用做于初始值时
    const props = defineProps(['initialCounter'])
	// 计数器只是将 props.initialCounter 作为初始值
	// 像下面这样做就使 prop 和后续更新无关了
	const counter = ref(props.initialCounter)
    
  // 场景二：需要对传入的prop值做进一步处理时： 
    const props = defineProps(['size'])
	// 该 prop 变更时计算属性也会自动更新
	const normalizedSize = computed(() => props.size.trim().toLowerCase())
</script>
```

# 🔆 透传Attributes

​	“透传 attribute”指当一个组件以单个元素为根作渲染时，在组件上使用的属性会自动被添加到根元素上。尽管该组件并没有声明该属性，如：props或 emits 的属性或者 `v-on` 事件监听器。最常见的例子就是 `class`、`style` 和 `id`。

​	**示例：**

​	举例来说，假如我们有一个 `<MyButton>` 组件，它的模板长这样：

```html
<!-- <MyButton> 的模板 -->
<button class="btn">click me</button>
```

​	一个父组件使用了这个组件，并且传入了 `class`：

```html
<MyButton class="large" />
```

​	最后渲染出的 DOM 结果是：

```html
<button class="btn large">click me</button>
```

**Tips⭐:**

> 1、如果`v-on`所绑定的事件被透传到子组件中，而且父子组件中都具有该事件，那么两个事件都会被触发。
>
> 2、如果子组件是在父组件的根节点渲染，那么父组件接收到的透传attributes也会被透传给子组件，这种行为被成为**深层组件继承**。
>
> 3、父组件中声明过的`props`或`emits`声明的`v-on`侦听函数不会被透传，换句话说，它们已经被父组件“消费”了。
>
> 4、透传的attribute若符合声明也可以作为prop传入子组件。
>
> 5、接收到透传的attributes会失去其响应式。

## 禁用Attributes：

​	如果你**不想要**一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

​	**示例：**	

​	1、如果你使用了 `<script setup>`，你需要一个额外的 `<script>` 块来书写这个选项声明：

```vue
<script>
	// 使用普通的 <script> 来声明选项
	export default {
  		inheritAttrs: false
	}
</script>

<script setup>
	// ...setup 部分逻辑
</script>

```

## 访问Attributes:

​	1、透传进来的 attribute 可以在模板的表达式中直接用 `$attrs` 访问到。

​	**示例：**

```html
<span>Fallthrough attribute: {{ $attrs }}</span>

<!-- 指定标签内访问attribute -->
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

​	2、使用 `useAttrs()` API 来访问一个组件的所有透传 attribute：

​	**示例：**

```VUE
<script setup>
	import { useAttrs } from 'vue'
	const attrs = useAttrs()
</script>

```

```vue
<script>
	export default {
        // 如果没有使用 <script setup>，attrs 会作为 setup() 上下文对象的一个属性暴露：
  		setup(props, ctx) {
    	// 透传 attribute 被暴露为 ctx.attrs
    	console.log(ctx.attrs)
  	  }
	}
</script>
```

# 🔆 组件传值

## 父组件向子组件传值：

```vue
<!-- App.vue-->
<script setup>
  import { ref } from 'vue'
  import ChildComp from './ChildComp.vue'

  const forSonData = ref('Hello from parent')
</script>

<template>
	<!-- 父组件会通过标签属性的方式给子组件传值 -->
  <ChildComp :msg="forSonData"/>
</template>

```

```vue
<!-- ChildComp.vue -->
<script setup>
  // 子组件通过props定义接收的值
  const props = defineProps({
    msg: String
  })
</script>

<template>
  <h2>{{ msg || 'No props passed yet' }}</h2>
</template>

```

## 子组件向父组件传值：

```vue
<!-- App.vue-->
<script setup>
  import { ref } from 'vue'
  import ChildComp from './ChildComp.vue'

  const childMsg = ref('No child msg yet')

  // 该函数中的参数为子组件中发射出来的数据
  const getSon = (msg)=>{
    childMsg.value = msg
  }
</script>

<template>
<!-- 在父祖件中使用v-on监听子组件发送的事件 -->
  <ChildComp @response="getSon"/>
<!-- 简写 -->
  <ChildComp @response="msg => childMsg = msg"/>
  <p>{{ childMsg }}</p>
</template>
```

```vue
<!-- ChildComp.vue -->
<script setup>
  // 声明要发送的事件
  const emit = defineEmits(['response','test'])
  // 将指定事件发送出去：事件名称、内容
  emit('response', 'form son data')
  emit('test', '这是声明的第二个事件，仅做测试')
</script>

<template>
  <h2>Child component</h2>
</template>
```

## 依赖注入：

​	通常情况下，我们要从父组件向子组件传递数据是使用props，但显然，当我们的层级达到一定程度的时候，使用props逐级传递下去的话会很麻烦，这个问题被称为“props逐级透传”。

![props传值原理图](Vue基础学习.assets/image-20221104093951159.png)

​	为了解决“props逐级透传”的问题，我们可以使用`provide`和`inject`来实现组件间的传值。

​	其使用原理是：父组件相对于其所有的后代组件是作为`依赖提供者(provide)`，而其后代的所有组件树，无论层级有多深，都可以通过`注入(inject)`来获取父组件提供给整条链路的依赖。

![依赖注入原理图](Vue基础学习.assets/image-20221104094840572.png)

### 	**示例：**

​	`provide()` 函数接收两个参数。第一个参数被称为**注入名**，可以是一个字符串或是一个 `Symbol`。第二个参数是提供的值，值可以是任意类型，包括响应式的状态，比如一个 ref：

```vue
<!-- App.vue -->
<script setup>
	import {ref,provide } from 'vue'
	const count = ref(0)
    
	provide('message','hello!')
    provide('key', count)
</script>
```

​	除了在组件中提供依赖，还可以在整个应用层面提供依赖：

```js
// main.js
import { createApp } from 'vue'

const app = createApp({})

app.provide('message','hello!')
```

​	依赖注入：

```vue
<!-- 注入方组件 -->
<script setup>
	import { inject } from 'vue'
    // 为防止注入名没有被任何组件提供，我们应该声明一个默认值，默认值不要求必须有提供者
	const message = inject('message','这是默认值')
</script>
```

**Tips⭐：**

>​	如果提供的值是一个 ref，注入进来的会是该 ref 对象，而**不会**自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。
>
>​	如果没有使用 `<script setup>`，`provide()`和`inject()` 需要在 `setup()` 内同步调用。

### 使用Symbol作为注入名：

​	当我们构建大型应用时，会包含非常多的依赖提供，为防止注入名冲突，我们可以使用Symbol作为注入名，因为Symbol的引用地址是唯一的。

​	通常我们会单独创建一个文件用来导出注入名：

```js
// keys.js
export const myInjectionKey = Symbol()

```



```js
// 在供给方组件中
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

// 假如myInjectionKey指向的内存地址是 0x123
provide(myInjectionKey, { /*要提供的数据*/ });
```



```js
// 注入方组件
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

// 此时myInjectionKey指向的内存地址也是 0x123
const injected = inject(myInjectionKey)

```



# 🔆 插槽

​	Vue中的插槽可以理解为一个占位符。子组件通过插槽预留空间，父组件在使用子组件时往其标签内添加内容，而该内容则会替换掉子组件中的插槽，占用为其所预留的空间。

​	`<slot>`元素是一个插槽出口，用来标识父元素提供的插槽内容将在那里被渲染。

![默认插槽替换模型](Vue基础学习.assets/image-20221103165921677.png)

## 默认插槽：

​	一般的，如果`<slot>` 标签没有指定name属性，则组件标签中的内容会全部作为插槽区域的内容。而且插槽也可以指定默认内容，但最终会在被使用时的内容所覆盖。

​	**示例：**	

​	1、这里有一个 `<FancyButton>` 组件，可以像这样使用：

```vue
<!-- App.vue -->
<FancyButton>
  Click me! <!-- 插槽内容 -->
</FancyButton>
```

​	2、而 `<FancyButton>` 的模板是这样的：

```vue
<!-- FancyButton.vue -->
<button class="fancy-btn">
  <slot> 123 </slot> <!-- 插槽出口,123为该插槽默认内容 -->
</button>
```

​	3、最终渲染出的 DOM 是这样：

```vue
<button class="fancy-btn">Click me!</button>
```

​	通过使用插槽，`<FancyButton>` 仅负责渲染外层的 `<button>` (以及相应的样式)，而其内部的内容由父组件提供。	

​	从这三个步骤中我们可以很清楚的看到，这个插槽的作用就类似于一个函数的传参区域，其参数值则进入函数内部被使用。用函数的例子来理解我们可以看下面这个示例：

```js
// 父元素传入插槽内容
FancyButton('Click me!')

// FancyButton 在自己的模板中渲染插槽内容
function FancyButton(slotContent) {
  return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

**Tips⭐:**

>Vue模板中的表达式只能访问其定义时所处的作用域。
>
>插槽内容可以访问父组件中的数据作用域，因为插槽内容本身实在父组件模板中定义的。

## 具名插槽：

​	`<slot>` 元素可以有一个特殊的 attribute `name`，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容。这种插槽就被称之为具名插槽。

![具名插槽替换模型](Vue基础学习.assets/image-20221103212001952.png)

​	**示例：**

```vue
<!-- BaseLayout.vue -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

```

​	我们可以在父组件中使用`v-slot`指令绑定目标插槽的名称 ,该模板内的内容则会替换对应的具名插槽所占的位置。且`v-slot` 有对应的简写 `#`，因此 `<template v-slot:header>` 可以简写为 `<template #header>`。

```vue
<!-- App.vue -->
<BaseLayout>
  <template  v-slot:header>
    <h1>Here might be a page title</h1>
  </template>
    
	<!-- 隐式的默认插槽 -->
    <p>这种没指定插槽的就替换默认插槽</p>
    <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
    
    <!-- 动态插槽名 -->
  <template #[SlotName]>
    ...
  </template>
</BaseLayout>
```

​	当一个组件同时接收**默认插槽**和**具名插槽**时，所有位于顶级的非 `<template>` 节点都被隐式地视为默认插槽的内容。

​	最终DOM渲染的结果为：

```vue
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>这种没指定插槽的就替换默认插槽</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

## 作用域插槽：

​	在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。通过子组件标签上的 `v-slot` 指令，插槽可以直接接收到了一个插槽 props 对象，父组件传入插槽的 props 作为了 `v-slot` 指令的值，可以在插槽内的表达式中访问。

![默认插槽props模型图](Vue基础学习.assets/image-20221103213835472.png)

​	**示例：**

### 默认作用域插槽：

​	向默认插槽中传入props:

```vue
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="Message" :count="1"></slot>
</div>
```

​	当需要接收插槽 props 时，默认插槽和具名插槽的使用方式有一些小区别。

```vue
<!-- App.vue -->
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>

<!-- 我们还可以在v-solt中使用解构 -->
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### 具名作用域插槽：	

​	向具名插槽中传入props:

```vue
<!-- <MyComponent> 的模板 -->
<slot name="header" message="hello"></slot>
```

​	在父组件中接收props:

```vue
<!-- App.vue -->
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>
</MyComponent>
```

**Tips⭐：**

>1、注意插槽上的 `name` 是一个 Vue 特别保留的 attribute，不会作为 props 传递给插槽。因此最终 `headerProps` 的结果是 `{ message: 'hello' }`。
>
>2、如果你混用了具名插槽与默认插槽，则需要为默认插槽使用显式的 `<template>` 标签。尝试直接为组件添加 `v-slot` 指令将导致编译错误。

### 混合作用域插槽：

​	使用**默认作用域插槽**和**具名作用域插槽**的例子：

```vue
<template>
  <MyComponent>
      
    <!-- 这种写法会报错，因为<slot>默认是会有name:default -->
    <template v-slot="{ message }">
      <p>{{ message }}</p>
    </template> 
      
    <!-- 改为使用显式的默认插槽 -->
	<template v-slot:default="{ message }">
      <p>{{ message }}</p>
    </template>
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```

# 🔆 异步组件

​	所谓的异步组件，就是指该组件不是与程序同步加载的，只会在需要它渲染时才会通过异步加载的方式进行加载。为此，Vue给我们提供了`defineAsyncComponent`方法来实现这个功能：

​	当我们需要从服务器加载相关组件时，可以这样做：

```vue
<script>
    import { defineAsyncComponent } from 'vue'
	
    //defineAsyncComponent 方法接收一个返回 Promise 的加载函数。
	const AsyncComp = defineAsyncComponent(() => {
  	return new Promise((resolve, reject) => {
    	// ...从服务器获取组件
   	    resolve(/* 获取到的组件 */)
        reject(/* 错误处理 */)
  	  })
	})
// ... 像使用其他一般组件一样使用 `AsyncComp`
</script>
```

​	使用ES模块动态导入：

```js
import { defineAsyncComponent } from 'vue'

// 此时的AsyncComp还不是异步组件，只在页面需要它渲染的时候才调用加载，此时还并未加载。
const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

​	**加载与错误状态**

```js
// 当异步操作出错时，我们可以通过defineAsyncComponent的高级选项中处理这些错误状态。
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})

```

# 🔆 组合函数

​	“组合函数”，就是一个利用Vue组合式API来封装和复用**有状态逻辑**的函数。可复用、有状态逻辑、灵活是他的代名词。

​	如果我们有这么一个需求：跟踪当前鼠标在页面中的位置。

## 基础示例：

​	在组合式API中实现是这样的：

```vue
<!-- App.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>

```

​	上面的示例的运行的结果并没什么问题，但当我们想要在多个组件中复用这个相同的逻辑呢？这时我们可以以一个组合式函数的形式提取到外部文件中：

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
  return { x, y }
}
```

​	然后再在组件中调用该组合式函数：

```vue
<!-- App.vue -->
<script setup>
	import { useMouse } from './mouse.js'
	// 可以很明显的看到，处理逻辑完全一样，但我们在组件中只需要接收update()所返回的状态即可。
	const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

**Tips⭐：**

>1、一个组合式函数还可以调用一个和多个其他的组合式函数。这使得我们像使用多个组件组成整个应用一样，用多个较小且逻辑独立的单元组合形成复杂的逻辑。实际上，这也是为什么该设计模式的API集合命名为组合式API的原因。
>
>2、每一个`useMouse()`的组件实例会创建其独有的`x`、`y`状态拷贝，因此它们不会互相影响。
>
>3、为确保Vue能够清楚地跟踪到当前调用组件式函数的实例，在`<script setup>` 或` setup()` 钩子中，应始终被同步地调用。

## 异步状态示例：

​	在做异步数据请求时，我们常常需要处理不同的状态：加载中、加载成功和加载失败。

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

​	将其抽取作为组合式函数后：

```js
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // 在请求之前重设状态...
    data.value = null
    error.value = null
    // unref() 解包可能为 ref 的值
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }
  // isRef()可以检查该状态是否为响应式ref
  if (isRef(url)) {
    // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
    watchEffect(doFetch)
  } else {
    // 否则只请求一次
    // 避免监听器的额外开销
    doFetch()
  }
  return { data, error }
}
```

```vue
<script setup>
  import { useFetch } from './fetch.js'
  
  const { data, error } = useFetch('url')
</script>
```

## 选项式API中使用组合式函数：

​	如果你正在使用选项式 API，组合式函数必须在 `setup()` 中调用。且其返回的绑定必须在 `setup()` 中返回，以便暴露给 `this` 及其模板：

```vue
<script>
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以在通过 `this` 访问到
    console.log(this.x)
  }
  // ...其他选项
}
</script>

```

## 与其他模式的比较：

### 	和Mixin：

1. **不清晰的数据来源**：当使用了多个 mixin 时，实例上的数据属性来自哪个 mixin 会变得不清晰。而组合式函数中通过使用 ref + 解构模式：让属性的来源在消费组件时一目了然。
2. **命名空间冲突**：多个来自不同作者的 mixin 可能会注册相同的属性名，造成命名冲突。若使用组合式函数，你可以通过在解构变量时对变量进行重命名来避免相同的键名。
3. **隐式的跨 mixin 交流**：多个 mixin 需要依赖共享的属性名来进行相互作用，这使得它们隐性地耦合在一起。而一个组合式函数的返回值可以作为另一个组合式函数的参数被传入，像普通函数那样。

### 	和无渲染组件：

>​	无渲染组件：就是指只主要负责逻辑处理，且其状态会通过作用域插槽的方式将状态暴露出去，把渲染内容的工作交给消费组件来实现的组件。

​	**性能开销：**组合式函数不会产生额外的组件实例开销。

**Tips⭐：**

> 推荐在**纯逻辑复用**时使用组合式函数，在需要同时**复用逻辑**和**视图布局**时使用无渲染组件。

### 	和React Hooks：

​	**执行模型不同：**其实组合式函数在逻辑与能力上与React Hooks相近，但Vue的组合式函数是基于Vue细粒度的响应性系统。

# 🔆 自定义指令

​	前面已经学过两种在Vue中重用代码的方式：组件和组合式函数，而除此之外，还有自定义指令。

## **区别：**

 - **组件：**注重构建模块。
 - **组合式函数：**注重有状态的逻辑。
 - **自定义指令：**注重设计普通元素的底层DOM访问的逻辑。

## 示例：

```vue
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <!-- vFocus => v-focus -->
  <input v-focus />
</template>
```

​	一般我们只需要在 `mounted` 和 `updated` 上实现相同的行为，除此之外并不需要其他钩子。这种情况下我们可以直接用一个函数来定义指令，如下所示：

```vue
<!-- App.vue -->
<script setup>
 directives: {
    // 在模板中启用 v-focus
    color: (el, binding) => {
      // 这会在 `mounted` 和 `updated` 时都调用
      el.style.color = binding.value
    })
  }
</script>

<template>
  <div v-color="color"></div>
</template>
```

​	将自定义指令全局注册到应用层：

```js
// mian.js
const app = createApp({}) 
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

**Tips⭐：**

> ​	只有当所需功能只能通过直接的 DOM 操作来实现时，才应该使用自定义指令。其他情况下应该尽可能地使用 `v-bind` 这样的内置指令来声明式地使用模板，这样更高效，也对服务端渲染更友好。

# 🔆 插件

​	插件 (Plugins) 是一种能为 Vue **添加全局功能**的**工具代码**。

​	**示例：**

​	创建一个插件：

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
      
    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key) => {
      // 获取 `options` 对象的深层属性
      // 使用 `key` 作为索引
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

​	我们的 `$translate` 函数会接收一个例如 `greetings.hello` 的字符串，在用户提供的翻译字典中查找，并返回翻译得到的值。

​	用于查找的翻译字典对象则应当在插件被安装时作为 `app.use()` 的额外参数被传入：

```js
// main.js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

​	由于我们使用了`app.config.globalProperties`全局注册了，所以可以通过`$`使用该函数:

```html
<h1>{{ $translate('greetings.hello') }}</h1>
```

​	我们一开始的表达式 `$translate('greetings.hello')` 就会在运行时被替换为 `Bonjour!` 了。

# 🔆 内置组件

## `<Transition>`:

​	`<Transition>` 是一个内置组件，它会在一个元素或组件进入和离开 DOM 时应用动画。进入或离开可以由以下的条件之一触发：

- 由 `v-if` 所触发的切换。
- 由 `v-show` 所触发的切换。
- 由特殊元素 `<component>` 切换的动态组件。

​	**示例：**

```vue
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* 这些class就是<Transtion>的默认class */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

**Tips⭐:**

>​	`<Transition>` 仅支持单个元素或组件作为其插槽内容。如果内容是一个组件，这个组件必须仅有一个根元素。

## `<TransitionGroup>`:

​	`<TransitionGroup>` 是一个内置组件，用于对 `v-for` 列表中的元素或组件的`插入`、`移除`和`顺序改变`添加动画效果。

​	**示例：**

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

## `<KeepAlive>`:

​	`<KeepAlive>` 是一个内置组件，它的功能是在多个组件间动态切换时**缓存被移除的组件实例**。

​	默认情况下，一个组件实例被替换后会被销毁，而被`<keepAlive>`包裹的组件被替换后会被缓存，只是处于不活跃状态，并非被销毁，其组件状态仍旧保留。

```vue
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
    <!-- activeComponent是组件实例对象名称 -->
  <component :is="activeComponent" />
</KeepAlive>
```

​	**`<keepAlive>`的props:**

​	`<KeepAlive>` 默认会缓存内部的所有组件实例，但我们可以通过 `include` 和 `exclude` prop 来定制该行为。

```vue
<!-- include是选择组件匹配范围 -->
<KeepAlive include="a,b">
  <component :is="activeComponent" />
</KeepAlive>

<!-- include是选择组件不匹配范围 -->
<KeepAlive exclude="c,d">
  <component :is="activeComponent" />
</KeepAlive>

<!-- max限制可被缓存的最大组件实例数，最久没被访问的缓存实例将被销毁，为新实例腾出空间 -->
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

​	**缓存实例的生命周期：**

​	当一个组件在 `<KeepAlive>` 中被切换时，它的 `activated` 和 `deactivated` 生命周期钩子将被调用，用来替代 `mounted` 和 `unmounted`。

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
</script>
```

## `<Teleport>`:

​	简单来说，`<Teleport>`就是一个传送门，可以将包裹住的内容传送到指定的一个位置上。

​	`<Teleport>` 接收一个 `to` prop 来指定传送的目标。`to` 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。这段代码的作用就是告诉 Vue“把以下模板片段**传送到 `body`** 标签下”。

​	**示例：**

```vue
<Teleport to="body">
    <div>A</div>   
</Teleport>
```

**Tips⭐：**

>​	`<Teleport>` 挂载时，传送的 `to` 目标必须已经存在于 DOM 中。理想情况下，这应该是整个 Vue 应用 DOM 树外部的一个元素。如果目标元素也是由 Vue 渲染的，你需要确保在挂载 `<Teleport>` 之前先挂载该元素。

​	我们可以通过对 `<Teleport>` 动态地传入一个 `disabled` prop 来决定是否禁用`<Teleport>`。

​	**示例：**

```vue
<Teleport :disabled="isMobile">
  <div>A</div>
</Teleport>
```

​	多个 `<Teleport>` 组件可以将其内容挂载在同一个目标元素上，而顺序就是简单的顺次追加，后挂载的将排在目标元素下更后面的位置上。

​	**示例：**

```vue
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

​	渲染的结果为：

```vue
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## `<Suspense>`:

​	我们就可以在等待整个多层级组件树中的各个异步依赖获取结果时，在顶层展示出加载中或加载失败的状态。

​	`<Suspense>` 组件有两个插槽：`#default` 和 `#fallback`。两个插槽都只允许**一个**直接子节点。在可能的时候都将显示默认槽中的节点（具有异步依赖时除外）。否则将显示后备槽中的节点。

```vue
<Suspense>
  <!-- #default 主要内容，如有异步加载则先挂起 -->
  <template #default>
  	<Dashboard />
  </template>
    
  <!-- #fallback 加载中的状态，等待#defualt中的异步加载完成 -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

​	`<Suspense>`渲染流程：

![<Suspense>渲染流程](Vue基础学习.assets/image-20221105112324762.png)

​	进入完成状态后，只有当默认插槽的根节点被替换时`<Suspense>`才会回到挂起状态。而发生回退时，`<Suspense>`会优先展示之前`#default`插槽的内容，如果等待渲染新内容耗时超过timeout之后，`<Suspense>`才会切换为展示后备内容。

# 🔆 路由

## 服务端路由：

​	服务端路由是指服务器根据用户访问的url路径返回不同的响应结果。

​	而我们传统的服务端渲染的web应用的工作方式就是：用户在浏览器访问链接 --> 服务端返回全新的HTML给浏览器 -->浏览器重新加载整个页面。

## 客户端路由：

​	在单页面应用中，客户端可以通过js代码拦截页面的跳转请求，然后根据请求来动态获取新的数据，这样就可以在无需重新加载的情况下更新当前页面。

>区别：一个是通过服务器返回的页面，一个是通过拦截请求在客户端进行页面更新。

# 🔆 Vuex

# 🔆 Pinia

# 🔆服务端渲染

## SSR(Server-Side Rendering)：

​	服务端渲染是指：Vue也可以支持将组件在服务端渲染成HTML字符串，作为服务器响应返回给浏览器，最后浏览器将静态的HTML激活为能够交互的客户端应用。

​	**优势：**

- **更快的首屏加载：**服务端渲染的HTML无需等所有的javaScript加载并执行完才显示。
- **更早的数据连接：**数据获取过程的首次访问时在服务端完成的，比从客户端获取更早一步。
- **统一的心智模型：**你可以使用相同的语言以及相同的声明式、面向组件的心智模型来开发整个应用，而不需要在后端模板系统和前端框架之间来回切换。
- **更好的SEO：**搜索引擎爬虫可以直接看到完全渲染的页面。

## SSG(Static-Site Generation)：

​	静态站点生成，也被称为预渲染，是一种构建快速网站的技术。

​	如果服务端渲染的页面所需数据对每个用户都是相同的，那么我们可以只渲染一次，提前在构建过程中完成页面生成。预渲染的页面会作为静态HTML被服务器托管。

​	关键词：**静态**。

​	SSG仅用在数据在构建期间时是已知的，且多次部署期间都不会改变的。而SSR只负责从服务端返回静态HTML而已，在构建期间还未生成页面。

详情参考：[SSR(服务端渲染)与SSG(静态页面生成) - 掘金 (juejin.cn)](https://juejin.cn/post/6955828263910375437)

