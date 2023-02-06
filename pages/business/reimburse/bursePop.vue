<template>
	<!-- 修改 弹窗 -->
	<uni-popup ref="dialogRef" type="dialog">
		<view class="popupDia">
			<view class="content">
				<view class="item">添加报销明细</view>
				<view class="item">
					<uni-forms :modelValue="formData" ref="formRef" :rules="rules" label-width='74px' label-align='right'>
						<uni-forms-item label="费用日期" required name="conDate"> 
							<uni-datetime-picker v-model="form.conDate" type="date" v-show="!isView" />
						</uni-forms-item>
						<uni-forms-item label="费用科目" required name="subjectName"> 
							<uni-data-select v-model="form.subjectName" :localdata="bs_burse_account"></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="费用说明" required name="explaing">
							<uni-easyinput v-model="form.explaing" type="textarea" :disabled="isView"/>
						</uni-forms-item>
						<uni-forms-item label="票据张数" required name="quantity">
							<uni-easyinput v-model="form.quantity" type="number" :disabled="isView"/>
						</uni-forms-item>
						<uni-forms-item label="票据张数" required name="money">
							<uni-easyinput v-model="form.money" type="number" :disabled="isView"/>
						</uni-forms-item>
						<uni-forms-item label="是否替票" required name="stare">
							<uni-data-select v-model="form.stare" :disabled="isView" :clear="!isView"  :localdata="[{text:'是',value: '1'},{text:'否',value: '0'}]"></uni-data-select>
						</uni-forms-item>	
						<uni-forms-item label="相关票据" required name="fileLists">
							<FileUpload :value="form.fileLists" ref="fileUploadRef" :readonly="isView" @select="select" @handleView="handleView" ></FileUpload>
						</uni-forms-item>	
					</uni-forms>
				</view>
				<view class="item">
					<uni-row class="demo-uni-row" :gutter="8">
						<uni-col :span="7">
							<button @click="$refs.dialogRef.close()">取消</button>
						</uni-col>
						<uni-col :span="9">
							<button @click="next" type="primary" :loading="buttonLoading">Next</button>
						</uni-col>
						<uni-col :span="8">
							<button @click="submit" type="primary" :loading="buttonLoading">完成</button>
						</uni-col>
					</uni-row>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import { uploadfile } from "@/api/demo/reimburse";
	import {fileUrl} from "@/utils/burse";
	export default {
		props:{
			form:{
				type: Object,
				default: () =>{}
			},
			rules:{
				type: Object,
				default: () =>{}
			},
			isView:{
				type: Boolean,
				default: false
			},
		},
		components: {},
		data() {
			return {
				buttonLoading:false,
				bs_burse_account:[],
			}
		},
		computed:{
			formData:{
				get(){
					console.log('get-->',this.form)
					return this.form
				},
				set(v){
					console.log('set-->',v)
					return v
				}
			},
			
		},
		methods: {
			open(){
				this.$refs.dialogRef.open()
			},
			close(){
				this.$refs.dialogRef.close()
			},
			
			next(){
				this.buttonLoading = true
				this.$emit('next',this.formData)
				this.$refs.fileUploadRef.$refs.uniFilePickerRef.clearFiles()
				this.transit()
			},
			submit(){
				this.buttonLoading = true
				this.close()
				this.$emit('submit',this.formData)
				this.transit()
			},
			transit(){
				this.buttonLoading = false
				this.$modal.msgSuccess('添加成功')
			},
			
			// 获取上传状态
			select({e}){
				console.log('选择文件：',e)
				const temp = e.tempFilePaths
				uploadfile({
					filePath:  temp[0],
					name: 'avatarfile'
				}).then(res =>{
					console.log('上传文件成功-->',res)
					this.formData.avatarFile = res.url
					this.formData.fileName = res.FileName
					let urlArr = res.FileName.split('.')
					this.formData.fileLists = [{
						url: fileUrl(res.url),
						extname: urlArr[urlArr.length-1],
						name: res.FileName,
					}]
					console.log('url--->',fileUrl(res.url))
				}).catch(e =>{
					this.$modal.msgError("文件上传失败!请检查文件大小及文件类型。")
				})
			},
			handleView(){
				
			},
		},
		mounted() {
		},
		async created() {
			this.bs_burse_account = await this.$getDictsList('bs_burse_account')
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
			this.buttonLoading = false
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
// 弹窗样式
.popupDia{
	height: 71vh;
	width: 85vw;
	background-color: white;
	border-radius: 20px;
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		.item{
			width: 80%;
		}
		.item:nth-of-type(1){
			text-align: center;
			color: #a9a6a6;
		}
	}
}
</style>