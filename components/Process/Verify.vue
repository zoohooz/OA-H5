<template>
	<view>
		<!-- 提交申请开始 -->
		<view class="example">
			<uni-forms :modelValue="formData" ref="formData" :rules="rules" label-width='120px' label-align='right'>
				<!-- 审批意见 -->
				<uni-forms-item label="审批意见" name="message" v-if="businessStatus.status==='waiting'">
					<uni-easyinput type="textarea" v-model="formData.message" placeholder="请输入审批意见" />
				</uni-forms-item>
				<!-- 下一步审批人 -->
				<uni-forms-item v-if="nextNodes && nextNodes.length > 0" label="下一步审批人" name="assigneeMap">
					<view v-for="(item, index) in nextNodes" :key="index">
						<span>【{{ item.nodeName }}】：</span>
						<uni-easyinput v-show="false" v-model="formData.assigneeMap[item.nodeId]" />
						<!-- 请选择审批人 -->
						<view style="display: flex;">
							<uni-easyinput placeholder="请选择审批人" readonly v-model="nickName[item.nodeId]">
							</uni-easyinput>
							<button @click="choosePeople(item.chooseWay, item.assigneeId, item.nodeId) " size="minni"
								class="user_button">选择</button>
						</view>
					</view>
				</uni-forms-item>
				<!-- 是否抄送 -->
				<uni-forms-item label="是否抄送" name="isCopy" v-if="setting.isCopy">
					<uni-data-checkbox v-model="formData.isCopy" :localdata="isCopyList" />
					<uni-easyinput v-show="false" v-model="formData.assigneeIds" />
					<view v-if="formData.isCopy" style="display: flex;">
						<uni-easyinput v-model="formData.assigneeNames" placeholder="请选择人员" readonly />
						<button @click="chooseCopyUser" size="minni" class="user_button">选择</button>
					</view>
				</uni-forms-item>

				<uni-row class="demo-uni-row formButtom" :gutter="10">
					<uni-col :span="2.5">
						<button @click="submitForm('formData')" type="primary" size="mini"
							:loading="bthLoading">提交</button>
					</uni-col>
					<uni-col :span="2.5" v-if="backNodeList && backNodeList.length>0">
						<button @click="openBack()" type="primary" size="mini">退回</button>
					</uni-col>
					<uni-col :span="2.5" v-if="isMultiInstance && setting.addMultiInstance">
						<button @click="addMultiClick()" type="primary" size="mini">加签</button>
					</uni-col>
					<uni-col :span="2.5" v-if="multiList && multiList.length>0 && setting.deleteMultiInstance">
						<button @click="deleteMultiClick()" type="primary" size="mini">减签</button>
					</uni-col>
					<uni-col :span="2.5" v-if="setting.isDelegate">
						<button @click="delegateClick()" size="mini" type="primary">委托</button>
					</uni-col>
					<uni-col :span="2.5" v-if="setting.isTransmit">
						<button @click="transmitClick()" type="primary" size="mini">转办</button>
					</uni-col>
					<uni-col :span="2.5">
						<button @click="closeDialog" size="mini">取消</button>
					</uni-col>

					<!-- <el-button type="primary" @click="submitForm('formData')" size="small">提交</el-button>
					<el-button type="primary" v-if="backNodeList && backNodeList.length>0" @click="openBack()" size="small">退回</el-button>
					<el-button type="primary" v-if="isMultiInstance && setting.addMultiInstance" @click="addMultiClick()" size="small">加签</el-button>
					<el-button type="primary" v-if="multiList && multiList.length>0 && setting.deleteMultiInstance" @click="deleteMultiClick()" size="small">减签</el-button>
					<el-button type="primary" v-if="setting.isDelegate" @click="delegateClick()" size="small">委托</el-button>
					<el-button type="primary" v-if="setting.isTransmit" @click="transmitClick()" size="small">转办</el-button>
					<el-button size="small" @click="closeDialog()">取消</el-button> -->
				</uni-row>

			</uni-forms>

		</view>
		<!-- end -->
	</view>
</template>

