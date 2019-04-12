<template>
	<view class="page">
		<swiper class="swiper" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="swiper.interval"
		 :duration="swiper.duration" :circular="swiper.circular" :indicator-color="swiper.indicatorColor"
		 :indicator-active-color="swiper.indicatorActiveColor">
			<swiper-item v-for="(item,index) in swiper.item" :key="index">
				<image :src="item.url"></image>
			</swiper-item>
		</swiper>
		<view class="divider"><text>推荐门票</text></view>
		<view class="grid">
			<view class="grid-item" v-for="(item,index) in grid.data" :key="index" @tap="click(item)">
				<image :src="item.thumb" v-if="item.thumb"></image>
				<image src="../../static/assets/emptyImg.gif" v-if="!item.thumb"></image>
				<view class="content">
					<view class="tit">{{item.name}}</view>
					<view class="footer">
						<text class="price">￥{{item.todayPrice}}</text>
						<text class="sales">已售:{{item.sales}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="divider"><text>热门门票</text></view>
		<view class="list">
			<view class="list-item" v-for="(item,index) in list.data" :key="index" @tap="click(item)">
				<image :src="item.thumb" v-if="item.thumb"></image>
				<image src="../../static/assets/emptyImg.gif" v-if="!item.thumb"></image>
				<view class="content">
					<view class="tit">{{item.name}}</view>
					<view class="footer">
						<text class="price">￥{{item.todayPrice}}</text>
						<text class="sales">已售:{{item.sales}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				swiper: {
					indicatorDots: true,
					autoplay: true,
					interval: 3000,
					duration: 1500,
					circular: true,
					indicatorColor: 'rgba(255,255,255,.5)',
					indicatorActiveColor: 'rgba(255,255,255,1)',
					item: [{
							url: 'http://www.zgyythy.com/upload/20170413/201704131709511718.jpg',
						},
						{
							url: 'http://www.sunlue.com/templates/main/images/banner2.jpg',
						},
						{
							url: 'http://www.sunlue.com/templates/main/images/banner3.jpg',
						},
						{
							url: 'http://www.sunlue.com/templates/main/images/banner1.jpg',
						},
					]
				},
				grid: {
					data: []
				},
				list: {
					data: []
				}
			}
		},
		onLoad() {
			this.api.request({
				url: 'getTicket',
				data: {
					'hot': 'true'
				},
				success: (result) => {
					this.list.data = result;
				}
			})
			this.api.request({
				url: 'getTicket',
				data: {
					'recom': 'true'
				},
				success: (result) => {
					this.grid.data = result;
				}
			})
		},
		mounted() {},
		methods: {
			click: function(item) {
				uni.navigateTo({
					url: '/pages/catagory/goods?ids=' + item.id
				});
			},
		}
	}
</script>

<style>
	.swiper,
	.swiper image {
		width: 100%;
		height: 360upx;
	}

	.divider {
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: 600;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.divider:before,
	.divider:after {
		height: 4upx;
		background: #000000;
		width: 30px;
		margin: 0 10px;
		content: '';
		display: block;
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		background: #f8f8f9;
		padding: 5px;
	}

	.grid-item {
		width: calc(50vw - 15px);
		margin: 5px;
		background: white;
	}

	.grid-item image {
		width: 100%;
		height: calc((50vw - 15px) / 3 * 2);
	}

	.grid-item .content {
		box-sizing: border-box;
		padding: 5px;
	}

	.grid-item .content view {
		margin-bottom: 20upx;
	}

	.grid-item .content view:last-child {
		margin-bottom: 0upx;
	}

	.grid-item .content .tit {
		font-size: 32upx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.grid-item .footer {
		display: flex;
		font-size: 24upx;
		justify-content: space-between;
		padding: 0px 5px;
	}

	.grid-item .footer text.price {
		color: #FD2E32;
		font-weight: 600;
	}

	.list {
		background: #f8f8f9;
		padding: 5px;
	}

	.list-item {
		background: white;
		margin: 5px 5px 10px 5px;
		border-radius: 10px;
	}

	.list-item:after {
		content: '';
		clear: both;
		display: block;
	}

	.list-item image {
		width: 240upx;
		height: 160upx;
		border-radius: 10px;
		float: left;
	}

	.list-item .content {
		margin-left: 260upx;
		padding: 5px;
	}

	.list-item .content .footer {
		display: flex;
		justify-content: space-between;
	}

	.list-item .content .tit {
		font-size: 32upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.list-item .footer {
		display: flex;
		font-size: 24upx;
		justify-content: space-between;
		margin-top: 20upx;
	}

	.list-item .footer text.price {
		color: #FD2E32;
		font-weight: 600;
	}
</style>
