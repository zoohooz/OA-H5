<template>
	<view class="winext-tree-item">
		<view class="winext-tree-item-header">
			<uni-icons style="font-size: 25rpx;" :type="open?'arrowdown':'arrowright'" @click="open=!open"></uni-icons>
			<view style="margin-left: 20rpx;flex: 1;" @click="itemClick">{{data[dataKey]}}</view>
			<slot :item="data" :path="[]"></slot>
		</view>
		<WinextTreeItem v-if="data[childrenKey]" :defaultOpen="defaultOpen" v-show="open" v-for="(item,index) in data[childrenKey]" :key="arrayKey?item[arrayKey]:index"
			:data="item" :dataKey="dataKey" :arrayKey="arrayKey" :childrenKey="childrenKey">
			<template v-slot="{item,path}">
				<slot :item="item" :path="[item,...path]"></slot>
			</template>
		</WinextTreeItem>
	</view>
</template>

<script>
	export default {
		name: "WinextTreeItem",
		data() {
			return {
				open: false
			}
		},
		props: {
			data: {
				default: function() {
					return {}
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
			itemClick() {
				this.$emit('itemClick', this.data)
			}
		}

	}
</script>

<style>
	.winext-tree-item {
		width: calc(100% - 20rpx);
		padding-left: 20rpx;
	}

	.winext-tree-item-header {
		width: 100%;
		display: flex;
		flex-direction: row;
		height: 60rpx;
		line-height: 60rpx;
	}
</style>
