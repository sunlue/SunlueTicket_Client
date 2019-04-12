<template>
	<view>
		<view class="status" :style="{ opacity: afterHeaderOpacity }"></view>
		<view class="header">
			<!-- 头部-默认显示 -->
			<view class="before" :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
				<view class="back" @tap="back" v-if="showBack">
					<view class="icon xiangqian"></view>
				</view>
				<view class="middle"></view>
				<view class="icon-btn">
					<view class="icon tongzhi"></view>
					<view class="icon cart" @tap="joinCart"></view>
				</view>
			</view>
			<!-- 头部-滚动渐变显示 -->
			<view class="after" :style="{ opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex }">
				<view class="back" @tap="back" v-if="showBack">
					<view class="icon xiangqian"></view>
				</view>
				<view class="middle">
					<view v-for="(anchor,index) in anchorlist" :class="[selectAnchor==index ?'on':'']" :key="index" @tap="toAnchor(index)">{{anchor.name}}</view>
				</view>
				<view class="icon-btn">
					<view class="icon tongzhi"></view>
					<view class="icon cart"></view>
				</view>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box" v-if="false">
					<view class="icon fenxiang"></view>
					<view class="text">分享</view>
				</view>
				<view class="box" v-if="false">
					<view class="icon kefu"></view>
					<view class="text">客服</view>
				</view>
				<view class="box" @tap="keep">
					<view class="icon" :class="[isKeep?'shoucangsel':'shoucang']"></view>
					<view class="text">{{isKeep?'已':''}}收藏</view>
				</view>
			</view>
			<view class="btn">
				<view class="joinCart" @tap="joinCart" v-if="false">加入购物车</view>
				<view class="buy" @tap="buy">立即购买</view>
			</view>
		</view>
		<!-- 购买须知-模态层弹窗 -->
		<view class="popup service" :class="serviceClass" @touchmove.stop.prevent="discard" @tap="hideService">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="row" v-if="goodsDetails.know.book_text">
						<view class="title">预定时间</view>
						<view class="description">{{goodsDetails.know.book_text}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.aging_text">
						<view class="title">有效期</view>
						<view class="description">{{goodsDetails.know.aging_text}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.apply">
						<view class="title">适用条件</view>
						<view class="description">{{goodsDetails.know.apply}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.limit">
						<view class="title">限购政策</view>
						<view class="description">{{goodsDetails.know.limit}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.fee">
						<view class="title">费用包含</view>
						<view class="description">
							<rich-text :nodes="goodsDetails.know.fee"></rich-text>
						</view>
					</view>
					<view class="row" v-if="goodsDetails.know.use_method">
						<view class="title">使用方法</view>
						<view class="description">{{goodsDetails.know.use_method}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.start_time && goodsDetails.know.end_time">
						<view class="title">入园时间</view>
						<view class="description">{{goodsDetails.know.start_time}}-{{goodsDetails.know.end_time}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.address">
						<view class="title">取票地点</view>
						<view class="description">{{goodsDetails.know.address}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.details">
						<view class="title">补充说明</view>
						<view class="description">{{goodsDetails.know.details}}</view>
					</view>
					<view class="row" v-if="goodsDetails.know.invoice">
						<view class="title">退改规则</view>
						<view class="description">
							<rich-text :nodes="goodsDetails.know.refund"></rich-text>
						</view>
					</view>
					<view class="row" v-if="goodsDetails.know.invoice">
						<view class="title">发票说明</view>
						<view class="description">
							<rich-text :nodes="goodsDetails.know.invoice"></rich-text>
						</view>
					</view>
				</view>
				<view class="btn">
					<view class="button" @tap="hideService">完成</view>
				</view>
			</view>
		</view>
		
		<!-- 商品主图轮播 -->
		<view class="swiper-box" v-if="goodsDetails.thumb">
			<swiper circular="true" autoplay="true" @change="swiperChange" v-if="goodsDetails.thumb instanceof Array">
				<swiper-item v-for="(swiper,index) in goodsDetails.thumb" :key="index">
					<image :src="swiper.img" @tap="toSwiper(swiper)"></image>
				</swiper-item>
			</swiper>
			<image :src="goodsDetails.thumb" v-else=""></image>
		</view>
		<!-- 标题 价格 -->
		<view class="info-box goods-info">
			<view class="price">￥{{goodsDetails.todayPrice}}</view>
			<view class="title">
				{{goodsDetails.name}}
			</view>
		</view>
		<!-- 服务-规则选择 -->
		<view class="info-box spec">
			<view class="row" @tap="showService">
				<view class="text">购买须知</view>
				<view class="arrow">
					<view class="icon xiangyou"></view>
				</view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="info-box comments" id="comments" v-show="goodsDetails.comment">
			<view class="row" v-if="goodsDetails.comment">
				<view class="text">商品评价({{goodsDetails.comment.number}})</view>
				<view class="arrow">
					<view class="show" @tap="showComments(goodsDetails.id)">
						查看全部
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="comment" v-if="goodsDetails.comment">
				<view class="user-info">
					<view class="face">
						<image :src="goodsDetails.comment.userface"></image>
					</view>
					<view class="username">{{goodsDetails.comment.username}}</view>
				</view>
				<view class="content">
					{{goodsDetails.comment.content}}
				</view>
			</view>
		</view>
		<!-- 详情 -->
		<view class="description" v-if="goodsIntro">
			<view class="title">———— 商品详情 ————</view>
			<view class="content">
				<rich-text :nodes="goodsIntro"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	import util from "@/common/util.js"
	export default {
		data() {
			return {
				//控制渐变标题栏的参数
				beforeHeaderzIndex: 11, //层级
				afterHeaderzIndex: 10, //层级
				beforeHeaderOpacity: 1, //不透明度
				afterHeaderOpacity: 0, //不透明度
				//是否显示返回按钮
				// #ifndef MP
				showBack: true,
				// #endif
				//轮播主图数据
				swiperList: [],
				//轮播图下标
				currentSwiper: 0,
				anchorlist: [], //导航条锚点
				selectAnchor: 0, //选中锚点
				serviceClass: '', //服务弹窗css类，控制开关动画
				// 商品信息
				goodsDetails: {
					know: {
						book_type: '',
						aging_type: '',
					}
				},
				goodsIntro: '',
				isKeep: false, //收藏,
			};
		},
		onLoad(option) {
			if (option.token != undefined) {
				this.api.request({
					url: 'memberLogin',
					data: {
						login_type: 'mp_weixin',
						token: option.token
					},
					success(result) {
						uni.setStorageSync('isLogin', true)
						uni.setStorageSync('userInfo', result.userInfo)
					}
				})
			}
			// #ifdef MP
			//小程序隐藏返回按钮
			this.showBack = false;
			// #endif
			this.api.request({
				url: 'getTicketDetails',
				data: {
					uniqid: option.ids
				},
				success: (result) => {
					this.render(result);
				}
			})
		},
		onReady() {
			//计算锚点高度，页面数据是ajax加载时，请把此行放在数据渲染完成事件中执行以保证高度计算正确
			this.calcAnchor();
		},
		onPageScroll(e) {
			//锚点切换
			this.selectAnchor = e.scrollTop >= this.anchorlist[2].top ? 2 : e.scrollTop >= this.anchorlist[1].top ? 1 : 0;
			//导航栏渐变
			let tmpY = 375;
			e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
			this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
			this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
			//切换层级
			this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
			this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
		},
		methods: {
			render(data) {
				this.goodsDetails = data;
				this.goodsIntro = this.goodsDetails.intro;
				switch (data.know.book_type) {
					case 1:
						this.goodsDetails.know.book_text = '仅限当天预订';
						break;
					case 2:
						this.goodsDetails.know.book_text = '需提前' + this.goodsDetails.know.book_day + '天预订';
						break;
					case 3:
						this.goodsDetails.know.book_text = '可提前' + this.goodsDetails.know.book_day + '天预订';
						break;
					default:
						break;
				}

				switch (this.goodsDetails.know.aging_type) {
					case 1:
						this.goodsDetails.know.aging_text = '仅限当天使用';
						break;
					case 2:
						this.goodsDetails.know.aging_text = '可提前' + this.goodsDetails.know.aging_day + '天使用';
						break;
					case 3:
						this.goodsDetails.know.aging_text = '可延后' + this.goodsDetails.know.aging_day + '天使用';
						break;
					default:
						break;
				}
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			//收藏
			keep() {
				this.isKeep = this.isKeep ? false : true;
			},
			//立即购买
			buy() {
				util.checkLogin((result)=>{
					if(result.code=='success'){
						uni.reLaunch({
							url:'buy?ids='+this.goodsDetails.id
						})
					}
				})
			},
			//跳转评论列表
			showComments(goodsid) {

			},
			//跳转锚点
			toAnchor(index) {
				this.selectAnchor = index;
				uni.pageScrollTo({
					scrollTop: this.anchorlist[index].top,
					duration: 200
				});
			},
			//计算锚点高度
			calcAnchor() {
				this.anchorlist = [
					{name: '主图',top: 0},
					{name: '评价',top: 0},
					{name: '详情',top: 0}
				]
				let commentsView = uni.createSelectorQuery().select("#comments");
				commentsView.boundingClientRect((data) => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
					statusbarHeight = plus.navigator.getStatusbarHeight()
					// #endif
					let headerHeight = uni.upx2px(100);
					this.anchorlist[1].top = data.top - headerHeight - statusbarHeight;
					this.anchorlist[2].top = data.bottom - headerHeight - statusbarHeight;
				}).exec();
			},
			//返回上一页
			back() {
				uni.navigateBack();
			},
			//服务弹窗
			showService() {
				this.serviceClass = 'show';
			},
			//关闭服务弹窗
			hideService() {
				this.serviceClass = 'hide';
				setTimeout(() => {
					this.serviceClass = 'none';
				}, 250);
			},
			specCallback() {
				return;
			},
			discard() {
				//丢弃
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f8f8f8;
	}

	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.icon {
		font-family: 'HMfont-home' !important;
		font-size: 26upx;
		font-style: normal;

		&.fenxiang {
			&:before {
				content: '\e642';
			}
		}

		&.xiangqian {
			&:before {
				content: '\e634';
			}
		}

		&.xiangyou {
			&:before {
				content: '\e637';
			}
		}

		&.shoucangsel {
			&:before {
				content: '\e62c';
			}
		}

		&.shoucang {
			&:before {
				content: '\e62e';
			}
		}

		&.tongzhi {
			&:before {
				content: '\e729';
			}
		}

		&.kefu {
			&:before {
				content: '\e61e';
			}
		}

		&.cart {
			&:before {
				content: '\e614';
			}
		}

		&.jia {
			&:before {
				content: "\e641";
			}
		}

		&.jian {
			&:before {
				content: "\e643";
			}
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
		background-color: #f1f1f1;
	}

	.header {
		width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.before,
		.after {
			width: 92%;
			padding: 0 4%;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);
			/*  #endif  */

			.back {
				width: 120upx;
				height: 60upx;
				flex-shrink: 0;

				.icon {
					margin-left: -10%;
					width: 60upx;
					height: 60upx;
					display: flex;
					align-items: center;
					font-size: 42upx;
				}
			}

			.middle {
				width: 100%;
			}

			.icon-btn {
				width: 120upx;
				height: 60upx;
				flex-shrink: 0;
				display: flex;

				.icon {
					width: 60upx;
					height: 60upx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					font-size: 42upx;
				}
			}
		}

		.before {
			.back {
				.icon {
					color: #fff;
				}
			}

			.icon-btn {
				.icon {
					color: #fff;
				}
			}
		}

		.after {
			background-color: #f1f1f1;

			.back {
				.icon {
					color: #666;
				}
			}

			.icon-btn {
				.icon {
					color: #666;
				}
			}

			.middle {
				font-size: 32upx;
				height: 90upx;
				display: flex;
				justify-content: center;
				align-items: center;

				view {
					padding: 0 3%;
					margin: 0 3%;
					display: flex;
					justify-content: center;
					align-items: center;

					&.on {
						margin-bottom: -4upx;
						color: #f47952;
						border-bottom: solid 4upx #f47952;
					}
				}
			}
		}
	}

	.swiper-box {
		width: 100%;
		height: calc(100vw / 3 * 2);
		height: -webkit-calc(100vw / 3 * 2);
		height: -moz-calc(100vw / 3 * 2);

		swiper {
			width: 100%;
			height: calc(100vw / 3 * 2);
			height: -webkit-calc(100vw / 3 * 2);
			height: -moz-calc(100vw / 3 * 2);

			swiper-item {
				image {
					width: 100%;
					height: calc(100vw / 3 * 2);
					height: -webkit-calc(100vw / 3 * 2);
					height: -moz-calc(100vw / 3 * 2);
				}
			}
		}
		
		&>image{
			width: 100%;
			height: calc(100vw / 3 * 2);
			height: -webkit-calc(100vw / 3 * 2);
			height: -moz-calc(100vw / 3 * 2);
		}
	}

	.info-box {
		width: 92%;
		padding: 20upx 4%;
		background-color: #fff;
		margin-bottom: 20upx;
	}

	.goods-info {
		.price {
			font-size: 46upx;
			font-weight: 600;
			color: #f47925;
		}

		.title {
			font-size: 30upx;
		}
	}

	.spec {
		.row {
			width: 100%;
			display: flex;
			align-items: center;
			margin: 0 0;

			.text {
				font-size: 24upx;
				color: #a2a2a2;
				margin-right: 20upx;
			}

			.content {
				font-size: 28upx;
				display: flex;
				flex-wrap: wrap;

				.serviceitem {
					margin-right: 10upx;
				}
			}

			.arrow {
				position: absolute;
				right: 4%;

				.icon {
					color: #ccc;
				}
			}
		}
	}

	.comments {
		.row {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;
			margin: 0 0 30upx 0;

			.text {
				font-size: 30upx;
			}

			.arrow {
				font-size: 28upx;
				position: absolute;
				right: 4%;
				color: #17e6a1;

				.show {
					display: flex;
					align-items: center;

					.icon {
						color: #17e6a1;
					}
				}
			}
		}

		.comment {
			width: 100%;

			.user-info {
				width: 100%;
				height: 40upx;
				display: flex;
				align-items: center;

				.face {
					width: 40upx;
					height: 40upx;
					margin-right: 8upx;

					image {
						width: 40upx;
						height: 40upx;
						border-radius: 100%;
					}
				}

				.username {
					font-size: 24upx;
					color: #999;
				}
			}

			.content {
				margin-top: 10upx;
				font-size: 26upx;
			}
		}
	}

	.description {
		.title {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #999;
		}
	}

	.footer {
		position: fixed;
		bottom: 0upx;
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		border-top: solid 1upx #eee;
		background-color: #fff;
		z-index: 2;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.icons {
			display: flex;
			height: 80upx;
			margin-left: -4%;

			.box {
				width: 80upx;
				height: 80upx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;

				.icon {
					font-size: 40upx;
					color: #828282;
				}

				.text {
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 22upx;
					color: #666;
				}
			}
		}

		.btn {
			height: 80upx;
			border-radius: 40upx;
			overflow: hidden;
			display: flex;
			margin-right: -2%;

			.joinCart,
			.buy {
				height: 80upx;
				padding: 0 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				font-size: 28upx;
			}

			.joinCart {
				background-color: #f0b46c;
			}

			.buy {
				background-color: #f06c7a;
			}
		}
	}

	.popup {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		display: none;
		
		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 21;
			background-color: rgba(0, 0, 0, 0.6);
		}

		&.service {
			.layer {
				height: 80%;
				bottom: -80%;
			}
		}

		&.spec {
			.layer {
				height: calc(100vh - 44px);
				bottom: calc(-100vh + 44px);
			}
		}

		.layer {
			position: fixed;
			z-index: 22;
			width: 100%;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;

			.content {
				width: 100%;
			}

			.btn {
				width: 100%;
				height: 80upx;

				.button {
					width: 100%;
					height: 80upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f47952;
					font-size: 28upx;
				}
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(-100%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(-100%);
			}

			100% {
				transform: translateY(0);
			}
		}

		&.show {
			display: block;
			opacity: 1;

			.mask {
				animation: showPopup 0.25s linear both;
			}

			.layer {
				animation: showLayer 0.25s linear both;
			}
		}

		&.hide {
			display: block;

			.mask {
				animation: hidePopup 0.25s linear both;
			}

			.layer {
				animation: hideLayer 0.25s linear both;
			}
		}

		&.none {
			display: none;
		}

		&.service {
			.content {
				padding: 0% 4%;
				width: 100%;
				height: calc(100% - 80upx);
				overflow-y: auto;

				.row {
					margin: 28upx 0;
					position: relative;
					padding-left: 140upx;

					.title {
						font-size: 30upx;
						position: absolute;
						width: 130upx;
						left: 0px;
					}

					.description {
						font-size: 28upx;
						color: #999;
					}
				}
			}
		}
	}
</style>