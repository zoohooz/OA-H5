<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='80px' label-align='right'>
			<uni-forms-item label="角色名称" required name="roleName">
				<uni-easyinput v-model="form.roleName" placeholder="请输入角色名称" />
			</uni-forms-item>
			<uni-forms-item label="权限字符" required name="roleKey">
				<uni-easyinput v-model="form.roleKey" placeholder="请输入权限字符" />
			</uni-forms-item>
			<uni-forms-item label="角色顺序" required name="roleSort">
				<!-- <uni-easyinput type="number" v-model="form.roleSort"  /> -->
				<uni-number-box :min="0" v-model="form.roleSort"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="状态">
				<uni-data-checkbox v-model="form.status" :localdata="sys_normal_disable" />
			</uni-forms-item>
			<uni-forms-item label="菜单权限">
				<MenuSelect @confirm="confirm" :label="deptLabel"></MenuSelect>
			</uni-forms-item>
			<uni-forms-item label="备注" name="remark">
				<uni-easyinput  type="textarea" v-model="form.remark" placeholder="请输入内容" />
			</uni-forms-item>
			
		<!-- 	<uni-forms-item label="归属部门">
				<DeptSelect @confirm="confirm" :label="deptLabel"></DeptSelect>
			</uni-forms-item>
			
			<uni-forms-item label="岗位">
				<ld-select 
				  :multiple="true" :list="postOptions"
				  label-key="postName" value-key="postId"
				  placeholder="请选择"
				  clearable
				  v-model="form.postIds"
					@change="selectPostIds"
				  ></ld-select>
			</uni-forms-item> -->
	
			<!-- <uni-row class="demo-uni-row">
				<uni-col :span="12">
					<button @click="cancle">取消</button>
				</uni-col>
				<uni-col :span="12">
					<button @click="submitForm" type="primary">确定</button>
				</uni-col>
			</uni-row> -->
			
			<view class="form_sub_button">
				<button v-if="type !== 'add'" @click="handleDelete" type="warn">删除</button>
				<button v-if="type !== 'add'" class="uni-button line-blue" @click="handleDataScope(form)">数据权限</button>
				<button v-if="type !== 'add'" class="uni-button line-blue" @click="handleAuthUser(form)">分配用户</button>
				<button @click="submitForm" type="primary">提交</button>
			</view>
	
		</uni-forms>
		
		<DataPermissions ref="DataPermissionsRef" @submitForm="Sub"></DataPermissions>
	</view>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from "@/api/system/role";
	import MenuSelect from "@/components/MenuSelect/MenuSelect.vue"
	import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
	import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";
	import DataPermissions from '@/pages/system/role/DataPermissions.vue'
	export default {
		components: {
			MenuSelect,
			DataPermissions
		},
		data() {
			return {
				type: 'add',
				form: {},   
				menuExpand:false,
				menuNodeAll:false,
				deptExpand:true,
				deptNodeAll:false,
				// 单选数据源
				sys_normal_disable:[],
				
				// 校验规则
				rules: {},
				// 部门回显名称 暂时没有数回显选择
				deptLabel:''
			}
		},
		methods: {
			confirm({ids}){
				console.log('菜单树形选择',ids)
				this.form.menuIds = ids
			},
			getRole(roleId){
				 const roleMenu = this.getRoleMenuTreeselect(roleId);
				 getRole(roleId).then(response => {
					console.log('获取角色信息==》',response)
					console.log('roleMenu==》',roleMenu)
				  this.form = response.data;
					
				  roleMenu.then(res => {
						console.log('res==》',res)
						let checkedKeys = res.data.checkedKeys
						// checkedKeys.forEach((v) => {
				  //     this.$nextTick(()=>{
				  //       this.$refs.menu.setChecked(v, true ,false);
				  //     })
						// })
					});
					
				});
			},
			/** 根据角色ID查询菜单树结构 */
			getRoleMenuTreeselect(roleId) {
			  return roleMenuTreeselect(roleId).then(response => {
					console.log('查询菜单树结构==》',response)
			    this.menuOptions = response.data.menus;
			    return response;
			  });
			},
			
			/** 提交按钮 */
			submitForm() {
			  this.$refs["form"].validate(valid => {
			    if (!valid) {
			      if (this.form.roleId != undefined) {
			        // this.form.menuIds = this.getMenuAllCheckedKeys();
			        updateRole(this.form).then(response => {
			          this.$modal.msgSuccess("修改成功");
			          this.open = false;
			          this.cancle();
			        });
			      } else {
			        // this.form.menuIds = this.getMenuAllCheckedKeys();
			        addRole(this.form).then(response => {
			          this.$modal.msgSuccess("新增成功");
			          this.open = false;
			          this.cancle();
			        });
			      }
			    }
			  });
			},
			cancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			reset(){
				// if (this.$refs.menu != undefined) {
				//         this.$refs.menu.setCheckedKeys([]);
				//       }
				this.menuExpand = false,
				this.menuNodeAll = false,
				this.deptExpand = true,
				this.deptNodeAll = false,
				this.form = {
				  roleId: undefined,
				  roleName: undefined,
				  roleKey: undefined,
				  roleSort: 0,
				  status: "0",
				  menuIds: [],
				  deptIds: [],
				  menuCheckStrictly: true,
				  deptCheckStrictly: true,
				  remark: undefined
				};
			},
			/** 删除按钮操作 */
			handleDelete({roleId}) {
				this.$modal.confirm('是否确认删除用户编号为"' + roleId + '"的数据项？').then(function() {
					return delRole(roleId);
				}).then(() => {
					this.$modal.msgSuccess("删除成功");
					this.cancle();
				})
			},
			/** 分配用户操作 */
			handleAuthUser: function({roleId}) {
				this.$tab.navigateTo("/pages/system/role/authUser?id=" + roleId);
			},
			
			handleDataScope(row){
				const title = `分配数据权限`
				getRole(row.roleId).then(response => {
					this.$refs.DataPermissionsRef.init(false, title, row, response.data)
				});
			},
			Sub(form , row){
				if (form.roleId != undefined) {
				  dataScope(form).then(response => {
				    this.$modal.msgSuccess("修改成功");
				  });
				}
			},
		},
		mounted() {
		},
		async created() {
			this.sys_normal_disable = await this.$getDictsList("sys_normal_disable")
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
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
			this.isView = type === 'view' ? true : false
			
			if( type === 'edit' ){
				this.getRole(option.id)
				
			}else if( type === 'view' ){
				this.getRole(option.id)
			}
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			//页面显示再次执行
			// this.reset();
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
	.example {
		padding: 15px;
	}
	.form_sub_button uni-button{
		font-size: 15px;
	}
</style>