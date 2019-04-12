<template>
	<view class="page">
		<view class="basis">
			<view class="item">
				<view class="label">交易编号</view>
				<view class="content">{{order.trade_no}}</view>
			</view>
			<view class="item">
				<view class="label">订单编号</view>
				<view class="content">{{order.order_sn}}</view>
			</view>
			<view class="item">
				<view class="label">使用日期</view>
				<view class="content">{{order.date}}</view>
			</view>
			<view class="item">
				<view class="label">预订时间</view>
				<view class="content">{{order.add_time}}</view>
			</view>
			<view class="item">
				<view class="label">预订数量</view>
				<view class="content">{{order.count}}张/已使用{{order.check}}张</view>
			</view>
			<view class="item">
				<view class="label">订单总额</view>
				<view class="content money">{{pay_total}}</view>
			</view>
			<view class="item">
				<view class="label">订单状态</view>
				<view class="content">{{order.status}}</view>
			</view>
		</view>
		<view class="action">
			<button type="primary" plain="true" size="mini" @tap="payment" v-if="order.state==0">继续付款</button>
			<button type="warn" plain="true" size="mini" @tap="cancel" v-if="order.state!=4">取消订单</button>
			<button type="warn" plain="true" size="mini" @tap="remove">删除订单</button>
		</view>
		<view class="contact">
			<view class="tit">取票信息</view>
			<view class="item">
				<view class="label">联系人：</view>
				<view class="content">{{order.contact}}</view>
			</view>
			<view class="item">
				<view class="label">联系电话：</view>
				<view class="content">{{conversion(order.mobile,3,4)}}</view>
			</view>
			<view class="item" v-if="order.card_number">
				<view class="label">证件号：</view>
				<view class="content">{{conversion(order.card_number,6,4)}}</view>
			</view>
		</view>
		<view class="ticket">
			<view class="item" v-for="(ticket,index) in order.body" :key="index">
				<uni-swipe-action :options="options" @click="removeTicket(ticket,index,$event)">
					<text class="tit">{{ticket.name}}-{{index}}</text>
				</uni-swipe-action>
				<view class="list">
					<view class="label">使用日期：</view>
					<view class="content">{{ticket.use_date}}</view>
				</view>
				<view class="list">
					<view class="label">使用时间：</view>
					<view class="content">{{ticket.know.start_time}}-{{ticket.know.end_time}}</view>
				</view>
				<view class="list">
					<view class="label">使用地址：</view>
					<view class="content">{{ticket.know.address}}</view>
				</view>
				<view class="list">
					<view class="label">使用方法：</view>
					<view class="content">{{ticket.know.use_method}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniSwipeAction
	} from '@dcloudio/uni-ui'

	import util from '@/common/util.js'

	export default {
		components: {
			uniSwipeAction
		},
		data() {
			return {
				order: {
					body: []
				},
				pay_total: 0,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#e4392a'
					}
				}]
			}
		},
		watch: {
			'order.body': function() {
				this.priceTotal();
			}
		},
		onLoad(option) {
			let that = this;
			that.api.request({
				url: 'detailTicketOrder',
				data: {
					order_sn: option.ids
				},
				success(data) {
					that.order = data;
					that.priceTotal();
				}
			})
		},
		methods: {
			priceTotal() {
				let pay_money = 0;
				this.order.body.find((ticket) => {
					pay_money += ticket.price * 100
				})
				this.pay_total = (pay_money / 100).toFixed(2);
			},
			payment() {
				util.pay(this.order.order_sn)
			},
			cancel(ticket) {
				let that = this,
					order_sn = this.order.order_sn;
				uni.showModal({
					title: '提示',
					content: '确定要取消该订单吗?',
					success(result) {
						if (result.confirm) {
							that.api.request({
								url: 'cancelTicketOrder',
								data: {
									order_sn: order_sn
								},
								success(result) {
									that.order.state = 4;
									that.order.status = "已取消";
								}
							})
						}
					}
				})
			},
			remove() {
				let that = this,
					order_sn = this.order.order_sn;
				uni.showModal({
					title: '提示',
					content: '确定要删除该订单吗?',
					success(result) {
						if (result.confirm) {
							that.api.request({
								url: 'removeTicketOrder',
								data: {
									order_sn: order_sn
								},
								success(result) {
									uni.reLaunch({
										url: 'index'
									})
								}
							})
						}
					}
				})
			},
			removeTicket(ticket, index, obj) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除该票务吗?',
					success(result) {
						if (result.confirm) {
							if (that.order.body.length <= 1) {
								uni.showModal({
									title: '提示',
									content: '至少保留一条数据',
									showCancel: false,
								});
								return false;
							}
							that.api.request({
								url: 'removeTicket',
								data: {
									uniqid: ticket.uniqid
								},
								success(result) {
									that.order.body.splice(index, 1);
								}
							})
						}
					}
				})
			},
			conversion: (str, start, end) => {
				if (!str) {
					return false;
				}
				var len = str.length - start - end;
				var xing = '';
				for (var i = 0; i < len; i++) {
					xing += '*';
				}
				return str.substring(0, start) + xing + str.substring(str.length - end);
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #F8F8F8;
	}



	.basis {
		background: white;
		padding: 10upx 20upx;
		font-size: 24upx;

		.item {
			flex-direction: row;
			display: flex;
			padding: 10upx 0px;

			.label {
				padding-right: 40upx;
			}

			.content.money {
				color: rgb(228, 57, 42);
				font-weight: 600;
			}
		}
	}

	.action {
		background: white;
		padding: 20upx;
		text-align: right;

		button {
			margin-left: 20upx;
		}
	}

	.contact {
		margin-top: 20upx;
		background: white;
		padding: 20upx;

		.tit {
			font-size: 28upx;
			border-bottom: 2upx solid #e8eaec;
			padding: 10upx 0px;
		}

		.item {
			flex-direction: row;
			display: flex;
			padding: 10upx 0px;
			font-size: 24upx;

			.content.money {
				color: rgb(228, 57, 42);
				font-weight: 600;
			}
		}
	}

	.ticket {
		background: white;
		margin-top: 20upx;

		.item {
			padding: 0px 20upx;
			border-bottom: 8upx solid #e8eaec;

			&:last-child {
				border: none;
			}

			.tit {
				font-size: 28upx;
				border-bottom: 2upx dotted #e8eaec;
				display: block;
				padding: 10upx 0px;
			}

			.list {
				display: flex;
				font-size: 24upx;
				line-height: 60upx;
				font-weight: 400;
			}
		}
	}
</style>
