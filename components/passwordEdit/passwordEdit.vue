<template>
	<view>
		<view :hidden="visiable" class="popup_content">
			<uni-section :title="title" type="line"></uni-section>

			<uni-row class="demo-uni-row example">
				<uni-col :span="24">
					<uni-easyinput type="password" v-model="password" :placeholder="title" />
				</uni-col>
			</uni-row>

			<uni-row class="demo-uni-row example">
				<uni-col :span="12">
					<button @click="init(true)">取消</button>
				</uni-col>
				<uni-col :span="12">
					<button @click="submitForm" type="primary">确定</button>
				</uni-col>
			</uni-row>
		</view>

		<view class="popup_overlay" :hidden="visiable" @click="init(true)"></view>
	</view>
</template>

<script>
	export default {
		components: {},
		// props:{
		// 	title:{
		// 		type: String,
		// 		default: ''
		// 	}
		// },
		data() {
			return {
				visiable: true,
				title:'',
				password: '',
				
				row:'',
			}
		},
		methods: {
			init(type,title ,row) {
				this.visiable = type
				this.title = title
				this.password = ''
				this.row = row
			},

			submitForm() {
				this.$emit('submitForm',this.password,this.row)
				this.visiable = true
			},
		},
		mounted() {},
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

<style scoped>
	.popup_overlay {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background-color: black;
		z-index: 1001;
		-moz-opacity: 0.8;
		opacity: .80;
		filter: alpha(opacity=88);
	}

	.popup_content {
		position: fixed;
		top: 40%;
		left: 15%;
		width: 70vw;
		height: 28vh;
		/* margin-left: -270rpx; */
		/* margin-top: -270rpx; */
		border: 10px solid white;
		background-color: white;
		z-index: 1002;
		overflow: auto;
	}
	
	.example {
		padding: 15px;
	}
</style>
