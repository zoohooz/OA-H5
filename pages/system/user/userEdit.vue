<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='80px' label-align='right'>

			<uni-forms-item label="用户昵称" required name="nickName">
				<uni-easyinput v-model="form.nickName" placeholder="请输入用户昵称" />
			</uni-forms-item>
			<uni-forms-item label="归属部门">
				<DeptSelect @confirm="confirm" :label="deptLabel"></DeptSelect>
				<!-- <uni-easyinput v-model="form.deptId" placeholder="请输入归属部门" /> -->
				<!-- <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" /> -->
			</uni-forms-item>
			<uni-forms-item label="手机号码">
				<uni-easyinput  v-model="form.phonenumber" placeholder="请输入手机号码" />
			</uni-forms-item>
			<uni-forms-item label="邮箱">
				<uni-easyinput  v-model="form.email" placeholder="请输入邮箱" />
			</uni-forms-item>
			<uni-forms-item label="用户名称" required name="userName">
				<uni-easyinput  v-model="form.userName" placeholder="请输入用户名称" />
			</uni-forms-item>
			<uni-forms-item v-if="form.userId == undefined" label="用户密码" required name="password">
				<uni-easyinput type="password" v-model="form.password" placeholder="请输入用户密码" />
			</uni-forms-item>
			<uni-forms-item label="用户性别">
				<!-- <uni-data-checkbox v-model="form.sex" :localdata="sys_user_sex" /> -->
				<uni-data-select
				  v-model="form.sex"
				  :localdata="sys_user_sex"
				></uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="状态">
				<uni-data-checkbox v-model="form.status" :localdata="sys_normal_disable" />
			</uni-forms-item>
			<uni-forms-item label="岗位">
				<!-- <uni-easyinput type="text" v-model="form.postId" placeholder="请输入岗位" /> -->
				<!-- <uni-data-select
				  v-model="form.postIds"
				  :localdata="postOptions"
				></uni-data-select> -->
				<ld-select 
				  :multiple="true" :list="postOptions"
				  label-key="postName" value-key="postId"
				  placeholder="请选择"
				  clearable
				  v-model="form.postIds"
					@change="selectPostIds"
				  ></ld-select>
			</uni-forms-item>
			<uni-forms-item label="角色">
				<!-- <uni-easyinput type="text" v-model="form.roleId" placeholder="请输入角色" /> -->
				<!-- <uni-data-select
				  v-model="form.roleIds"
				  :localdata="roleOptions"
				></uni-data-select> -->
				<ld-select
				  :multiple="true" :list="roleOptions"
				  label-key="roleName" value-key="roleId"
				  placeholder="请选择"
				  clearable
				  v-model="form.roleIds"
					@change="selectRoleIds"
				  ></ld-select>
			</uni-forms-item>
			<uni-forms-item label="备注">
				<uni-easyinput type="textarea" v-model="form.remark" placeholder="请输入备注" />
			</uni-forms-item>
			
			<view class="form_sub_button">
				<button v-if="type !== 'add'" @click="handleDelete" type="warn">删除</button>
				<button v-if="type !== 'add'" class="uni-button line-blue" @click="handleResetPwd(form)">重置密码</button>
				<button v-if="type !== 'add'" class="uni-button line-blue" @click="handleAuthRole(form)">分配角色</button>
				<button @click="submitForm" type="primary">提交</button>
			</view>
			<!-- <uni-row class="demo-uni-row"> -->
				<!-- <uni-col :span="12">
					<button @click="cancle">取消</button>
				</uni-col> 
				<uni-col :span="6">
					<button @click="submitForm" type="primary">确定</button>
				</uni-col> -->
			<!-- </uni-row> -->

		</uni-forms>
		
		<uni-popup ref="popup" type="message">
			<uni-popup-message type="success" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
		
		<PasswordEdit ref="PasswordEditRef" @submitForm="pwdSub"></passwordEdit>
	</view>
</template>

<script>
	import {
		getUser,
		// delUser,
		addUser,
		updateUser,
		// resetUserPwd,
		// changeUserStatus
	} from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
	import DeptSelect from "@/components/DeptSelect/DeptSelect.vue"
	import PasswordEdit from '@/components/passwordEdit/passwordEdit.vue'
