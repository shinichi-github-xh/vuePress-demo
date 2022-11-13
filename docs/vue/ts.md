一、	Ts数据的基本类型
String：字符串。

let name1: string = "张三";

Number：数字。

let age: number = 18;

Array：数组。
// 普通定义
let infoList2: number[] = [18, 19, 20];
let infoList3: string[] = ["张三", "李四", "王五"];
// 泛型定义
let infoList4: Array<String> = ["张三", "李四"];
// 联合类型
let infoList4: [number, string] = [18, "zhangsan"];

Enum：枚举。
	注：枚举类型常在其元素的值和个数确定的情况下使用，其定义每个值叫做元素，每个元素都有编号，从0开始排，一次递增+1。
// 定义方式
enum Color {
  black,
  red,
  blue = 3,
}
// 获取元素对应的编号
let colorIndex: Color = Color.black;
// 获取对应编号上的元素
let color: Color = (Color as any)[1];

Object：对象。

let obj: object = {
  name: "张三",
  age: 18,
};

Boolean：布尔。
let isShow: boolean = true;

Undefine/Null：undefine或null。

let money: null = null;
let konwledge: undefined = undefined;

Interface：接口。
	注：接口是一种规范、类型，使用该接口的对象不仅要实现其内在属性，还需要严格按照对应属性的类型来实现，如不确定或者该属性可选，可用在接口中的属性后+?来表示。
interface Person {
  name: string;
  age?: number;
  gender: string;
}

let lihua: Person = {
  name: "李华",
  gender: "男",
};

Any：以上任意类型。
// 可以是任意类型
let a:any = 123;
a = "zhangsan";
a = Color.black;

二、	Ts函数的类型定义
注：函数与其他数据一样，都可以使用正常的数据类型，表示该函数的返回值必须是该类型的，如string/numbe…，但有一个类型叫void，表示这个函数没有返回值。
Void：没有返回值。
// 表示该函数没有返回值
function test(): void {
  console.log("我这里只执行操作，没有返回值。");
}
test();

// 表示该函数有返回值，且返回值类型必须在以下几种类型中
function test():boolean|number|string|object|array {
  return console.log("我除了可以执行操作，还必须有返回值。");
}
test();

Interface：接口，可定义函数签名。
//   为了使接口表示函数类型，我们需要给接口定义一个调用签名
  interface IFunc {
    //   定义一个调用签名，函数使用该接口时需要传递相应的参数和提供相应的返回值
    (name: string, age: number): boolean;
  }
  const student: IFunc = function (name: string, age: number): boolean {
   // search()用来判断传入参数是否存在该对象中 在name这个字符串中寻找“lisi“
    return name.search("lisi") > -1;
  };

三、类的类型、继承和多态
1、类的类型
Interface：接口类型。
注：一个类可以实现（implements）一个或多个接口，一个接口也可以继承（extends）多个接口。
 //  定义两个接口
interface IFly {
    //   该方法中没有任何实现
    fly();
  }
  interface ISwim {
    swim();
  }
	
//一个类实现一个接口
class Person implements IFly {
    //    实现接口中的fly方法
    fly() {
      console.log("我会飞！");
    }
  }
 let lihua = new Person();
 lihua.fly();

//一个类实现多个接口
  class Person1 implements IFly, ISwim {
    //    实现接口中的fly方法
    fly() {
      console.log("我会飞！");
    }
    swim() {
      console.log("我会游泳！");
    }
  }
  let zhangsan = new Person1();
  zhangsan.fly();
  zhangsan.swim();

//   一个类实现继承多个接口后的接口
interface ISkills extends IFly, ISwim {}
class Person2 implements ISkills {
    //    实现接口中的fly方法
    fly() {
      console.log("我会飞！");
    }
    swim() {
      console.log("我会游泳！");
    }
  }
  let lisi = new Person2();
  lisi.fly();
  lisi.swim();

