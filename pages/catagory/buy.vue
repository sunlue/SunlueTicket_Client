<template>
	<view class="page">
		<view class="row">
			<view class="tit">
				{{goodsDetails.name}}
			</view>
			<view class="content use-date">
				<view class="label">
					使用日期
				</view>
				<view class="input">
					<view class="active">
						<text class="date">{{buyFrom.date}}</text>
						<text class="price">￥{{buyFrom.price}}</text>
					</view>
					<view class="more" @tap="onShowDatePicker()">
						<text>更多</text>
						<text>日期</text>
					</view>
				</view>
			</view>
		</view>

		<view class="row">
			<view class="tit">
				{{goodsDetails.name}}
			</view>
			<view class="content">
				<view class="label">购买须知</view>
				<view class="input">
					<uni-number-box :min="0" @change="numberChange"></uni-number-box>
				</view>
			</view>
		</view>
		<view class="row">
			<view class="tit">
				取票信息
			</view>
			<view class="content contact">
				<view class="item">
					<view class="label" required>中文姓名</view>
					<view class="input">
						<input type="text" placeholder="须与证件上的名字一致" :placeholder-style="input.error" v-model="buyFrom.contact" />
					</view>
				</view>
				<view class="item">
					<view class="label" required>联系手机</view>
					<view class="input">
						<input type="number" placeholder="接收确认短信" :placeholder-style="input.error" v-model="buyFrom.mobile" />
					</view>
				</view>
				<view class="item">
					<view class="label">身份证</view>
					<view class="input">
						<input type="idcard" placeholder="请填写证件号码" v-model="buyFrom.card_number" />
					</view>
				</view>
			</view>
		</view>

		<uni-date-picker :show="showPicker" :type="type" :minDate="limit.start" :maxDate="limit.end" :value="buyFrom.date"
		 @confirm="onSelected" @cancel="onSelected" />

		<view class="footer">
			<view class="sum">总额：￥<text class="price">
					{{(buyFrom.price*100*buyFrom.number/100).toFixed(2)}}
				</text>
			</view>
			<view class="right">
				<view class="detail" v-if="false">明细</view>
				<view class="chat">
					<uni-icon type="phone"></uni-icon>
				</view>
				<view class="pay" @tap="toPay">去支付</view>
			</view>
		</view>
		<view class="mask" v-if="showPicker"></view>
	</view>
</template>

