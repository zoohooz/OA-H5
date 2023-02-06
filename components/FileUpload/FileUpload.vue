<template>
	<view class="view_uni_file_picker" :style="view_buttom">
		<uni-file-picker 
		  	ref="uniFilePickerRef"
      		class="uni_file_picker "
			:readonly="readonly"
			:file-mediatype="fileMediatype"
			:file-extname="fileExtname"
			:limit="limit" 
			:auto-upload="false"
			mode="list" 
			@select="select" 
			@progress="progress" 
			@success="success" 
			@fail="fail" 
			:value="value"
		>
		<!-- :listStyles="listStyles" -->
		</uni-file-picker>
		<button v-show="readonly" 
			type="primary" 
			size="mini" 
			style="height: 30px;"
			@click="handleView"
		>查看文件</button>
	</view>
</template>

<script>
	export default {
		props:{
			view_buttom:{
				type: String,
				default: "display: 'flex';"
			},
			// 只读
			readonly:{
				type: Boolean,
				default: false
			},
			// 文件类型 all image vidio
			fileMediatype:{
				type: String,
				default: 'all'
			},
			// 选择文件后缀，字符串的情况下需要用逗号分隔
			fileExtname:{
				type: String,
				default: 'jpg,png,pdf'
			},
			// 最大选择个数 ，h5 会自动忽略多选的部分
			limit:{
				type: String,
				default: '1'
			},
			// 组件数据，通常用来回显
			value:{
				type: Array,
				default: () => []
			}
		},
		components: {},
		data() {
			return {
				// listStyles: {
				//  	// 是否显示边框
				//  	border: true,
				//  	// 是否显示分隔线
				//  	dividline: true,
				//  	// 线条样式
				//  	borderStyle: {
				//  		width: 1,
				//  		color: 'blue',
				//  		style: 'dashed',
				//  		radius: 2
				//  	}
				//  },
			}
		},
		methods: {
			select(e){
				this.$emit('select',{e,...this.$attrs})
			},
			// 获取上传进度
			progress(e){
				this.$emit('progress',e)
			},
			// 上传成功
			success(e){
				this.$emit('success',e)
			},
			// 上传失败
			fail(e){
				this.$emit('fail',e)
			},
			handleView(){
				this.$emit('handleView',this.value)
			},
		},
		mounted() {
		},
		created() {
			
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
.uni_file_picker{
	color: red;
	::v-deep .uni-file-picker__files{
		.files-button{
			min-width: 88px;
		}
		.files__name{
			// white-space:nowrap
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}
}
</style>