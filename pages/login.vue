<template>
	<view class="normal-login-container">
		<view class="logo-content align-center justify-center flex">
			<image style="width: 140rpx;height: 140rpx;display: flex;" :src="globalConfig.appInfo.logo" mode="widthFix">
			</image>
		</view>
		<text class="title"><b>管理系统</b></text>
		<view class="login-form-content">
			<view class="input-item flex align-center">
				<view class="iconfont icon-user icon"></view>
				<input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
			</view>
			<view class="input-item flex align-center" v-if="captchaEnabled">
				<view class="iconfont icon-validCode icon"></view>
				<input v-model="loginForm.code" type="number" class="input" placeholder="请输入验证码" maxlength="4" />
				<image :src="codeUrl" @click="getCode" class="login-code-img"></image>
			</view>
			<view class="action-btn">
				<button @click="handleLogin" style="background-color: #3296f8;color:white" class="login-btn cu-btn block lg round">登&nbsp;&nbsp;录</button>
			</view>
		</view>

		<view class="xieyi text-center">
			<text class="text-grey1">登录即代表同意</text>
			<text @click="handleUserAgrement" style="color:#0082fe">《用户协议》</text>
			<text @click="handlePrivacy" style="color:#0082fe">《隐私协议》</text>
		</view>
	</view>
</template>

<script>
	import {
		getCodeImg
	} from '@/api/login'

	export default {
		data() {
			return {
				codeUrl: "",
				captchaEnabled: true,
				globalConfig: getApp().globalData.config,
				loginForm: {
					username: "",
					password: "",
					code: "",
					uuid: ''
				}
			}
		},
		created() {
			this.getCode()
		},
		methods: {
			// 隐私协议
			handlePrivacy() {
				let site = this.globalConfig.appInfo.agreements[0]
				this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
			},
			// 用户协议
			handleUserAgrement() {
				let site = this.globalConfig.appInfo.agreements[1]
				this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
			},
			// 获取图形验证码
			getCode() {
				getCodeImg().then(res => {
					this.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled
					console.log('login--获取验验证码-res-->', res, '-', this.captchaEnabled)
					// this.codeUrl = 'data:image/gif;base64,' + res.data.img
					// this.loginForm.uuid = res.data.uuid
					if (this.captchaEnabled) {
						this.codeUrl = 'data:image/gif;base64,' + res.data.img
						this.loginForm.uuid = res.data.uuid
					}
				})
			},
			// 登录方法
			async handleLogin() {
				if (this.loginForm.username === "") {
					this.$modal.msgError("请输入您的账号")
				} else if (this.loginForm.password === "") {
					this.$modal.msgError("请输入您的密码")
				} else if (this.loginForm.code === "" && this.captchaEnabled) {
					this.$modal.msgError("请输入验证码")
				} else {
					this.$modal.loading("登录中，请耐心等待...")
					this.pwdLogin()
				}
			},
			// 密码登录
			async pwdLogin() {
				this.$store.dispatch('Login', this.loginForm).then(() => {
					console.log('密码登录res')
					this.$modal.closeLoading()
					this.loginSuccess()
				}).catch((e) => {
					this.$modal.closeLoading()
					this.$modal.msgError("密码错误，请重试，错误5次将锁定账户10分钟", e)
					console.log('密码登录err', e)
					if (this.captchaEnabled) {
						this.getCode()
					}
				})
			},
			// 登录成功后，处理函数
			loginSuccess(result) {
				// 设置用户信息
				console.log('设置用户信息-->', result)

				this.$store.dispatch('GetInfo').then(res => {
					console.log('设置用户信息-res->', /* res */ )
					// this.$Router.replaceAll('/pages/index')
					console.log('登陆完之后获取路由')

					this.$store.dispatch('GenerateRoutes')
					// 根据roles权限生成可访问的路由表
					//router.addRoutes(accessRoutes) // 动态添加可访问路由表
					// 获取个人站内信
					//store.dispatch('getMessage')
					//next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
					this.$tab.reLaunch('/pages/index')
					// this.$Router.replaceAll('/pages/index')
				})

			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.normal-login-container {
		width: 100%;

		.logo-content {
			font-size: 21px;
			padding-top: 15%;

			image {
				border-radius: 4px;
			}

		}

		.title {
			display: block;
			text-align: center;
			width: 100%;
			font-size: 21px;
			margin-top:10px
		}

		.login-form-content {
			text-align: center;
			margin: 20px auto;
			margin-top: 10%;
			width: 80%;

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}

			}

			.login-btn {
				margin-top: 40px;
				height: 45px;
			}

			.xieyi {
				color: #333;
				margin-top: 20px;
			}
		}

		.easyinput {
			width: 100%;
		}
	}

	.login-code-img {
		height: 45px;
	}
</style>
