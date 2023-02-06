<template>
		<!-- 列表数据 -->
		<uni-list :border="true" class="form_list_content">
			<uni-list-item :border="true" clickable
				uni_border_color="#a6a6a6" 
				v-for="(item,index) in list"
				:key="index" 
				:to="to ? `${to}?type=view&id=${item.id}` : '' "
				@click="$emit('click',item)"
			>
				<template v-slot:body>
					<view class="slot-body">
						<view class="list_title ">
							<uni-title type="h4" :title="getTitle(item)"><!-- item[title] --></uni-title>
							<!--说明 $attrs.dictTag.dict : [{dictLabel:'激活',dictValue:'激活'}]-->
							<!--说明 $attrs.dictTag.value : 'processStatus' -->
							<DictTag 
								v-if="hasStatus"
								:dict="$attrs.dictTag ? $attrs.dictTag.dict : dictList" 
								:value="$attrs.dictTag ? item[$attrs.dictTag.value] : item.actBusinessStatus.status">
							</DictTag>
						</view>
						<view class="list_body">
							<view class="list_body_content"  v-for="(items,index) in content" :key="index">
								<!--说明 items.dict 为 item.content 里的字段 -->
								{{items.label}} : {{ getContentValue(item,items) }} <!-- items.dict ? items.dict[ item[items.prop] ] : item[items.prop] -->
								<!-- <DictTag :dict="dictList" :value="item.leaveType"></DictTag> -->
							</view>
						</view>
					</view>
				</template>
				
				<template v-slot:footer>
					<view class="list_footer">
						<text>{{item[createTime]}}</text>
						<text>{{item[username]}}</text>
					</view>
				</template>
				
			</uni-list-item>
		</uni-list>
</template>

<script>
	export default {
		name: 'FormListContent',
		props:{
			list:{
				type: Array,
				default: []
			},
			dict:{
				type: Boolean,
				default: true
			},
			to:{
				type: [String,Boolean],
				default: '' || false
			},
			content:{
				type: Array,
				default: []
			},
			hasStatus:{
				type: Boolean,
				default: true
			},
			//字段 
			title:{
				type: String,
				default: 'title'
			},
			createTime:{
				type: String,
				default: 'createTime'
			},
			username:{
				type: String,
				default: 'username'
			},
		},
		components: {},
		data() {
			return {
				dictList:[],
				innerTitle:'',
			}
		},
		methods: {
			getTitle(item){
				const {innerTitle} = this
				if(typeof innerTitle === 'string'){
					return item[innerTitle]
				}else{
					let returnText='';
					for(let index in innerTitle) {
						returnText += item[innerTitle[index]] ?? innerTitle[index]
					}
					return returnText
				}
			},
			async getDictTag(){
				return await this.$getDicts("act_status").then(res =>{
					return res.data
				})
			},
			getContentValue(item,cloumn){
				if(cloumn?.dict){
					 return cloumn.dict[ item[cloumn.prop] ]
				}

				let propArr = cloumn.prop.split('.')
				
				let returnValue = item[ propArr[0] ]
				
				let i = 1
				while( i < propArr.length ){
					let propItem = propArr[i]
					try{
						returnValue = returnValue[ propItem ] 
					}
					catch(e){
						returnValue = ''
					}
					i++
				}
				// console.log('returnValue========>',returnValue)
				
				return returnValue
				// return items.dict ? items.dict[ item[prop] ] : item[prop]
			}
		},
		mounted() {
		},
		async created() {
			let title = this.title.split('+')
			this.innerTitle = title.length === 1 ? title[0] : title
			
			if(this.dict){
				// 自定义流程状态dict
				if(this.$attrs?.dictTag){
					return
				}
				this.dictList = await this.getDictTag()
			}
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