<template>
	<view class="example">
		<uni-forms class="form" :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
		
			<uni-forms-item label="请假时长" required name="duration">
				<!-- <uni-easyinput v-model="form.duration" type="number" placeholder="请输入请假时长，单位：天"  :disabled="isView" /> -->
				<uni-data-select
					:disabled="isView"
					:clear="!isView"
				  v-model="form.duration"
				  :localdata="durationList"
				></uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="工作委托人" required name="principal" > 
				<view style="display: flex;">
				<uni-easyinput  v-model="form.principal" placeholder="请输入工作委托人" :disabled="isView" />
				<button
					@click="chooseCopyUser"
					size="mini" class="user_button"
					>选择</button>
				</view>
			</uni-forms-item>
			<uni-forms-item label="联系电话" required name="contactPhone">
				<uni-easyinput  v-model="form.contactPhone" placeholder="请输入联系电话" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="请假类型" required name="leaveType">
				<!-- <uni-easyinput  v-model="form.leaveType" placeholder="请选择请假类型" /> -->
				<view style="display: flex;align-items: center;">
				<uni-data-select
					:disabled="isView"
					:clear="!isView"
					v-model="form.leaveType"
					:localdata="bs_leave_type"
					@change="getLeaveDays"
				></uni-data-select>
				<view v-show="annualLeave !== undefined" style="min-width: 100px;text-align: right;">年假剩余{{annualLeave}}天</view>
				<view v-show="restTime !== undefined" style="min-width: 130px;text-align: right;">调休剩余{{restTime}}小时</view>
				</view>
			</uni-forms-item>
			<uni-forms-item label="标题" required name="title">
				<uni-easyinput  v-model="form.title" placeholder="请输入标题" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="请假原因" required name="leaveReason">
				<uni-easyinput type="textarea" v-model="form.leaveReason" placeholder="请输入内容" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="请假时间" required name="dataRange">
				<uni-datetime-picker v-model="form.dataRange" type="datetimerange" rangeSeparator="至" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="文件" name="avatarFile">
				<!-- <uni-easyinput  v-model="form.fileName" :disabled="isView" /> -->
				<FileUpload
					:readonly="isView"
					@select="select" 
					:value="fileLists"
					@handleView="handleView"
				></FileUpload>
				<span>（病假、产假、婚嫁需提供证明）</span>
			</uni-forms-item>
			
			<!-- <uni-row class="demo-uni-row form_sub_button" v-if="!isForm"> -->
				<!-- <uni-col :span="12">
					<button @click="cancle">取消</button>
				</uni-col> -->
				<!-- <uni-col :span="24"> -->
				
				<!-- </uni-col> -->
			<!-- </uni-row> -->
			<view v-show="!isForm">
				<view class="form_sub_button" v-if=" type!=='view' ">
					<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
				</view>
				
				<view class="form_sub_button" v-else>
					<FormButton 
						:params="form" 
						:status="form.actBusinessStatus" 
						@update="handleUpdate(form)"
						@cancel="cancelProcessApply(form)" 
						@delete="handleDelete(form)">
					</FormButton>
				</view>
			</view>
		</uni-forms>
		
		
		
	</view>
</template>

