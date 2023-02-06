<template>
	<view class="form_list">
		<!-- 查询条件 -->
		<!-- <uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="false">

				<view class="example">
					<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
						<uni-forms-item label="字典名称">
							<uni-data-select v-model="queryParams.dictType" :localdata="typeOptions" placeholder="请选择">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="字典标签">
							<uni-easyinput type="text" v-model="queryParams.dictLabel" placeholder="请输入字典标签" />
						</uni-forms-item>
						<uni-forms-item label="状态">
							<uni-data-select v-model="queryParams.status" :localdata="act_statusLists"
								placeholder="数据状态">
							</uni-data-select>
						</uni-forms-item>
						<uni-row class="search_button" :gutter="12">
							<uni-col :span="12">
								<button @click="handleQuery" form-type="submit" type="primary">搜索</button>
							</uni-col>
							<uni-col :span="12">
								<button @click="resetQuery" form-type="reset">重置</button>
							</uni-col>
						</uni-row>

					</uni-forms>

				</view>

			</uni-collapse-item>
		</uni-collapse> -->
		
		
		<!-- 操作按钮 -->
		<uni-row class="demo-uni-row example" :gutter="10">
			<uni-col :span="2.5">
				<view style="display: flex;">
				字典数据：
				<button @click="handleAdd" class="cu-btn sm block line-blue">
					<text class="cuIcon-add"></text> 新增字典数据
				</button>
				</view>
			</uni-col>
			<!-- <uni-col :span="2.5">
				<button @click="handleDelete" class="cu-btn sm block line-red">
					<text class="cuIcon-delete"></text> 删除
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="handleClose" class="cu-btn sm block line-green">
					<text class="cuIcon-close"></text> 关闭
				</button>
			</uni-col> -->
		</uni-row>
		
		<!-- 列表数据 -->
			<FormListContent
				title="字典标签 : +dictLabel"
				:list="leaveList"
				:content="contentList"
				username="updateBy"
				:dictTag="{
					dict: act_statusList,
					value: 'status',
				}"
				@click="(item) => handleUpdate(item)"
			></FormListContent>
			
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		
		<!-- 表格数据 -->
		<!-- <view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">字典编码</uni-th>
					<uni-th align="center">字典标签</uni-th>
					<uni-th align="center">字典键值</uni-th>
					<uni-th align="center">字典排序</uni-th>
					<uni-th align="center">状态</uni-th>
					<uni-th align="center">备注</uni-th>
					<uni-th align="center">创建时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in leaveList" :key="index">
					<uni-td align="center">{{ item.dictCode }}</uni-td>
					<uni-td align="center">{{ item.dictLabel }}</uni-td>
					<uni-td align="center">{{ item.dictValue }}</uni-td>
					<uni-td align="center">{{ item.dictSort }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="act_statusList" :value="item.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">{{ item.remark }}</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<view class="uni-group">
								<button class="uni-button" size="mini" type="primary" style="margin-right: 3px;"
									@click="handleUpdate(item)">修改</button>
								<button class="uni-button" size="mini" type="warn" @click="handleDelete(item)"
									style="margin-right: 3px;">删除</button>
							</view>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view> -->


	</view>
</template>

<script>
	import {
		listData,
		delType,
		refreshCache
	} from "@/api/system/dict/data";
	import {
		optionselect as getDictOptionselect,
		getType
	} from "@/api/system/dict/type";
	import {
		checkPermi,
		checkRole
	} from "@/utils/permission"; // 权限判断函数
	import processAip from "@/api/workflow/processInst";
	export default {
		props:{
			id:{
				type: Number,
				default: 0,
			}
		},
		components: {},
		data() {
			return {
				// 查询参数
				queryParams: {
					dictCode: undefined,
					dictLabel: undefined,
					dictValue: undefined,
					cssClass: undefined,
					listClass: 'default',
					dictSort: 0,
					status: "0",
					remark: undefined
				},
				total: 0,
				act_statusList: [],
				act_statusLists: [{
					text: '正常',
					value: "0",
					disable: false,

				}, {
					text: '停用',
					value: "1",
					disable: false,
				}],
				ids: [],
				// 类型数据字典
				typeOptions: [],
				// 默认字典类型
				defaultDictType: "",
				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				contentList:[
					{
						label: '字典键值',
						prop: 'dictValue',
					},
					{
						label: '备注',
						prop: 'remark',
					}
				],
				dateRange: []
			}
		},
		methods: {
			/** 查询字典类型详细 */
			getType(dictId) {
				getType(dictId).then(response => {
					this.queryParams.dictType = response.data.dictType;
					this.defaultDictType = response.data.dictType;
					this.getList();
				});
			},
			/** 查询字典类型列表 */
			getTypeList() {
				getDictOptionselect().then(response => {
					console.log('response.data', response.data)
					this.typeOptions = response.data.map(ele => {
						return {
							text: ele.dictName,
							value: ele.dictType
						}
					});
					console.log('2223323232', this.typeOptions)
				});
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.ids.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},
			// 多选
			selectionChange(e) {
				this.ids = e.detail.index.map(item => {
					return this.leaveList[item].dictCode
				})
				console.log('ids==>', this.ids)
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams = {
					dictCode: undefined,
					dictLabel: undefined,
					dictValue: undefined,
					cssClass: undefined,
					listClass: 'default',
					dictSort: 0,
					status: "0",
					remark: undefined
				}
				this.dateRange = []
				// this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询字典列表 */
			getList() {
				this.loading = true;
				listData(this.queryParams).then(response => {
					console.log('字典=>', response)
					this.leaveList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			/** 新增按钮操作 */
			handleAdd() {
				uni.navigateTo({
					url: `pages/system/dict/dataDetails?type=add&data=${this.queryParams.dictType}`
				});
			},
			// 修改事件
			handleUpdate(row) {
				console.log('handleUpdate====', row)
				const id = row.dictCode || this.ids[0];
				console.log('edit-->', id)
				if (!id) {
					this.$modal.msgError("请选择数据!");
					return
				}
				uni.navigateTo({
					url: `pages/system/dict/dataDetails?type=edit&id=${id}`
				});
			},
			// 关闭
			handleClose() {
				uni.navigateTo({
					url: `pages/system/dict/index`
				});
			},
			/** 刷新缓存按钮操作 */
			handleRefreshCache() {
				refreshCache().then(() => {
					this.$modal.msgSuccess("刷新成功");
				});
			},
			// 删除
			/* handleDelete(row) {
				const id = row.dictCode || this.ids;
				if (id == "") {
					this.$modal.msgError("请选择数据!");
					return
				}
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delType(id);
				}).then(() => {
					that.loading = false;;
					that.getList();
					that.$modal.msgSuccess("删除成功")
				}).catch(() => {
					that.loading = false;
				});
			}, */
		},
		created() {
			console.log('字典详情---页面显示',this.id)
			if(!this.id){
				return
			}
			this.getType(this.id);
			this.getTypeList();
			// this.getList()
			
			this.ids = []
			this.$getDicts("sys_normal_disable").then(res => {
				this.act_statusList = res.data
			});

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			// this.getType(option.id);
			// this.getTypeList();
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