// import Treeselect from "@riophae/vue-treeselect";
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
 
	export default {
		components: { 
			/* Treeselect */
			DeptSelect,
			PasswordEdit
		},
		data() {
			return {
				// 操作类型
				type:'add',
				deptOptions: '',
				postOptions: '',
				roleOptions: '',
				form: {},

				// 校验规则
				rules: {
					nickName: {
						rules: [{
							required: true,
							errorMessage: '用户昵称不能为空'
						}]
					},
					userName: {
						rules: [{
							required: true,
							errorMessage: '年龄不能为空'
						}
						/* , {
							format: 'number',
							errorMessage: '年龄只能输入数字'
						} */
						]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: '用户密码不能为空'
						}]
					},
				},
					
				messageText:'',
				// 单选数据源
				sys_user_sex:[],
				sys_normal_disable:[],
				
				// 部门回显名称 暂时没有数回显选择
				deptLabel:''
			}
		},
		mounted() {},
		created() {
			this.getUserData('')
			this.reset()
			// 获取字典 sys_user_sex sys_normal_disable
			this.$getDicts("sys_user_sex").then(res => {
			    this.sys_user_sex = res.data.map(ele =>{
						return {
							text: ele.dictLabel,
							value: ele.dictValue
						}
					});
			  });
			this.$getDicts("sys_normal_disable").then(res => {
				console.log('字典',res)
			    this.sys_normal_disable = res.data.map(ele =>{
						return {
							text: ele.dictLabel,
							value: ele.dictValue
						}
					});
			  });
			
				// this.form.password = this.initPassword;
			/** 查询部门下拉树结构 */
			this.getTreeselect()
		},
		methods: {
			confirm(e){
				this.form.deptId = e[0].id
				this.deptLabel = e[0].label
			},
			// 下拉多选事件
			selectPostIds(e){
				this.form.postIds = e
			},
			selectRoleIds(e){
				this.form.roleIds = e
			},
			// 表单重置
			reset() {
				this.form = {
					userId: undefined,
					deptId: undefined,
					userName: undefined,
					nickName: undefined,
					password: undefined,
					phonenumber: undefined,
					email: undefined,
					sex: undefined,
					status: '0',
					remark: undefined,
					postIds: [],
					roleIds: [],
					positiveState: null
				};
			},
			getTreeselect() {
			  treeselect().then(response => {
			    this.deptOptions = response.data;
					console.log('获取部门树------>',this.deptOptions)
			  });
			},
			changeSex(e){
				console.log(e)
			},
			cancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			/** 提交按钮 */
			submitForm: function() {
				this.$refs.form.validate(valid => {
					console.log('valid--->',valid,Boolean(!valid))
					if (!valid) {
						console.log('form--->',this.form,)
						if (this.form.userId != undefined) {
							console.log('this.form-1->', this.form);
							updateUser(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								this.cancle()
							});
						} else {
							addUser(this.form).then(response => {
								console.log('this.form=2=>', this.form);
								this.$modal.msgSuccess("添加成功");
								const pages = getCurrentPages();
								const prevPage = pages[pages.length - 1 ];
								prevPage.onClickItem({currentIndex: 1})
							});
						}
						
					}
				});
			},
			getUserData(id){
				getUser(id || '').then(response => {
					console.log('getUser-->', response)
					this.postOptions = response.data.posts.map(ele =>{
						return {	value: ele.postId,	text: ele.postName,	...ele}
					});
					this.roleOptions = response.data.roles.map(ele =>{
						return {	value: ele.roleId,	text: ele.roleName,	...ele}
					});
					if(!id){
						return
					}
					this.form = response.data.user;
					this.form.postIds = response.data.postIds;
					this.form.roleIds = response.data.roleIds;
					this.form.password = "";
					// 部门
					this.deptLabel = response.data?.user?.dept?.deptName
				})
			},
			/** 删除按钮操作 */
			handleDelete({userId}) {
				this.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
					return delUser(userIds);
				}).then(() => {
					this.$modal.msgSuccess("删除成功");
					this.cancle();
				});
			},
			/** 重置密码按钮操作 */
			handleResetPwd(row) {
				const title = `请输入${row.userName}的新密码`
				this.$refs.PasswordEditRef.init(false, title, row)
			},
			pwdSub(e, row) {
				console.log(e, row)
				resetUserPwd(row.userId, e).then(response => {
					this.$modal.msgSuccess("修改成功，新密码是：" + e);
				});
			},
			/** 分配角色操作 */
			handleAuthRole({userId}) {
				this.$router.push("/pages/system/user/authRole?id=" + userId);
			},
			// method
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad: function (option) {
			let { type } = option
			this.type = type
			let titleList = {
				'view' : '查看用户',
				'add' : '添加用户',
				'edit' : '修改用户',
			}
			uni.setNavigationBarTitle({
				title: titleList[type]
			})
			this.getUserData(option?.id)
			this.isView = type === 'view' ? true : false
			
		//页面初次渲染完成
			console.log('页面初次渲染完成',this.form.userId); //打印出上个页面传递的参数。
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
	.example {
		padding: 15px;
	}
	.form_sub_button uni-button{
		font-size: 15px;
	}
</style>