<script>
	import {
		successSalary
	} from "@/api/demo/salary";
	import api from "@/api/workflow/task";
	import {
		checkObject
	} from "@/utils/burse"
	export default {
		components: {},
		data() {
			return {
				// 接收的参数
				taskId: '',
				taskVariables: {},
				sendMessage: {},
				navigateBack: 1,
				type: '',
				// 全局控制
				loading: false,
				//提交表单数据
				formData: {
					message: null,
					assigneeMap: {},
					//是否抄送
					isCopy: false,
					//抄送人id
					assigneeIds: undefined,
					//抄送人名称
					assigneeNames: undefined,
					//消息提醒
					sendMessage: {},
				},
				isCopyList: [{
					text: '是',
					value: true
				}, {
					text: '否',
					value: false
				}],
				//流程状态
				businessStatus: {},
				//下一节点
				nextNodes: [],

				//可驳回的集合
				backNodeList: [],
				//是否为会签
				isMultiInstance: false,
				//可以减签的集合
				multiList: [],
				//按钮设置
				setting: {},
				nickName: {},
				//查询审批人条件
				dataObj: {},
				//节点id
				nodeId: undefined,

				//委托
				delegateForm: {
					delegateUserId: null,
					delegateUserName: null,
					taskId: null,
					sendMessage: {}
				},

				rules: {
					assigneeMap: {
						rules: [{
							// required: true,
							errorMessage: "请输入下一步审批人",
							validateFunction: (rule, value, data, callback) => checkObject(rule, this.formData
								.assigneeMap, data, callback)
						}, ]
					},
				},
				// 按钮状态
				bthLoading: false,
				userId:null,
				adjustedSalary:null
			}
		},
		methods: {
			// 提交表单数据
			async submitForm(formName) {
				this.$refs.formData.validate(async (valid) => {
					console.log('valid--->', valid, Boolean(!valid))
					if (!valid) {
						this.loading = true;
						this.bthLoading = true;
						try {
							this.formData.variables = this.taskVariables
							this.formData.taskId = this.taskId
							//消息提醒
							this.formData.sendMessage = {
								title: this.sendMessage.title,
								type: this.sendMessageType,
								messageContent: this.$store.state.user.name + "提交了" + this.sendMessage
									.messageContent
							}
							if (this.businessStatus.status === 'draft') {
								this.formData.message = '提交单据'
							}
							console.log('流程提交-this.formData-->', this.formData);
							let response = await api.completeTask(this.formData);
							console.log('办理成功---', response)
							if (response.code === 200) {
								
								// 刷新数据
								this.$modal.msgSuccess("办理成功")
								// console.log('that.nextNodes.length',that.nextNodes.length)
								
								let that = this
								setTimeout(function() {
									that.bthLoading = false
									uni.navigateBack({
										delta: that.navigateBack
									})
									try {
										const pages = getCurrentPages();
										const prevPage = pages[pages.length - (1 + that
											.navigateBack)];
										prevPage.$vm.onClickItem({
											currentIndex: 1
										})
									} catch (e) {
										return
									}
								}, 1000);	
								console.log('that.type',that.type)
								if (that.type === 'salary') {
									if (that.nextNodes.length === 0) {
										await successSalary({
											userId: that.userId,
											salary: that.adjustedSalary
										}).then((resp) => {
											console.log('editUs=>', resp);
										});
									}
								}
								return
								// 将表单清空
								// this.$refs[formName].resetFields();
								// 关闭窗口
								// this.visible = false;
								// 回调事件
								// this.$emit("callSubmit")
							}
							this.bthLoading = false
							this.loading = false;
			 		} catch (e) {
							this.bthLoading = false
							this.loading = false;
						}
					}
			 });
			},
			//重置表单
			reset() {
				this.isCopy = false
				this.delegate = '2'
				this.transmitForm = {}
				this.formData.message = null
				this.formData.assigneeMap = {}
				this.nickName = {}
			},
			// 关闭
			closeDialog() {
				console.log('在提交页面取消了')
				this.$tab.navigateBack()
				try {
					const pages = getCurrentPages();
					const prevPage = pages[pages.length - 2];
					prevPage.$vm.verifyCancel()
				} catch (e) {
					return
				}
			},
			// 选择人员
			choosePeople(chooseWay, assigneeId, nodeId) {
				console.log('选择人员--chooseWay->', chooseWay)
				console.log('选择人员--assigneeId->', assigneeId)
				console.log('选择人员--nodeId->', nodeId)
				this.propUserList = [];
				if (chooseWay) {
					if (this.formData.assigneeMap[nodeId]) {
						this.dataObj = {
							chooseWay: chooseWay,
							assigneeId: assigneeId,
							ids: this.formData.assigneeMap[nodeId].split(",")
						};
					} else {
						this.dataObj = {
							chooseWay: chooseWay,
							assigneeId: assigneeId,
							ids: []
						};
					}
					this.nodeId = nodeId;
					// :dataObj="dataObj" :nodeId="nodeId" @confirmUser="clickUser" 
					console.log('选择人员-dataObj》', this.dataObj)
					console.log('选择人员-nodeId》', this.nodeId)
					console.log('选择人员-clickUser》', this.clickUser)
					let item = {
						dataObj: this.dataObj,
						nodeId: this.nodeId,
					}
					let data = encodeURIComponent(JSON.stringify(item))
					this.$tab.navigateTo(
						`/pages/components/user/choose-workflow-user?data=${data}`
					)
					// this.$refs.wfUserRef.visible = true;
				}
			},
			//确定选择人员
			confirmUser(userList, nodeId) {
				console.log('选择人员回调-->', userList, nodeId)
				let assignee = userList.map((item) => {
					return item.userId;
				});
				let nickName = userList.map((item) => {
					return item.nickName;
				});
				let arrAssignee = assignee.join(",");
				let arrNickName = nickName.join(",");
				console.log('选择人员回调-arrAssignee->', arrAssignee)
				console.log('选择人员回调-arrNickName->', arrNickName)
				this.formData.assigneeMap[nodeId] = arrAssignee;
				this.nickName[nodeId] = arrNickName
				console.log('this.nickName[nodeId]', this.nickName)
				this.$forceUpdate();
			},

			//选择抄送人
			chooseCopyUser() {
				this.copyUserList = []
				this.copyUserList.push(this.formData.delegateUserId)
				// :propUserList="copyUserList"
				// this.$refs.userCopyRef.visible = true
				let item = {
					userList: this.copyUserList
				}
				console.log('抄送==>', item)
				let data = encodeURIComponent(JSON.stringify(item))
				this.$tab.navigateTo(
					`/pages/components/user/sys-dept-user?data=${data}`
				)
			},
			//确认抄送人员
			confirmSysDeptUser(data) {
				console.log('抄送回调-->', data)
				let assignee = data.map((item) => {
					return item.userId;
				});
				let nickName = data.map((item) => {
			 	return item.nickName;
				});
			 this.formData.assigneeIds = assignee.join(",")
				this.formData.assigneeNames = nickName.join(",")
				// this.$refs.userCopyRef.visible = false
			},

			//打开委托申请
			delegateClick() {
				this.delegateForm = {}
				let item = {
					taskId: this.taskId,
					sendMessage: this.sendMessage,
				}
				console.log('委托==>', item)
				let data = encodeURIComponent(JSON.stringify(item))

				this.$tab.navigateTo(
					`/pages/components/user/delegate?data=${data}`
				)
				// this.delegateVisible = true
			},

			//打开转发窗口
			transmitClick() {
				this.transmitForm = {}
				let item = {
					taskId: this.taskId,
					sendMessage: this.sendMessage,
				}
				console.log('转办==>', item)
				let data = encodeURIComponent(JSON.stringify(item))

				this.$tab.navigateTo(
					`/pages/components/user/transmit?data=${data}`
				)
				// this.transmitVisible = true
			},
			//打开驳回弹窗
			openBack() {
				let item = {
					taskId: this.taskId,
					backNodeList: this.backNodeList,
					sendMessage: this.sendMessage,
				}
				console.log('驳回==>', item)
				let data = encodeURIComponent(JSON.stringify(item))

				this.$tab.navigateTo(
					`/components/Process/Back?data=${data}`
				)
				// this.$refs.backRef.visible = true
			},
			//驳回回调
			callBack(e) {
				// 关闭窗口
				console.log('驳回回调<---', e)
				// this.$tab.navigateBack()
				// let pages = getCurrentPages();
				// console.log('pages---->',pages)
				// let prevPage = pages[pages.length - 3];
				// prevPage.$vm.centerRef(e)
			},
		},
		mounted() {},
		created() {

		},
		watch: {
			async taskVariables(newVal) {
				if (newVal) {
					try {
						console.log('watch--执行了')
						this.loading = true;
						// 获取下一节点信息
						let params = {
							taskId: this.taskId,
							variables: this.taskVariables
						}
						console.log('----------', params)
						const {
							data
						} = await api.getNextNodeInfo(params);
						console.log('下一节点信息--->', data.list)
						console.log('this.nextNodes',data.list.length)
						this.nextNodes = data.list;
						this.isMultiInstance = data.isMultiInstance;
						this.multiList = data.multiList;
						this.backNodeList = data.backNodeList;
						this.setting = data.setting
						this.businessStatus = data.businessStatus,
						this.loading = false;
					} catch (error) {
						console.log('watch--error')
						this.loading = false;
					}
				}
			},
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			console.log('页面跳转完成---》', option)
			// console.log('页面转', JSON.parse(decodeURIComponent(option.data)) )
			let {
				data
			} = option
			this.taskId = data.taskId
			this.taskVariables = data.taskVariables
			this.sendMessage = data.sendMessage
			this.navigateBack = data.navigateBack
			this.type = data.type
			this.userId= data.userId
			this.adjustedSalary = data.salary
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
