<template>
	<view class="page">
		<!-- #ifdef MP-WEIXIN -->
		<view class="item weixin">
			<icon class="icon"></icon>
			<text class="text">微信登录</text>
			<uni-icon class="arrow" type="arrowright"></uni-icon>
			<button open-type="getUserInfo" class="userInfo" @getuserinfo="userInfo">获取用户信息</button>
		</view>
		<view class="item qq">
			<icon class="icon"></icon>
			<text class="text">QQ登录</text>
			<uni-icon class="arrow" type="arrowright"></uni-icon>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-ALIPAY -->
		<view class="item alipay" @tap="userInfo">
			<icon class="icon"></icon>
			<text class="text">支付宝登录</text>
			<uni-icon class="arrow" type="arrowright"></uni-icon>
		</view>
		<!-- #endif -->

		<view class="footer">

		</view>
	</view>
</template>

<script>
	import {
		uniIcon
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniIcon
		},
		data() {
			return {

			};
		},
		onLoad() {

		},
		methods: {
			userInfo: function(info) {
				var that=this;
				// #ifdef MP-WEIXIN
				that.setUserInfo(info.detail.userInfo)
				// #endif
				// #ifdef MP-ALIPAY
				my.getAuthCode({
					scopes: 'auth_user',
					success: (res) => {
						my.getAuthUserInfo({
							success: (userInfo) => {
								that.setUserInfo(userInfo);
							}
						});
					},
				});
				// #endif
			},
			setUserInfo:(data)=>{
				uni.setStorageSync('isLogin', true)
				uni.setStorage({
					key: 'userInfo',
					data: data,
					success() {
						uni.reLaunch({
							url: '/pages/my/index'
						})
					}
				})
			}
		}
	}
</script>

<style>
	.page {
		padding: 10px;
	}

	.item {
		background: #F8F8F8;
		line-height: 96upx;
		height: 96upx;
		position: relative;
		padding: 20upx 40upx 20upx 160upx;
		margin-bottom: 30upx;
	}

	.item .icon {
		position: absolute;
		left: 20upx;
		width: 96upx;
		height: 96upx;
	}

	.item.weixin .icon {
		background-image: url(../../static/assets/icon.png);
		background-position: -94upx 8upx;
		background-size: 960upx;
	}

	.item.weixin .userInfo {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0px;
		top: 0px;
		opacity: 0;
	}

	.item.qq .icon {
		background-image: url(../../static/assets/icon.png);
		background-position: 8upx 8upx;
		background-size: 960upx;
	}

	.item .arrow {
		position: absolute;
		right: 20upx;
		top: 50%;
		transform: translateY(-50%);
	}

	.item .text {
		font-size: 32upx;
	}
</style>