2、类的继承
像猫和狗这两类，内容有区别，但他们都是动物类的子类，他们可以有动物类的内容，也可以有自己特殊的内容，这种就可以称之为继承关系，猫类和狗类继承了动物类。
// 定义一个基类（父类）
  class Person {
    name: string;
    age: number;
    gender: string;
    // 定义构造函数，方便实例对象初始化属性和方法
    constructor(name: string, age: number, gender: string) {
      // 初始化属性值
      this.name = name;
      this.age = age;
      this.gender = gender;
    }
    sayHi(str: string) {
      console.log("我是Person类里的sayHi,你好呀，我叫", str);
    }
  }

  // 定义一个派生类（子类）
  class Student extends Person {
    //   子类的构造函数中必须实现父类中的构造函数
    constructor(name: string, age: number, gender: string) {
      //   子类通过super关键字使用父类中的构造函数
      super(name, age, gender);
    }

    sonSayHi() {
      console.log("我是学生类中的sayHi");
      // 子类调用父类中的方法也是通过super关键字
      super.sayHi("小甜甜");
    }
  }

  let lisi = new Student("66", 16, "55");
  lisi.sayHi("LISI");
  lisi.sonSayHi();

3、类的多态（扩展）
指父类型的引用指向了子类型的对象，但由于对象不同，父类又相同，就产生了不同对象针对相同的方法产生不同的行为的情况。
 // 定义一个父类
  class Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    run() {
      console.log("我是", this.name, "我跑了0米");
    }
  }

  class Cat extends Animal {
    name: string;
    constructor(name: string) {
      super(name);
    }
    run() {
      console.log("我是", this.name, "我跑了5米");
    }
  }
  class Dog extends Animal {
    name: string;
    constructor(name: string) {
      super(name);
    }
    run() {
      console.log("我是", this.name, "我跑了10米");
    }
  }
  //
  const ani = new Animal("小动物");
  ani.run();
  const cat = new Cat("小猫咪");
  cat.run();
  const dog = new Dog("小狗狗");
  dog.run();

  console.log("====================================");
  // 此时是父类的类型创建子类的对象
  const cat1: Animal = new Cat("小猫咪");
  cat1.run();
  const dog1: Animal = new Dog("小狗狗");
  dog1.run();
  console.log("====================================");
  // 该函数需要的参数是Animal类型的
  function showRun(obj: Animal) {
    obj.run();
  }

  showRun(cat1);
  showRun(dog1);

4、类中成员的修饰符
修饰符：指描述类中成员（属性、构造函数、方法）的可访问性。 
Public：公共的。类中成员默认的修饰符，表示在该类内外部都可随意访问。
Private：私有的。表示在该类的外部甚至是子类都无法访问该成员数据。
Protected：受保护的。表示在类的外部无法访问，但该子类是可以访问该成员数据的。
Readonly：这是一个关键字，对类中成员进行修饰，表示该属性成员只能在类内部初始化值时或者在构造函数内才能被修改。
构造函数中的参数可以使用以上的修饰符和关键字进行修饰，一旦修饰，则表示该类中具有该成员属性，就可以不用在类内部其他地方定义属性了。
Static：静态的。表示类中的成员不能通过实例对象访问，只能通过类名.成员名进行访问。
5、存取器
对象中的存取器是指我们可以通过getters和settters对对象中的成员进行访问和设置。
Getters：获取。
使用方式：
	类中：get functionName(){ return 所需的返回值}
	类外：obj. functionName()
Settters：设置。
使用方式：
类中：set functionName(value){ 如将类中的年龄加上value}
	类外：obj. functionName(value)
6、抽象类：
	该类中可以定义抽象方法、属性（一般没有具体的实现）等，也可以包含一些实例方法，抽象类不能被实例化，只能通过继承，目的是为了让子类进行实例化及实现该类中内部的抽象方法。
Abstract














