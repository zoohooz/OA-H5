<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="标题" required name="title">
				<uni-easyinput v-model="form.title" placeholder="请输入标题" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="紧急程度" name="status">
				<view style="display: flex;align-items: center;">
					<uni-data-select :clear="!isView" v-model="form.status" :localdata="bs_urgency" :disabled="isView">
					</uni-data-select>
				</view>
			</uni-forms-item>
			<uni-forms-item label="申请人" name="username">
				<uni-easyinput v-model="form.username" placeholder="请输入申请人" disabled />
			</uni-forms-item>
			<uni-forms-item label="外出类型" name="travelType">
				<view style="display: flex;align-items: center;">
					<uni-data-select :clear="!isView" v-model="form.travelType" :localdata="bs_travel_type"
						:disabled="isView">
					</uni-data-select>
				</view>
			</uni-forms-item>
			<uni-forms-item label="外出日期" required name="dataRange">
				<uni-datetime-picker v-model="form.dataRange" type="datetimerange" :disabled="isView"
					@change="getDateTime" rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="出差天数" required name="duration">
				<uni-easyinput v-model="form.duration" :disabled="isView" placeholder="请输入出差天数" />
			</uni-forms-item>
			<uni-forms-item label="相关资料" name="avatarFile">
				<FileUpload @select="select" :value="fileLists" @handleView="handleView"></FileUpload>
				<span>只能上传jpg/png文件</span>
			</uni-forms-item>

			<uni-forms-item label="联系电话" required name="contactPhone">
				<uni-easyinput v-model="form.contactPhone" placeholder="请输入联系电话" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="出差原因" required name="travelReason">
				<uni-easyinput type="textarea" v-model="form.travelReason" placeholder="请输入出差原因" :disabled="isView" />
			</uni-forms-item>

			<!-- 
			<uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col>
					<button @click="submitForm" type="primary" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row> -->
			<view class="form_sub_button" v-if=" type!=='view' ">
				<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
			</view>
			<view class="form_sub_button" v-else>
				<FormButton :params="form" :status="form.actBusinessStatus" @update="handleUpdate(form)"
					@cancel="cancelProcessApply(form)" @delete="handleDelete(form)">
				</FormButton>
			</view>
		</uni-forms>


	</view>
</template>

