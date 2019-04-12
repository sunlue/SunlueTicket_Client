<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<view class="wrapper">
			<view class="welcome">欢迎回来！</view>
			<view class="left-top-sign">SunlueTICKET</view>
			<view class="input-content">
				<view class="input-item">
					<text :class="['tit',!account?'error':'']">账号</text>
					<input type="text" placeholder="请输入账号" data-key="account" @input="inputChange" />
				</view>
				<view class="input-item">
					<text :class="['tit',!password?'error':'']">密码</text>
					<input type="password" placeholder="请输入密码" data-key="password" @input="inputChange" />
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="forget-section">
				忘记密码?
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: '',
				password: '',
				logining: false
			}
		},
		onLoad() {

		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			toRegist() {
				uni.navigateTo({
					url:'reg'
				})
			},
			async toLogin() {
				if (this.mobile == '') {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
					return false;
				}
				if (this.password == '') {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return false;
				}
				var form = {
					login_type:'h5',
					account: this.account,
					password: this.password
				}
				this.api.request({
					url: 'memberLogin',
					data: form,
					success(result) {
						uni.setStorageSync('isLogin', true)
						uni.setStorage({
							key: 'userInfo',
							data: result.userInfo,
							success() {
								uni.reLaunch({
									url: '/pages/my/index'
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: #303133;
	}

	.left-top-sign {
		font-size: 100upx;
		color: #f8f8f8;
		position: relative;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #fa436a;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #fa436a;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		padding: 0px 66upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: #f8f6fc;
		height: 120upx;
		border-radius: 4px;
		margin-top: 50upx;

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: 26upx;
			color: #606266;

			&.error {
				color: red;

				&:before {
					content: '*';
					display: inline-block
				}
			}
		}

		input {
			height: 60upx;
			font-size: 30upx;
			color: #303133;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: #e4392a;
		color: #fff;
		font-size: 32upx;

	}

	.forget-section {
		font-size: 26upx;
		color: #4399fc;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 165px;
		width: 100%;
		font-size: 26upx;
		color: #606266;
		text-align: center;

		text {
			color: #4399fc;
			margin-left: 10upx;
		}
	}
</style>
