<template>
	<view class="media-list">
		<view class="media-item">
			<view class="tit" @click="orderClick">{{options.order_sn}}</view>
			<view class="content">
				<view class="ticket" v-for="(ticket,index) in options.body" :key="index" @tap="ticketClick(ticket)">
					<image src="../../static/assets/emptyImg.gif" v-if="!ticket.ticket.thumb"></image>
					<image :src="ticket.ticket.thumb" v-if="ticket.ticket.thumb"></image>
					<view class="name">{{ticket.ticket.name}}</view>
					<view class="date">
						<text>{{ticket.use_date}}</text>
					</view>
					<view class="right">
						<text class="price">￥{{ticket.use_price}}</text>
						<text class="number">×1</text>
						<text class="status">{{ticket.status}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			options: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			orderClick() {
				this.$emit('orderClick');
			},
			ticketClick(ticket) {
				this.$emit('ticketClick', ticket)
			}
		}
	}
</script>

<style lang="less">
	.media-list {
		width: 100vw;
		padding-top: 10upx;

		.media-item {
			background: white;
			margin: 10upx 20upx;

			.tit {
				padding: 10upx 20upx;
				background: #e4392a;
				color: white;
				font-size: 28upx;
			}

			.content {
				padding: 20upx;

				.ticket {
					position: relative;

					&:after {
						content: '';
						width: 100%;
						margin: 20upx 0px;
						display: block;
						height: 2upx;
						background: #ccc;
					}

					&:last-child:after {
						display: none;
					}

					image {
						width: 200upx;
						height: calc(200upx / 3 * 2);
						float: left;
					}

					.right {
						position: absolute;
						text-align: right;
						right: 0px;
						top: 0px;

						text {
							display: flex;
							flex-direction: column;
							width: 120upx;
							height: 44upx;
							line-height: 44upx;

							&.price {
								color: #e4392a;
							}

							&.status {
								color: #2db7f5;
							}
						}
					}

					.name {
						margin-left: 220upx;
						margin-right: 120upx;
						height: 88upx;
						line-height: 44upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.date{
						margin-left: 220upx;
						margin-right: 120upx;
						height: 44upx;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}
				}

			}
		}
	}
</style>