<script>
	import FileUpload from "@/components/FileUpload/FileUpload.vue"
	import {
		getUserProfile
	} from "@/api/system/user";
	import {
		addTravel,
		updateTravel,
		getTravel,
		filesUpload,
		delTravel
	} from "@/api/demo/travel";
	import {
		checkPhone,
		fileUrl
	} from "@/utils/burse"
	import processAip from "@/api/workflow/processInst";
	export default {
		props: {
			isForm: {
				type: Boolean,
				default: false
			},
			formId: {
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
				type: 'add',
				// 表单参数
				form: {},
				// 表单校验
				rules: {
					title: {
						rules: [{
							required: true,
							errorMessage: "标题不能为空"
						}]
					},
					status: {
						rules: [{
							required: true,
							errorMessage: "紧急程度不能为空"
						}]
					},
					contactPhone: {
						rules: [{
							required: true,
							errorMessage: "联系电话不能为空",
							validateFunction: (rule, value, data, callback) => checkPhone(rule, value, data,
								callback)
						}]
					},
					travelType: {
						rules: [{
							required: true,
							errorMessage: "外出类型不能为空"
						}]
					},
					duration: {
						rules: [{
							required: true,
							errorMessage: "出差天数不能为空"
						}]
					},
					travelReason: {
						rules: [{
							required: true,
							errorMessage: "出差原因不能为空"
						}]
					},
					dataRange: {
						rules: [{
							required: true,
							errorMessage: "外出日期不能为空"
						}]
					}
				},
				// 单选数据源
				bs_travel_type: [],
				bs_urgency: [],
				// 按钮加载状态
				buttonLoading: false,

				// 上传文件
				imageValue: [],
				// 回退id
				backId: undefined,

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
			getDateTime(date) {
				let dayDiff;
				let sDate1 = (new Date(date[0]).getTime());
				let sDate2 = (new Date(date[1]).getTime());
				let dateDiff = sDate2 - sDate1;
				dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) + 1; //计算出相差天数
				// var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
				// var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
				this.$set(this.form, 'duration', dayDiff);
			},
			// 查看图片
			handleView(e) {
				console.log('查看图片', e)
				window.open(e[0].url)
			},
			// 获取上传状态
			select({
				e
			}) {
				console.log('选择文件：', e)
				const temp = e.tempFilePaths
				filesUpload({
					filePath: temp[0],
					name: 'files'
				}).then(res => {
					console.log('文件上传成功--->', res)
					this.form.avatarFile = res.url
					this.form.fileName = res.FileName
					// console.log('url--->', fileUrl(res.url))
				}).catch(e => {
					this.$modal.msgError("文件上传失败!请检查文件大小及文件类型。")
				})
			},
			//获取数据
			getTravels(id) {
				console.log('45555555555', id)
				getTravel(id).then(response => {
					console.log('traveledit>', response)
					this.form = response;
					this.form.dataRange = [response.startDate, response.endDate];
					this.$nextTick(() => {
						this.processInstanceId = response.processInstanceId
					})
					// 图片列表
					let {
						avatarFile,
						fileName
					} = response.travelFiles
					if (avatarFile) {
						let urlArr = fileName.split('.')
						this.fileLists.push({
							url: fileUrl(avatarFile),
							extname: urlArr[urlArr.length - 1],
							name: this.form.fileName,
						})
						// console.log('fileLists-->',this.fileLists)
					}

				});
			},
			cancelProcessApply(form) {
				let row = form.actBusinessStatus
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(async () => {
					// await fallbackUserDays(row.id)
					this.getTravels(form.id);
					this.$modal.msgSuccess("撤回成功");
				}).finally(() => {
					this.loading = false;
				});
			},
			//流程操作
			async handleUpdate(form) {
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改出差业务'
				})
				await this.getTravels(form.id)
				this.isView = false
			},
			// 删除
			handleDelete({
				id
			}) {
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delTravel(id);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					setTimeout(() => {
						that.$tab.navigateBack(1)
					}, 1000)
				}).catch(() => {
					that.loading = false;
				});
			},
			/** 提交按钮 */
			submitForm: function() {
				console.log('123', this.form)
				// if (this.fileLists?.get('files')) {
				// 	filesUpload(this.fileForm).then(res => {
				// 		this.form.travelFiles = res.map(ele => {
				// 			return {
				// 				'filePath': ele
				// 			}
				// 		})
				// 	})
				// }
				this.$refs.form.validate(async valid => {
					console.log('valid--->', valid, Boolean(!valid))
					if (!valid) {
						this.form.startDate = this.form.dataRange[0];
						this.form.endDate = this.form.dataRange[1];
						this.buttonLoading = true
						let response;
						if (this.form.id != null) {
							this.backId = this.form.id
							response = await updateTravel(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '出差申请',
								messageContent: '单据【' + response.data.id + "】申请"
							}
							this.submitFormApply(response.data)
						} else {
							response = await addTravel(this.form).then(response => {
								console.log('222', response)
								this.$modal.msgSuccess("新增成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.backId = response.data.id
							this.sendMessage = {
								title: '出差申请',
								messageContent: '单据【' + response.data.id + "】申请"
							}
							this.submitFormApply(response.data)
						}
					}
				});
			},
			submitFormApply(entity) {
				console.log('21121212', entity)
				let variables = {
					entity: entity,
				};
				const data = {
					processKey: "travel", // key
					businessKey: entity.id, // 业务id
					variables: variables,
					classFullName: "com.ycyy.demo.domain.BsTravel",
				};
				processAip.startProcessApply(data).then((response) => {
					console.log("流程-->22222", response);
					this.taskId = response.data.taskId;
					// 查询下一节点的变量
					this.taskVariables = {
						entity: entity, // 变量
						userId: "1",
					};
					let item = {
						taskId: this.taskId,
						taskVariables: this.taskVariables,
						sendMessage: this.sendMessage,
						navigateBack: this.type == 'add' ? 1 : 2,
					}
					console.log(item, '-----item')
					let data = encodeURIComponent(JSON.stringify(item))
					console.log(data, '-----data')

					this.$tab.navigateTo(
						`/components/Process/Verify?data=${data}`
					)
					return
				})
			},
			// 流程取消
			verifyCancel() {
				console.log('leaveDetail==流程取消了')
				fallbackUserDays(this.backId).then(() => {
					this.getTravels(this.backId)
					this.backId = undefined
				})
			},
		},
		mounted() {},
		created() {
			if (this.type === 'add') {
				getUserProfile().then(res => {
					this.form.deptId = res.data.user.deptId
					this.form.userId = res.data.user.userId
					this.$set(this.form, 'username', res.data.user.nickName);
				})
			}

			this.$getDicts("bs_travel_type").then(res => {
				this.bs_travel_type = res.data.map(ele => {
					return {
						text: ele.dictLabel,
						value: ele.dictValue,
					}
				});
			});
			this.$getDicts("bs_urgency").then(res => {
				this.bs_urgency = res.data.map(ele => {
					return {
						text: ele.dictLabel,
						value: ele.dictValue
					}
				});
			});
			// 是否来自工作流表单
			if (this.isForm) {
				this.isView = true
				this.getTravels('created', this.formId)
			}

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad: function(option) {
			console.log('option-->', option)
			let {
				type
			} = option
			this.type = type
			if (type === 'edit') {
				uni.setNavigationBarTitle({
					title: '修改出差业务'
				})
				this.isView = false
				this.getTravels(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增出差业务'
				})
				this.isView = false
			} else if (type === 'view') {
				uni.setNavigationBarTitle({
					title: '查看出差业务'
				})
				this.isView = true
				this.getTravels(option.id)
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


<style lang="scss" scoped>
	.form_sub_button{
		margin:auto;
		position: relative;
	}
</style>

