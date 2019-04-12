<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab, index) in tabBars" :key="tab.id" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="tab.id"
			 :data-current="index" @click="tapTab(index)">{{tab.name}}</view>
		</scroll-view>
		<!-- #ifndef MP-BAIDU -->
		<scroll-view class="list" v-for="(tabItem, idx) in newsList" :key="idx" v-if="tabIndex === idx" scroll-y
		 @scrolltolower="loadMore(idx)">
			<block v-for="(newsItem, newsIndex) in tabItem.data" :key="newsIndex">
				<uni-media-list :options="newsItem" @orderClick="orderClick(newsItem)" @ticketClick="ticketClick"></uni-media-list>
			</block>
			<uni-load-more :status="tabItem.loading"></uni-load-more>
		</scroll-view>
		<!-- #endif -->
		<!-- #ifdef MP-BAIDU -->
		<view class="scroll-wrap" v-for="(tabItem, idx) in newsList" :key="idx">
			<scroll-view class="list" v-if="tabIndex === idx" scroll-y @scrolltolower="loadMore(idx)" :style="scrollViewHeight">
				<block v-for="(newsItem, newsIndex) in tabItem.data" :key="newsIndex">
					<uni-media-list :options="newsItem" @orderClick="orderClick(newsItem)" @ticketClick="ticketClick"></uni-media-list>
				</block>
				<view class="uni-tab-bar-loading">
					<view class="loading-more">{{loadingText}}</view>
				</view>
			</scroll-view>
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import uniMediaList from '@/components/uni-media-list/uni-media-list.vue';
	import {
		uniLoadMore
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniMediaList,
			uniLoadMore
		},
		data() {
			return {
				scrollLeft: 0,
				newsList: [],
				tabIndex: 0,
				tabBars: [{
					name: '全部',
					id: '',
				}, {
					name: '待支付',
					id: 0,
				}, {
					name: '已支付',
					id: 1,
				}, {
					name: '支付失败',
					id: 2,
				}, {
					name: '已确认',
					id: 3,
				}, {
					name: '已取消',
					id: 4,
				}, {
					name: '退款中',
					id: 5,
				}, {
					name: '已退款',
					id: 6,
				}, {
					name: '已完成',
					id: 7,
				}, {
					name: '已关闭',
					id: 8,
				}]
			}
		},
		computed: {
			scrollViewHeight() {
				return 'height:' + (uni.getSystemInfoSync().windowHeight) + 'px';
			}
		},
		onLoad: function() {
			// 初始化列表信息
			this.tabBars.forEach((tabBar) => {
				this.newsList.push({
					data: [],
					requestParams: {
						page: 1,
						limit: 10,
						state: tabBar.id
					},
					loading: 'more'
				});
			});
			this.getList();
		},
		onPullDownRefresh() {
			let activeTab = this.newsList[this.tabIndex];
			activeTab.requestParams.page = 1;
			activeTab.loading = 'loading';
			this.getList();
		},
		methods: {
			getList(action = 1) {
				let activeTab = this.newsList[this.tabIndex];
				this.loadingText = '加载中...';
				this.api.request({
					url: 'getTicketOrder',
					data: activeTab.requestParams,
					success: (result) => {
						if (result.data.length < 1) {
							activeTab.loading = 'noMore';
							uni.stopPullDownRefresh();
							return false;
						}
						if (action === 1) {
							activeTab.data = result.data;
							uni.stopPullDownRefresh();
						} else {
							result.data.forEach((order) => {
								activeTab.data.push(order);
							});
						}
					}
				})
			},
			ticketClick(detail) {
				uni.navigateTo({
					url: '/pages/catagory/goods?ids=' + detail.ticket_id
				});
			},
			orderClick(order) {
				uni.navigateTo({
					url:'detail?ids='+order.order_sn
				});
			},
			loadMore() {
				let activeTab = this.newsList[this.tabIndex];
				if (activeTab.loading != 'more') {
					return false;
				}
				activeTab.requestParams.page += 1;
				activeTab.loading = 'loading';
				this.getList(2);
			},
			async changeTab(event) {
				let index = event.detail.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize('tab-bar');
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].ref);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].ref),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index;

				// 首次切换后加载数据
				const activeTab = this.newsList[this.tabIndex];
				if (activeTab.data.length === 0) {
					this.getList();
				}
			},
			getNodeSize(node) {
				return new Promise((resolve, reject) => {
					dom.getComponentRect(node, (result) => {
						resolve(result.size);
					});
				});
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			async tapTab(index) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
					// 首次切换后加载数据
					const activeTab = this.newsList[this.tabIndex];
					if (activeTab.data.length === 0) {
						this.getList();
					}
				}
			}
		}
	}
</script>
<style>
	page {
		background-color: #F8F8F8;
		height: 100%;
		font-size: 11px;
		line-height: 1.8;
	}

	.uni-tab-bar {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	.uni-tab-bar .list {
		width: 750upx;
		height: calc(100% - 100upx);
		margin-top: 100upx;
	}

	.uni-swiper-tab {
		width: 100%;
		white-space: nowrap;
		line-height: 100upx;
		height: 100upx;
		border-bottom: 1px solid #c8c7cc;
		position: fixed;
		background: #FFFFFF;
		z-index: 996;
		top: var(--window-top);
		left: 0;
	}

	.swiper-tab-list {
		font-size: 30upx;
		width: 150upx;
		display: inline-block;
		text-align: center;
		color: #555;
	}

	.uni-tab-bar .active {
		color: #E4392A;
	}

	.uni-tab-bar .swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
		overflow: scroll;
	}

	.uni-tab-bar .uni-load-more {
		padding-bottom: 10upx;
	}
</style>
