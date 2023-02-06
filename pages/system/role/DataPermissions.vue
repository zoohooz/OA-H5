<template>
	<view>
		<view :hidden="visiable" class="popup_content">
			<uni-section :title="title" type="line"></uni-section>

			<uni-row class="demo-uni-row example">
				<uni-col :span="24">
					
					<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='80px' label-align='right'>
						<uni-forms-item label="角色名称" name="roleName">
							<uni-easyinput v-model="form.roleName" />
						</uni-forms-item>
						<uni-forms-item label="权限字符" name="roleKey">
							<uni-easyinput v-model="form.roleKey" />
						</uni-forms-item>
						<uni-forms-item label="权限范围" name="dataScope">
							<uni-data-select
							  v-model="form.dataScope"
							  :localdata="dataScopeOptions"
							></uni-data-select>
						</uni-forms-item>
					</uni-forms>
					
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
		data() {
			return {
				visiable: true,
				title:'',
				
				row:'',
				
				form:{},
				rules:{},
				
				// 数据范围选项
				dataScopeOptions: [
				  {
				    value: "1",
				    text: "全部数据权限"
				  },
				  {
				    value: "2",
				    text: "自定数据权限"
				  },
				  {
				    value: "3",
				    text: "本部门数据权限"
				  },
				  {
				    value: "4",
				    text: "本部门及以下数据权限"
				  },
				  {
				    value: "5",
				    text: "仅本人数据权限"
				  }
				],
			}
		},
		methods: {
			init(type, title ,row, form = {}) {
				this.visiable = type
				this.title = title
				this.row = row
				this.form = form
			},

			submitForm() {
				this.form.deptIds = [];
				this.$emit('submitForm',this.form,this.row)
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
		top: 20%;
		left: 5%;
		width: 90vw;
		height: 45vh;
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
