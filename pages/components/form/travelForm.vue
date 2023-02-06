<template>
	<view>
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
			<uni-forms-item label="申请人" name="username" :disabled="true">
				<uni-easyinput v-model="form.username" placeholder="请输入申请人" :disabled="isView" />
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
		</uni-forms>
		<!-- 操作按钮 -->
		<uni-row class="demo-uni-row example formButtom" :gutter="10">
			<uni-col :span="2.5">
				<button :loading="buttonLoading" @click="submitForm" class="cu-btn sm block bg-grey">
					暂存
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button :loading="buttonLoading" @click="submitForm" class="cu-btn sm block bg-blue">
					提交
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="cancel" class="cu-btn sm block line-whilte">
					取 消
				</button>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import {
		getTravel,
	} from "@/api/demo/travel";
	import travelDetails from '@/pages/business/travel/travelDetails';
	export default {
		name: 'travelForm',
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String // 任务id
		},
		components: {
			travelDetails
		},
		data() {
			return {
				isView: false,
				// 按钮loading
				buttonLoading: false,
				// 遮罩层
				loading: true,
				// 表单参数
				form: {},
				taskVariables: undefined,
				//消息提醒
				sendMessage: {},
				bs_urgency: [],
				bs_travel_type: [],
				fileLists: [],
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
			}
		},
		methods: {
			async getById() {
				const data = await getTravel(this.businessKey).then(res => {
					return res
				})
				this.form = data;
				console.log('111', data)
				this.form.dataRange = [data.startDate, data.endDate];
				console.log('this.form.dataRange',this.form.dataRange)
				// this.form = data;
			},
			// 取消按钮
			cancel() {
				this.$emit("closeForm")
			},
			/** 提交按钮 */
			submitForm() {
				getTravel(this.businessKey).then(response => {
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '出差申请',
						messageContent: '单据【' + this.businessKey + "】申请"
					}
					this.submitFormApply(response.data)
				});
			},
			//提交流程
			submitFormApply(entity) {
				let item = {
					taskId: this.taskId,
					taskVariables: this.taskVariables,
					sendMessage: this.sendMessage,
					navigateBack: 2,
				}
				let data = encodeURIComponent(JSON.stringify(item))
				console.log(data, '-----data')
				this.$tab.navigateTo(
					`/components/Process/Verify?data=${data}`
				)
			},
		},
		watch: {
			businessKey: {
				immediate: true, // 很重要！！！
				handler(newVal) {
					if (newVal) {
						this.getById()
					}
				}
			}
		},
		mounted() {},
		created() {
			this.$getDicts("bs_travel_type").then(res => {
				this.bs_travel_type = res.data.map(ele => {
					return {
						text: ele.dictLabel,
						value: ele.dictValue,
					}
				});
				console.log('this.bs_travel_type', this.bs_travel_type)
			});
			this.$getDicts("bs_urgency").then(res => {
				this.bs_urgency = res.data.map(ele => {
					return {
						text: ele.dictLabel,
						value: ele.dictValue
					}
				});

			});
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

<style>

</style>
