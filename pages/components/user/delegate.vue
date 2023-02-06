<template>
	<view class="example">
		<uni-forms :modelValue="delegateForm" ref="delegateData" label-width='80px' label-align='right'>
			<!-- 审批意见 -->
			<uni-forms-item label="委托人" name="userName">

				<view style="display: flex;">
					<uni-easyinput placeholder="请选择委托人" v-model="delegateForm.delegateUserName" readonly>
					</uni-easyinput>
					<button @click="delegatePeople" size="minni" class="user_button">选择</button>
				</view>

			</uni-forms-item>
			<!-- 按钮 -->
			<uni-row class="demo-uni-row">
				<uni-col :span="11">
					<button @click="delegateVisible" >取消</button>
				</uni-col>

				<uni-col :span="11" :push="2">
					<button @click="delegateSubmit" type="primary" >提交</button>
				</uni-col>
			</uni-row>

		</uni-forms>
	</view>
</template>

<script>
import api from "@/api/workflow/task";
	export default {
		components: {},
		data() {
			return {
				// 接收的数据
				taskId:'',
				sendMessage:'',
				
				//委托
				delegateForm: {
					delegateUserId: null,
					delegateUserName: null,
					taskId: null,
					sendMessage: {}
				},
			}
		},
		methods: {
			delegateVisible(){
				this.$tab.navigateBack()
			},
			//打开委托人员组件
			delegatePeople() {
				this.delegateUserList = []
				this.delegateUserList.push(this.delegateForm.delegateUserId)
				let item = {
					userList: this.delegateUserList
				}
				console.log('委托==>',item)
				let data = encodeURIComponent(JSON.stringify(item))
				this.$tab.navigateTo(
					`/pages/components/user/sys-dept-user?data=${data}`
				)
				// this.$refs.delegateUserRef.visible = true
			},
			//确认委托人员
			confirmSysDeptUser(data) {
				console.log('确认委托回调-->',data)
				this.delegateForm.delegateUserId = data[0].userId
				this.delegateForm.delegateUserName = data[0].nickName
				// this.$forceUpdate()
				// this.$refs.delegateUserRef.visible = false
			},
			//提交委托申请
			async delegateSubmit(){
			  this.delegateForm.taskId = this.taskId
			  //消息提醒
			  this.delegateForm.sendMessage = {
			      title: this.sendMessage.title,
			      type: this.sendMessageType,
			      messageContent: this.$store.state.user.name+"委托了"+this.sendMessage.messageContent
			  }
			  let response = await api.delegateTask(this.delegateForm);
			  if(response.code === 200){
			    // 刷新数据
			    this.$modal.msgSuccess("办理成功")
			    // 将表单清空
			    this.delegateForm = {};
			    // 关闭窗口
					setTimeout(function () {
						this.bthLoading = false
						uni.navigateBack({
								delta:3
							})
						}, 1000);
						return
			    // this.visible = false;
			    // 回调事件
			    // this.$emit("callSubmit")
			  }
			  this.loading = false;
			},
		},
		mounted() {},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			let {data} = option
			console.log('委托内部--》',data)
			this.taskId = data.taskId
			this.sendMessage = data.sendMessage
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

<style scoped>
	.user_button {
		height: 35px;
		line-height: 35px;
	}
</style>
