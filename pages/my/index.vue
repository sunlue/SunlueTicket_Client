<template>
	<view class="center">

		<!-- #ifdef MP-WEIXIN -->
		<view class="logo" :hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" :src="login ? userInfo.avatarUrl :defaultPhoto"></image>
			<view class="logo-title">
				<text class="uesr-name">Hi，{{login ? userInfo.nickName : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-ALIPAY -->
		<view class="logo" :hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" :src="login ? userInfo.avatar :defaultPhoto"></image>
			<view class="logo-title">
				<text class="uesr-name">Hi，{{login ? userInfo.nickName : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifdef H5 -->
		<view class="logo" :hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" :src="login ? (userInfo.headimgurl?userInfo.headimgurl:defaultPhoto) :defaultPhoto" v-if="MicroMessenger"></image>
			<image class="logo-img" :src="login ? (userInfo.avatarUrl?userInfo.avatarUrl:defaultPhoto) :defaultPhoto" v-if="!MicroMessenger"></image>
			<view class="logo-title">
				<text class="uesr-name" v-if="!MicroMessenger">Hi，{{login ? (userInfo.alias?userInfo.alias:userInfo.account) : '您未登录'}}</text>
				<text class="uesr-name" v-if="MicroMessenger">Hi，{{login ? userInfo.nickname : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
			</view>
		</view>
		<!-- #endif -->

		<view class="ticket">
			<view class="all" @tap="navigate('ticket')">
				<text class="icon">&#xe659;</text>
				<text class="text">全部票务</text>
			</view>
			<view class="has_use" @tap="navigate('ticket',{category:'yes'})">
				<text class="icon">&#xe671;</text>
				<text class="text">已使用</text>
			</view>
			<view class="not_use" @tap="navigate('ticket',{category:'no'})">
				<text class="icon">&#xe670;</text>
				<text class="text">未使用</text>
			</view>
		</view>

		<view class="center-list">
			<view class="center-list-item">
				<text class="list-icon">&#xe80a;</text>
				<text class="list-text">账号管理</text>
				<text class="navigat-arrow">&#xe699;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="navigate('feedback')">
				<text class="list-icon">&#xe7ff;</text>
				<text class="list-text">帮助与反馈</text>
				<text class="navigat-arrow">&#xe699;</text>
			</view>
			<view class="center-list-item" @click="navigate('terms')">
				<text class="list-icon">&#xe603;</text>
				<text class="list-text">服务条款及隐私</text>
				<text class="navigat-arrow">&#xe699;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item" @click="modal('contact')">
				<text class="list-icon">&#xe638;</text>
				<text class="list-text">联系客服</text>
				<text class="navigat-arrow">&#xe699;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item" @click="modal('about')">
				<text class="list-icon">&#xe608;</text>
				<text class="list-text">关于应用</text>
				<text class="navigat-arrow">&#xe699;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				login: false,
				defaultPhoto: '../../static/assets/defaultPhoto.png',
				userInfo: {},
				MicroMessenger: false
			}
		},
		onLoad(params) {
			let ua = navigator.userAgent.toLowerCase();
			this.MicroMessenger = ua.indexOf('micromessenger') != -1;
			var that = this;
			if (params.token != undefined && this.MicroMessenger) {
				this.api.request({
					url: 'memberLogin',
					data: {
						login_type: 'mp_weixin',
						token: params.token
					},
					success(result) {
						uni.setStorageSync('isLogin', true)
						uni.setStorageSync('userInfo', result.userInfo)
						that.login = true
						that.userInfo = result.userInfo;
					}
				})
			} else {
				util.checkLogin(function(result) {
					if (result.code == 'success') {
						uni.getStorage({
							key: 'userInfo',
							success(userInfo) {
								if (userInfo.data) {
									that.login = true
									that.userInfo = userInfo.data;
								}
							}
						})
					}
				})
			}
		},
		methods: {
			navigate: function(url,params) {
				if(params){
					let param=new Array();
					for(let i in params){
						param.push((i+'='+params[i]));
					}
					url+='?'+(param.join("&"));
				}
				uni.navigateTo({
					url: url
				})
			},
			modal: function(t) {
				switch (t) {
					case 'contact':
						uni.makePhoneCall({
							phoneNumber: '114'
						})
						break;
					case 'about':
						uni, uni.showModal({
							title: '关于',
							content: '上略互动票务系统V1.0.1',
							showCancel: false,
						});
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #f8f8f8;
	}

	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: #e4392a;
		flex-direction: row;
		align-items: center;
		display: flex;

		.logo-hover {
			opacity: 0.8;
		}

		.logo-img {
			width: 150upx;
			height: 150upx;
			border-radius: 150upx;
		}

		.logo-title {
			height: 150upx;
			flex: 1;
			align-items: center;
			justify-content: space-between;
			flex-direction: row;
			margin-left: 20upx;
			display: flex;

			.uesr-name {
				height: 60upx;
				line-height: 60upx;
				font-size: 38upx;
				color: #FFFFFF;
			}

			.go-login.navigat-arrow {
				font-size: 38upx;
				color: #FFFFFF;
			}
		}
	}

	.ticket {
		display: flex;
		padding: 40upx;
		background: white;
		flex-direction: row;
		justify-content: space-between;
		text-align: center;

		&>view {
			text-align: center;
			width: calc(100vw / 3);
			display: flex;
			flex-direction: column;
			.icon {
				font-size: 88upx;
				text-align: center;
				font-family: iconfont;
			}
			.text{
				font-size: 32upx;
			}
			&.all{
				.icon{
					color: #19be6b;
				}
			}
			&.has_use{
				.icon{
					color: #ff9900;
				}
			}
			&.not_use{
				.icon{
					color: #2db7f5;
				}
			}
		}
	}

	.center-list {
		display: flex;
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 100vw;
		flex-direction: column;

		.center-list-item {
			display: flex;
			height: 90upx;
			width: 100vw;
			box-sizing: border-box;
			flex-direction: row;
			padding: 0upx 20upx;

			&.border-bottom {
				border-bottom-width: 1upx;
				border-color: #c8c7cc;
				border-bottom-style: solid;
			}

			.list-icon {
				width: 40upx;
				height: 90upx;
				line-height: 90upx;
				font-size: 34upx;
				color: #2F85FC;
				text-align: center;
				font-family: iconfont;
				margin-right: 20upx;
			}

			.list-text {
				height: 90upx;
				line-height: 90upx;
				font-size: 34upx;
				color: #555;
				flex: 1;
				text-align: left;
			}

			.navigat-arrow {
				height: 90upx;
				width: 40upx;
				line-height: 90upx;
				font-size: 34upx;
				color: #555;
				text-align: right;
				font-family: iconfont;
			}
		}
	}
</style>