<script>
import FileUpload from "@/components/FileUpload/FileUpload.vue"
import {  getLeave, addLeave, updateLeave, uploadfiles, getUserDays, fallbackUserDays, delLeave } from "@/api/demo/leave";
import { getUserProfile } from "@/api/system/user";
import {checkPhone,fileUrl} from "@/utils/burse"
import processAip from "@/api/workflow/processInst";
	export default {
		props:{
			isForm: {
				type: Boolean,
				default: false
			},
			formId:{
				type: String,
				default: ''
			}
		},
		components: {
			FileUpload
		},
		data() {
			return {
				// 是否只读
				isView: false,
				// 操作类型
				type:'add',
				// 表单参数
				form: {
					principal:'',
				},
				// 请假天数列表
				durationList:[
					{text:'0.5天',value:'0.5'},
					{text:'1天',value:'1.0'},
					{text:'1.5天',value:'1.5'},
					{text:'2天',value:'2.0'},
					{text:'2.5天',value:'2.5'},
					{text:'3天',value:'3.0'},
					{text:'3.5天',value:'3.5'},
					{text:'4天',value:'4.0'},
					{text:'4.5天',value:'4.5'},
					{text:'5天',value:'5.0'},
				],
				// 表单校验
			  rules: {
			    duration: {
			      rules:[{ required: true, errorMessage: "请假时长，单位：天不能为空" }]
			    },
			    principal: {
			       rules:[{ required: true, errorMessage: "工作委托人不能为空"}]
			    },
			    contactPhone: {
			      rules: [{ required: true,errorMessage: "联系电话不能为空",validateFunction:(rule, value, data, callback) => checkPhone(rule, value, data, callback)}]
			    },
			    leaveType: {
			      rules: [{ required: true, errorMessage: "请假类型不能为空"}]
			    },
			    title: {
			      rules: [{ required: true, errorMessage: "标题不能为空"}]
			    },
			    leaveReason: {
			      rules: [{ required: true, errorMessage: "请假原因不能为空" }]
			    },
			    dataRange: {
			      rules: [{ required: true, errorMessage: "请假时间不能为空" }]
			    }
			  },
				// 单选数据源
				bs_leave_type:[],
				// 按钮加载状态
				buttonLoading: false,
				
				// 上传文件
				imageValue: [],
				
				// 工作流
				processInstanceId: '',// 流程实例
				taskVariables: {}, //流程变量
				taskId: undefined, //任务id
				sendMessage: {},// 消息提醒
				
				// 剩余年假、调休
				annualLeave: undefined,
				restTime: undefined,
				// 回退id
				backId:undefined,
				
				// 上传文件回显列表、样式
				fileLists: [
					// {
					// 	url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg',
					// 	extname: 'png',
					// 	name: 'shuijiao.png'
					// },
				],
			}
		},
		methods: {
			//选择人
			chooseCopyUser(){
				this.$tab.navigateTo(
					`/pages/components/user/sys-dept-user?data=''`
				)
			},
			//确认抄送人员
			confirmSysDeptUser(data){
			  let assignee = data.map((item) => {
			    return item.userId;
			  });
			  let nickName = data.map((item) => {
			    return item.nickName;
			  });
				console.log(assignee,nickName)
				// this.form.principal = nickName
				// this.$set(this.form,principal,nickName)
			  // this.formData.assigneeIds = assignee.join(",")
			  // this.formData.assigneeNames = nickName.join(",")
			},
			// 查看图片
			handleView(e){
				console.log('查看图片',e)
				window.open(e[0].url)
			},
			// 获取上传状态
		  select({e}){
		  	console.log('选择文件：',e)
				const temp = e.tempFilePaths
				uploadfiles({
					filePath:  temp[0],
					name: 'avatarfile'
				}).then(res =>{
		  	console.log('文件上传成功--->',res)
					this.form.avatarFile = res.url
					this.form.fileName = res.FileName
		  	console.log('url--->',fileUrl(res.url))
				}).catch(e =>{
					this.$model.msgError("文件上传失败!请检查文件大小及文件类型。")
				})
		  },
			// 获取假期数据
			getLeaveDays(e){
				this.annualLeave = undefined
				this.restTime = undefined
				if(e === '3' || e === '1'){
				  getUserDays(this.form.userId).then(res =>{
				    console.log('剩余年假=》',res)
				    if(e === '3'){
				      this.annualLeave = res.data.annualLeave
				    }else if(e === '1'){
				      this.restTime = res.data.restTime
				    }
				  })
				}
			},
			//获取数据
			getLeaveData(id){
				getLeave(id).then(response => {
					console.log('leave-->',response)
					this.form = response.data;
					this.form.dataRange = [response.data.startDate, response.data.endDate];
					
					this.$nextTick(() => {
						this.processInstanceId=response.data.processInstanceId
					})
					// 图片列表
					let {avatarFile,fileName} = response.data
					if(avatarFile){
						let urlArr = fileName.split('.')
						this.fileLists.push({
								url: fileUrl(avatarFile),
								extname: urlArr[urlArr.length-1],
								name: this.form.fileName,
						})
						// console.log('fileLists-->',this.fileLists)
					}
					
				});
			},
			/** 提交按钮 */
			submitForm: function() {
				console.log('123',this.form.dataRange)
				this.$refs.form.validate(async valid => {
					console.log('valid--->',valid,Boolean(!valid))
					if (!valid) {
						this.form.startDate = this.form.dataRange[0];
						this.form.endDate = this.form.dataRange[1];
						this.buttonLoading = true
						let response;
						if (this.form.id != null) {
						  response = await updateLeave(this.form).then(response => {
						    this.$modal.msgSuccess("修改成功");
						    return response
						  }).finally(() => {
						    this.buttonLoading = false;
						  });
						} else {
						  response = await addLeave(this.form).then(response => {
								this.$modal.msgSuccess("新增成功");
						    return response
						  }).finally(() => {
						    this.buttonLoading = false;
						  });
						}
						this.backId = response.data.id
						this.sendMessage = {
							title:'请假申请',
							messageContent:'单据【'+response.data.id+"】申请"
						}
						this.submitFormApply(response.data)
					}
				});
			},
			//提交流程
			submitFormApply(entity){
			  let variables = {
			    entity: entity
			  }
			  const data = {
			    processKey: 'leave', // key
			    businessKey: entity.id, // 业务id
			    variables: variables,
			    classFullName: 'com.ycyy.demo.domain.BsLeave'
			  }
			  // 启动流程
			  processAip.startProcessApply(data).then(response => {
			    this.taskId = response.data.taskId;
			    // 查询下一节点的变量
			    this.taskVariables = {
			      entity: entity,  // 变量
			      userId: '1',
			    }
					
				// <verify :taskId="taskId" :taskVariables="taskVariables" :sendMessage="sendMessage"></verify>
				console.log('taskId->',this.taskId)
				console.log('taskVariables->',this.taskVariables)
				console.log('sendMessage->',this.sendMessage)
				let item = {
					taskId:this.taskId,
					taskVariables:this.taskVariables,
					sendMessage:this.sendMessage,
					navigateBack: this.type == 'add' ? 1 : 2,
				}
				console.log(item,'-----item')
				let data =  encodeURIComponent(JSON.stringify(item))
				console.log(data,'-----data')
				
				this.$tab.navigateTo(
					`/components/Process/Verify?data=${data}`
				)
				return
			    this.$refs.verifyRef.visible = true
			    this.$refs.verifyRef.reset()
			  })
			},
			// 流程取消
			verifyCancel(){
				console.log('leaveDetail==流程取消了')
				fallbackUserDays(this.backId).then(() =>{
					this.getLeaveData(this.backId)
					this.backId = undefined
				})
			},
			
			//流程操作
			async handleUpdate(form){
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title:'修改请假业务'
				})
				await this.getLeaveData(form.id)
				this.isView = false
			},
			cancelProcessApply(form) {
				let row = form.actBusinessStatus
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(async () => {
					await fallbackUserDays(form.id)
					this.getLeaveData(form.id);
					this.$modal.msgSuccess("撤回成功");
				}).finally(() => {
					this.loading = false;
				});
			},
			// 删除
			handleDelete({id}) {
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delLeave(id);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					setTimeout(() =>{
						that.$tab.navigateBack(1)
					},1000)
				}).catch(() => {
					that.loading = false;
				});
			},
			
		},
		mounted() {},
		created() {
			console.log('created')
			// 获取部门id
			if(this.type == 'add'){
				console.log('getUserProfile')
				getUserProfile().then(res =>{
					this.form.deptId = res.data.user.deptId
					this.form.userId  = res.data.user.userId
					this.form.username = res.data.user.nickName
				})
			}
			// 获取字典 sys_user_sex sys_normal_disable
			this.$getDicts("bs_leave_type").then(res => {
			  this.bs_leave_type = res.data.map(ele =>{
					return {
						text: ele.dictLabel,
						value: ele.dictValue,
						disable: false,
					}
				});
			});
			// 是否来自工作流表单
			if( this.isForm ){
				this.isView = true
				this.getLeaveData(this.formId)
			}
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad: function(option) {
			console.log('option-->',option)
			let { type } = option
			this.type = type
			if( type === 'edit' ){
				uni.setNavigationBarTitle({
					title:'修改请假业务'
				})
				this.getLeaveData(option.id)
			}else if( type === 'add' ){
				uni.setNavigationBarTitle({
					title:'新增请假业务'
				})
			}else if( type === 'view' ){
				uni.setNavigationBarTitle({
					title:'查看请假业务'
				})
				this.isView = true
				this.getLeaveData(option.id)
			}
			
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
	.user_button{
		height: 35px;
		line-height: 35px;
	}
</style>
