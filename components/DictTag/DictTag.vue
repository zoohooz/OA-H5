<template>
	<view class="dict_tag">
		<uni-tag custom-style="customStyle" :inverted="true" :text="text" :type="type ? type : typeList[text]" />
	</view>
</template>
<script>
	export default {
		props:{
			dict:[Array,String],
			value: [String,Number],
			customStyle:{
				type: String,
				default: ''
			},
			type:{
				type: String,
				default: ''
			},
		},
		components: {},
		data() {
			return {
				typeList:{
					'草稿': 'default',
					'已撤回': 'default',
					'处理中': 'primary',
					'已完成': 'success',
					'激活': 'success',
					'挂起': 'error',
					'成功': 'success',
					'失败': 'error'
				},
				// innerList:[],
			} 
		},
		computed:{
			innerList(){
				// console.log('DictTag->computed')
				//创建获取字典数据
				if(this.dict){
					if(typeof this.dict === 'string'){
						return this.getDict( this.dict )
					}else{
						return this.dict
					}
				}
			},
			text:{
				get(){
					return this.getLabel(this.value)
				}
			}
		},
		methods: {
			getDict(name){
				const { $getDicts } = this
				return $getDicts(name).then(res =>{
					// console.log('getDict--res->',res)
					return res.data
				})
			},
			getLabel(value){
				// console.log('getLabel----',value)
				return this.innerList.filter(item =>{
						return item.dictValue == this.value
					})[0]?.dictLabel
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
</style>