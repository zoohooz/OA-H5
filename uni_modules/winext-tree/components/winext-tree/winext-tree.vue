<template>
	<view class="winext-tree">
		<winext-tree-item v-for="(item,index) in data" :defaultOpen="defaultOpen" :key="arrayKey?item[arrayKey]:index" :data="item" :dataKey="dataKey" :arrayKey="arrayKey"
			:childrenKey="childrenKey" @itemClick="itemClick">
			<template v-slot="{item,path}">
				<slot :item="item" :path="[item,...path]"></slot>
			</template>
		</winext-tree-item>
	</view>
</template>
<script>
	import WinextTreeItem from '../winext-tree-item/winext-tree-item.vue'

	/**
	 * Tree 树型结构展示
	 * @description 用于显示树型结构
	 * @tutorial https://xxx.xxx.net.cn
	 * @property {Array} data 展示数据
	 * @property {String} dataKey = 数据显示文字key
	 * @property {String} arrayKey = v-for循环key
	 * @property {String} childrenKey = 子节点key
	 * @property {Boolean} defaultOpen = 初始化节点是否打卡，默认：false
	 * @event {Function} itemClick 点击子节点时触发
	 */

	export default {
		name: "WinextTree",
		data() {
			return {
				open: false
			}
		},
		components: {
			WinextTreeItem
		},
		props: {
			data: {
				default: function() {
					return []
				}
			},
			dataKey: {
				default: "label"
			},
			arrayKey: {

			},
			childrenKey: {
				default: "children"
			},
			defaultOpen: {
				default: false
			}
		},
		created() {
			this.open = this.defaultOpen
		},
		methods: {
			itemClick(item) {
				this.$emit('itemClick', item)
			}
		}

	}
</script>
<style>
	.winext-tree {
		width: calc(100% - 40rpx);
		padding: 0 20rpx;
	}
</style>
