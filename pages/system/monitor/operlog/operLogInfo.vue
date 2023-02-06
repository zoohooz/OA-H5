<template>
	<view class="example">
		<uni-forms class="form" :modelValue="form" ref="form"  label-width='89px' label-align='right'>
		
			<uni-forms-item label="操作模块：" >
				<label>{{ form.title }} / {{ dict[form.businessType] }}</label>
			</uni-forms-item>
			<uni-forms-item label="登录信息：" >
				{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}
			</uni-forms-item>
			<uni-forms-item label="请求地址：" >
				{{ form.operUrl }}
			</uni-forms-item>
			<uni-forms-item label="请求方式：" >
				{{ form.requestMethod }}
			</uni-forms-item>
			<uni-forms-item label="操作方法：" >
				<label>{{ form.method }}</label>
			</uni-forms-item>
			<uni-forms-item label="请求参数：" >
				{{ form.operParam }}
			</uni-forms-item>
			<uni-forms-item label="返回参数：" >
				{{ form.jsonResult }}
			</uni-forms-item>
			<uni-forms-item label="操作状态：" >
				{{ form.status }}
			</uni-forms-item>
			<uni-forms-item label="操作时间：" >
				{{ form.operTime }}
			</uni-forms-item>
			<uni-forms-item label="异常信息：" >
				{{ form.errorMsg }}
			</uni-forms-item>
			
			
			<view class="form_sub_button">
				<button @click="handleDelete(form)" type="warn">删除</button>
			</view>
			
		</uni-forms>
				
				
	</view>
</template>

<script>
import { delOperlog, cleanOperlog } from "@/api/monitor/operlog";
	export default {
		components: {},
		data() {
			return {
				form: {},
				dict:{},
			}
		},
		methods: {
			handleDelete({operIds}) {
				this.$modal.confirm('是否确认删除日志编号为"' + operIds + '"的数据项？').then(function() {
					return delOperlog(operIds);
				}).then(() => {
					this.$modal.msgSuccess("删除成功");
					this.cancle();
				});
			},
		},
		mounted() {
		},
		created() {
			
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			this.$getDicts("sys_oper_type").then(res => {
				res.data.forEach(ele => {
					this.dict[ele.dictValue] = ele.dictLabel
				})
			})
			console.log('操作日志',option,this.dict)
			let { data } = option
			this.form = data
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
.uni-forms{
	::v-deep .uni-forms-item__content{
		display: flex;
		align-items: center;
		// overflow-wrap: anywhere;
		word-break: break-word;
	}
}
</style>