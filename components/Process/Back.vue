<template>
	<view class="example">
		<uni-forms :modelValue="formData" :rules="rules" ref="formData" label-width='80px' label-align='right'>
			<!-- 审批意见 -->
			<uni-forms-item label="审批意见" name="message">
				<uni-easyinput type="textarea" v-model="formData.message" placeholder="请输入审批意见" />
			</uni-forms-item>

			<uni-forms-item label="驳回到" required name="targetActivityId">
				<uni-data-select v-model="formData.targetActivityId" :localdata="options">
				</uni-data-select>
			</uni-forms-item>
			<!-- 按钮 -->
			<uni-row class="demo-uni-row">
				<uni-col :span="11">
					<button @click="cancel">取消</button>
				</uni-col>

				<uni-col :span="11" :push="2">
					<button @click="submitForm" type="primary">提交</button>
				</uni-col>
			</uni-row>

		</uni-forms>
	</view>
</template>

<script>
	import api from '@/api/workflow/task'
	export default {
		components: {},
		data() {
			return {
				loading: false,
				formData: {
					taskId: null,
					targetActivityId: null,
					comment: null,
					sendMessage: {},
				},
				sendMessage:{},
				// 校验规则
				rules: {
					targetActivityId: {
						rules: [{
							required: true,
							errorMessage: '请选择驳回目标'
						}]
					},
				},
				options: [],
			}
		},
		methods: {
			cancel() {
				this.$tab.navigateBack()
			},
			// 提交表单数据
			submitForm() {
				this.$refs.formData.validate(async (valid) => {
					if (!valid) {
						// 校验通过，提交表单数据
						this.loading = true
						try {
							this.formData = {
								taskId: this.taskId,
								targetActivityId: this.formData.targetActivityId,
								comment: this.formData.comment,
							}
							//消息提醒
							this.formData.sendMessage = {
								title: this.sendMessage.title,
								type: this.sendMessageType,
								messageContent: this.$store.state.user.name + "驳回了" + this.sendMessage.messageContent
							}
						console.log('用户驳回提交->',this.formData)
			 			let response = await api.backProcess(this.formData)
							if (response.code === 200) {
								this.$modal.msgSuccess('提交成功').then(() =>{
									this.$tab.navigateBack(2)
									let pages = getCurrentPages();
									console.log('back-->',pages)
									let prevPage = pages[pages.length - 3];
									prevPage.$vm.centerRef('back')
								})
			  		}
							this.loading = false
						} catch (e) {
							this.loading = false
						}
					}
				})
			},
		},
		mounted() {},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			console.log('驳回页-->', option)
			let {
				data
			} = option
			this.taskId = data.taskId,
				this.backNodeList = data.backNodeList,
				this.sendMessage = data.sendMessage
			// watch
			this.formData.targetActivityId = this.backNodeList[0].nodeId
			this.options = this.backNodeList.map(item => {
				return {
					text: item.nodeName,
					value: item.nodeId
				}
			})
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
