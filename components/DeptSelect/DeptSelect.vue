<template>
	<view class="dept_select">
		<uni-easyinput v-model="deptLabel" disabled />
		<button @click="handleDept" size="mini" >选择部门</button>
		
		<TkiTree ref="TkiTree_Ref" :range="deptOptions" selectParent @confirm="confirm" @cancel="cancel" confirmColor="#4e8af7"></TkiTree>
	</view>
</template>

<script>
	import {
		treeselect
	} from "@/api/system/dept";
	
	import TkiTree from "@/components/tki-tree/tki-tree.vue"
	export default {
		props:{
			label:{
				type: String,
				default: '',
			}
		},
		components: {
			TkiTree
		},
		watch:{
			label(v){
				this.deptLabel = v
			}
		},
		data() {
			return {
				deptOptions: [],
				deptLabel: this.label,
			}
		},
		methods: {
			getTreeselect() {
				treeselect().then(response => {
					this.deptOptions = response.data;
				});
			},
			
			// 打开部门选择
			handleDept(){
				this.$refs.TkiTree_Ref._show()
			},
			// 选择部门
			confirm(e){
				this.deptLabel = e[0].label
				this.$emit("confirm", e);
			},
			//取消选择
			cancel(){
				this.$emit("cancel");
			}
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