<script>
	import {
		uniNumberBox,
		uniIcon
	} from '@dcloudio/uni-ui'
	import uniDatePicker from '@/components/uni-datepicker/uni-datepicker.vue'
	import util from '@/common/util.js'

	const currDate = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();
	export default {
		components: {
			uniIcon,
			uniNumberBox,
			uniDatePicker
		},
		data() {
			return {
				showPicker: false,
				type: 'date',
				goodsDetails: [],
				buyFrom: {
					date: currDate,
					number: 1,
					price: '0.00',
					contact: '',
					mobile: '',
					card_number: ''
				},
				limit: {
					start: '',
					end: ''
				},
				input:{
					error:'color:red;'
				}
			}
		},
		onLoad(option) {
			this.api.request({
				url: 'getTicketDetails',
				data: {
					uniqid: option.ids
				},
				success: (result) => {
					this.goodsDetails = result;
					this.buyFrom.price = result.todayPrice;
					var date = new Date().getTime() + (result.know.book_day * 3600 * 24 * 1000);
					switch (result.know.book_type) {
						case 1:
							this.limit.start = currDate;
							this.limit.end = currDate;
							break;
						case 2:
							let startDate = new Date(date).getFullYear() + '/' +
								(new Date(date).getMonth() + 1) + '/' +
								new Date(date).getDate();
							this.limit.start = startDate;
							break;
						case 3:
							let endDate = new Date(date).getFullYear() + '/' +
								(new Date(date).getMonth() + 1) + '/' +
								new Date(date).getDate();
							this.limit.end = endDate;
							break;
						default:
							break;
					}
					this.buyFrom.date = this.limit.start;
					this.getPrice()
				}
			})
		},
		methods: {
			numberChange(value) {
				this.buyFrom.number = value;
			},
			getPrice() {
				this.api.request({
					url: 'getTicketPrice',
					data: {
						ticket: this.goodsDetails.id,
						start: this.buyFrom.date,
						end: this.buyFrom.date
					},
					success: (result) => {
						if (result.length > 0) {
							let price = result[0]['cost'] * 100 + result[0]['profit'] * 100;
							this.buyFrom.price = (price / 100).toFixed(2);
						} else {
							this.buyFrom.price = this.goodsDetails.present;
						}
					}
				})
			},
			onShowDatePicker(type) { //显示
				this.showPicker = true;
			},
			onSelected(e) { //选择
				this.showPicker = false;
				if (e) {
					this.buyFrom.date = e.value;
					this.getPrice();
				}
			},
			toPay() {
				let timeStamp = new Date(this.buyFrom.date).getTime();
				let dateTime = new Date(timeStamp);
				let order = {
					member_id:util.userInfo('uniqid'),
					date: dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getDate(),
					contact: this.buyFrom.contact,
					mobile: this.buyFrom.mobile,
					card_number: this.buyFrom.card_number,
					ticket: [{
						ticket_id: this.goodsDetails.id,
						number: this.buyFrom.number,
					}]
				}
				this.api.request({
					url: 'createTicketOrder',
					data: order,
					success: (result) => {
						util.pay(result.order_sn);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #cccccc;
	}

	.page {
		padding: 20upx;
		height: 100%;

		.row {
			background: white;
			border-radius: 10upx;
			margin-bottom: 20upx;

			.tit {
				background: #f8f8f8;
				border-top-left-radius: 10upx;
				border-top-right-radius: 10upx;
				font-size: 32upx;
				font-weight: 500;
				padding: 10upx;
			}

			.content {
				padding: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.label {
					font-size: 32upx;
					text-align: right;
					padding-right: 20upx;
					&[required]:before{
						content: '*';
						display: inline;
						color: red;
						padding-right: 16upx;
					}
				}

				&.use-date {
					.input {
						display: flex;
						justify-content: flex-end;
						font-size: 24upx;
						flex: 1;

						&>view {
							border: 1px solid #cccccc;
							margin: 4upx;
							border-radius: 10upx;
							padding: 10upx;

							&.more {
								min-width: 80upx;
							}

							&.active {
								border: 1px solid #009688;
							}

							text {
								display: block;
								text-align: center;

								&.date {
									color: #009688;
								}

								&.price {
									color: #e4392a;
								}
							}
						}
					}
				}

				&.contact {
					display: block;
					padding: 0px 20upx;

					.item {
						position: relative;
						border-bottom: 1px solid #cccccc;
						padding: 20upx 0px;

						&:last-child {
							border: none;
						}

						.label,
						.input {
							height: 60upx;
							line-height: 60upx;
						}

						.label {
							float: left;
							width: 160upx;
							font-size: 28upx;
							font-weight: 400;
						}

						.input {
							font-size: 24upx;
							input{
								height: 60upx;
								line-height: 60upx;
								&+div{
									color: red;
								}
							}
							.input-placeholder{
								color: red;
							}
						}
					}
				}
			}
		}

		.footer {
			position: fixed;
			width: 100%;
			background: white;
			left: 0px;
			bottom: 0px;
			height: 80upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.sum {
				color: #e4392a;
				padding-left: 20upx;
				font-size: 28upx;

				.price {
					font-size: 40upx;
					font-weight: 600;
				}
			}

			.right {
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.detail {
					font-size: 24upx;
					color: #2db7f5;
				}

				.chat {
					padding: 0px 10px;
				}

				.pay {
					background: #e4392a;
					height: 80upx;
					line-height: 80upx;
					color: white;
					font-size: 32upx;
					letter-spacing: 4upx;
					padding: 0px 40upx;
				}
			}
		}

		.mask {
			position: fixed;
			background: rgba($color: #000000, $alpha: .5);
			width: 100%;
			height: 100%;
			left: 0px;
			top: 0px;
			z-index: 1;
		}

	}
</style>
