<template>
	<view class="example">
		<uni-forms :modelValue="transmitForm" ref="transmitData" label-width='80px' label-align='right'>
			<!-- 审批意见 -->
			<uni-forms-item label="审批意见" name="message" >
				<uni-easyinput type="textarea" v-model="transmitForm.message" placeholder="请输入审批意见" />
			</uni-forms-item>
			
			<uni-forms-item label="转办人" name="userName">
				<view style="display: flex;">
					<uni-easyinput placeholder="请选择转办人" v-model="transmitForm.userName" readonly>
					</uni-easyinput>
					<button @click="transmitPeople" size="minni" class="user_button">选择</button>
				</view>
			</uni-forms-item>
			<!-- 按钮 -->
			<uni-row class="demo-uni-row">
				<uni-col :span="11">
					<button @click="delegateVisible" >取消</button>
				</uni-col>

				<uni-col :span="11" :push="2">
					<button @click="transmitSubmit" type="primary" >提交</button>
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
				
				//转办
				transmitForm: {
				  message: null,
				  userId: null,
				  userName: null,
				  taskId: null,
				  sendMessage: {}
				},
			}
		},
		methods: {
			delegateVisible(){
				this.$tab.navigateBack()
			},
			//打开转办人员组件
			transmitPeople() {
				this.transmitUserList = []
				this.transmitUserList.push(this.transmitForm.userId)
				let item = {
					userList: this.transmitUserList
				}
				console.log('转办==>',item)
				let data = encodeURIComponent(JSON.stringify(item))
				this.$tab.navigateTo(
					`/pages/components/user/sys-dept-user?data=${data}`
				)
				// this.$refs.delegateUserRef.visible = true
			},
			//确认转办人员
			confirmSysDeptUser(data) {
				console.log('确认转办回调-->',data)
				this.transmitForm.userId = data[0].userId
				this.transmitForm.userName = data[0].nickName
				// this.$forceUpdate()
				// this.$refs.delegateUserRef.visible = false
			},
				//提交转发
				    transmitSubmit(formName){
				      this.transmitForm = {
				        transmitUserId: this.transmitForm.userId,
				        taskId: this.taskId,
				        comment: this.transmitForm.message
				      }
				      //消息提醒
				      this.transmitForm.sendMessage = {
				        title: this.sendMessage.title,
				        type: this.sendMessageType,
				        messageContent: this.$store.state.user.name+"转发了"+this.sendMessage.messageContent
				      }
							console.log('转办提交--》',this.transmitForm)
				      api.transmitTask(this.transmitForm).then(response=>{
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
				        }
				        this.loading = false;
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
			let {data} = option
			console.log('转办内部--》',data)
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
