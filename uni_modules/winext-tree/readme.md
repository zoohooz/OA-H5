# ## Tree 树型组件
> **组件名：winext-tree**


步骤条，用于显示树型结构数据

### 基本用法

在 ``template`` 中的使用

```html
<!-- 基本用法 -->
<winext-tree :data="[{label: '事件一',children:[{label:'事件一一'}]}, {label: '事件二'}]"></winext-tree>

```


## API

### Tree Props

|属性名					|类型		|	可选值				|默认值		|说明|
|:-:					|:-:		|	:-:					|:-:		|:-:|
|data					|Array		|	-					|[]			|数据源，格式为：[{label:'xxx',children:[{label:'xxx'}]},{label:'xxx'}]|
|dataKey	            |String		|	-					|label		|数据显示文字key|
|arrayKey				|String		|	-					|-			|v-for循环key|
|childrenKey			|String		|	-					|children	|子节点key|
|defaultOpen			|Boolean	|	-					|false		|节点初始化是否打开|


### Tree Events

|事件名称	|说明				|返回值			|
|:-:		|:-:				|:-:			|
|itemClick	|点击节点时触发		|节点对应数据源	|

### Tree Slot

|名称		|说明					|子组件参数					|
|:-:		|:-:					|:-:						|
|default	|节点文字右侧显示内容	|e={item:{},path:[]};item：节点对应数据源 path：节点对应路径	|
|body		|(待开发)文字slot		|							|


## 完整示例

```html
<!-- 基本用法 -->
<winext-tree :data="[{id:1,name: '事件一',children:[{id:11,name:'事件一一'}]}, {id:2,name: '事件二'}]"
	dataKey="name"
	arrayKey="id"
	childrenKey="children">
	<template v-slot="slotItem">{{slotItem.item.name}}</template>
</winext-tree>

```