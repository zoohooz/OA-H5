<template>
	<view class="uni-group">
		
		<button 
			v-for="(item,index) in innerList"
			:key="index"
			v-show="item.visible"
			:class=" 'uni-button '+ item.className " 
			size="mini" 
			:type="item.type" 
			@click="handler(item.handle)"
		>
			<!-- @click="handle(item.handle,item.params)" -->
			{{item.label}}
		</button>
		
		<!-- <button class="uni-button" size="mini" type="primary" @click="handleUpdate(item)">修改</button> -->
		<!-- <button class="uni-button line-blue" size="mini" @click="handleResetPwd(item)">重置密码</button> -->
		<!-- <button class="uni-button line-blue" size="mini" @click="handleAuthRole(item)">分配角色</button> -->
		<!-- <button class="uni-button" size="mini" type="warn" @click="handleDelete(item)">删除</button> -->
	</view>
</template>

<script>
	export default {
		props:{
			bthList:{
				type: Array,
				default:() => []
			},
			params:{
				type: Object,
				default: () => {}
			},
			isEmit:{
				type: Boolean,
				default: false
			},
			status:{
				type: String,
			}
		},
		components: {},
		data() {
			return {
				// innerList: this.bthList,
			}
		},
		computed:{
			innerList(){
				console.log('TabelButton->computed')
				if( this.bthList.length <= 0 ){
					return [
						{
							className:'line-blue',
							type:'',
							handle:'view',
							label: '查看',
							// visible: true,
							visible: this.getVisible(['draft'],false),
							order:1
						},
						{
							className:'',
							type:'primary',
							handle:'update',
							label: '修改',
							// visible: true,
							visible: this.getVisible(['draft','back','cancel'],true),
							order:2
						},
						{
							className:'',
							type:'',
							handle:'cancel',
							label: '撤销',
							// visible: true,
							visible: this.getVisible(['waiting'],true),
							order:3
						},
						{
							className:'',
							type:'warn',
							handle:'delete',
							label: '删除',
							// visible: true,
							visible: this.getVisible(['draft','back','cancel'],true),
							order:4
						}
					]
				}
			},
		},
		methods: {
			/**
			 * 传入按钮列表
			 * @param name 事件名称
			 * @param params 事件参数
			 */
			handler(name){
					console.log(this.$listeners,name)
					this.$listeners[name](this.params)
			},
			/**
			 * 绑定事件
			 * @param statusList 筛选的列表
			 * @param type true-筛选 false-反选
			 */
			getVisible(statusList,type){
				let index = statusList.indexOf(this.status)
				if(type){
					return index == -1 ? false : true
				}else{
					return index == -1 ? true : false
				}
			}
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

<style scoped lang="scss">
	.uni-group {
		display: flex;
		align-items: center;
		.uni-button{
			margin: 0px 3px;
			margin-left: 10px;
		}
		// .uni-button[disabled]{
		// 	color: white;
		// 	background-color: #4444;
		// 	border-color: #4444;
		// 	&::after{
		// 		border-color: #4444;
		// 	}
		// }
	}	
</style>
