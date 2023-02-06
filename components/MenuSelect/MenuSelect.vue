<template>
	<view class="dept_select">
		<uni-easyinput v-model="deptLabel" disabled />
		<button @click="handleDept" size="mini" >选择菜单</button>
		
		<BaTreePicker 
			ref="BaTreePicker_Ref" 
			:multiple='true' 
			:selectParent="true"
			@select-change="selectChange" 
			:localdata="menuOptions"
			 
			title="选择菜单"
			valueKey="id" 
			textKey="label" 
			childrenKey="children"
			>
		</BaTreePicker>
	</view>
</template>

<script>
	import {
		treeselect
	} from "@/api/system/menu";
	
	
	// import TkiTree from "@/components/tki-tree/tki-tree.vue"
	 import BaTreePicker from "@/components/ba-tree-picker/ba-tree-picker.vue"
	export default {
		props:{
			label:{
				type: String,
				default: '',
			}
		},
		components: {
			BaTreePicker
		},
		watch:{
			label(v){
				this.deptLabel = v
			}
		},
		data() {
			return {
				menuOptions: [],
				deptLabel: this.label,
			}
		},
		methods: {
			getTreeselect() {
				treeselect().then(response => {
					this.menuOptions = response.data;
				});
			},
			
			// 打开部门选择
			handleDept(){
				this.$refs.BaTreePicker_Ref._show()
			},
			//监听选择（ids为数组）
			selectChange(ids, names) {
			    this.$emit("confirm", {ids, names});
			},
			// // 选择部门
			// confirm(e){
			// 	this.deptLabel = e[0].label
			// 	this.$emit("confirm", e);
			// },
			// //取消选择
			// cancel(){
			// 	this.$emit("cancel");
			// }
		},
		mounted() {},
		created() {
			this.getTreeselect()
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad() {
			//页面初次渲染完成
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			//页面显示再次执行
		},
		onHide() {
			//页面隐藏再次执行
		},
		onError() {
			//出现错误
		},
		onPullDownRefresh() {
			//触发了下拉刷新
		}
	}
</script>

<style scoped lang="scss">
.dept_select{
	display: flex;
}
</style>
