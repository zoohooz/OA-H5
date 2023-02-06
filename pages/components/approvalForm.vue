<template>
	<view>
		<uni-section :title="items[current]" type="line">
			<view class="uni-padding-wrap uni-common-mt">
				<uni-segmented-control :current="current" :values="flag==true?items1:items" style-type="button" active-color="#007aff"
					@clickItem="onClickItem" />
			</view>
			<view class="content">
				<view  v-show="current === 0" v-if="flag!=true">
					<component :is="currProcessForm" :ref="currProcessForm" :views="views" :businessKey="businessKey" :parentTaskId="parentTaskId" @closeForm="closeForm" :taskId="taskId"></component>
				</view>
				<view v-show="flag!=true?current === 1:current === 0">
					<Opinions :processInstanceId="processInstanceId" />
				</view>
				<view v-show="flag!=true?current === 2:current === 1">
					<Process :processInstanceId="processInstanceId" />
				</view>
			</view>
		</uni-section>
	</view>
</template>

<script>
	import Process from '@/components/Process/Item/Process.vue'
	import Opinions from '@/components/Process/Item/Opinions.vue'
	const context = require.context("@/pages/components/form",true,/\.vue$/)
	const modulStores = {}
	context.keys().forEach(key =>{
		const fileName = key.split(".")[1].split("/")[1]
		const fileModul = context(key).default
		modulStores[fileName] = {
			...fileModul,
			namespaced: true
		}
	})
	// console.log('context',context.keys())
	// console.log('modulStores',modulStores)
	export default {
		components: {
			Process,
			Opinions,
			...modulStores
		},
		data() {
			return {
				// 组件数据
				processInstanceId:'',
				businessKey: '',
				taskId: '',
				parentTaskId: '',
				currProcessForm: '',
				// 样式数据
				items: ['业务单据', '审批意见', '流程进度'],
				items1: ['审批意见', '流程进度'],
				current: 0,
				colorIndex: 0,
				views:null,
				flag:null
			}
		},
		computed:{
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			// 各组件的中转处理事件
			centerRef(e){
				console.log('驳回触发组件',e)
				if(e == 'back'){
					this.$refs[this.currProcessForm].callSubmit(e)
				}else{
					this.closeForm()
				}
			},
			// 组件回调
			closeForm(){
				// this.$emit("refresh")
				this.$tab.navigateBack()
			},
		},
		mounted() {},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			console.log('流程审批进度跟踪', option)
			let {
				data
			} = option
			this.processInstanceId = data.processInstanceId
			this.businessKey = data.businessKey
			this.taskId = data.taskId
			this.parentTaskId = data.parentTaskId
			this.currProcessForm = data.currProcessForm
			this.views = data.views
			this.flag = data.flag
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

<style>

</style>
