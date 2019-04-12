<template>
	<view class="">
		<uni-collapse class="ticket-item" v-for="(ticket, index) in data" :key="index">
			<uni-collapse-item :title="ticket.ticket.name" animation="inner" :open="true">
				<view class="ticket-detail">
					<image v-if="ticket.ticket.thumb" :src="ticket.ticket.thumb"></image>
					<image v-if="!ticket.ticket.thumb" src="@/static/assets/emptyImg.gif"></image>
					<view class="detail">
						<view class="use-date">使用时间:{{ ticket.use_date }}</view>
						<view class="is-check">使用标记:{{ ticket.is_check == 'yes' ? '已使用' : '未使用' }}</view>
						<view>票务状态:{{ ticket.status }}</view>
					</view>
					<view class="action">
						<block v-if="ticket.state == 0">
							<button size="mini" type="primary">付款</button>
							<button size="mini" type="warn" @tap="toRemove(ticket, index)">删除</button>
						</block>
						<block v-if="ticket.state == 1">
							<button size="mini" type="primary" @tap="toUse(ticket, index)" v-if="isUse(ticket)">使用</button>
							<button size="mini" type="warn" @tap="toRefund(ticket, index)" v-if="isRefund(ticket)">退票</button>
						</block>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view class="useModal" v-if="useModal.show">
			<view class="mask" @tap="useModal.show = false"></view>
			<view class="qrcode">
				<image :src="useModal.qrcode" v-if="false"></image>
				<uni-qrcode
					ref="qrcode"
					:val="useModal.qrcode.val"
					:size="useModal.qrcode.size"
					:unit="useModal.qrcode.unit"
					:show="false"
					:background="useModal.qrcode.background"
					:foreground="useModal.qrcode.foreground"
					:pdground="useModal.qrcode.pdground"
					:icon="useModal.qrcode.icon"
					:iconSize="useModal.qrcode.iconsize"
					:onval="useModal.qrcode.onval"
					:loadMake="useModal.qrcode.loadMake"
					@result="qrcodeRes"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui';
import uniQrcode from '@/components/uni-qrcode/qrcode.vue';
import util from '@/common/util.js';
export default {
	components: {
		uniQrcode,
		uniCollapse,
		uniCollapseItem
	},
	data() {
		return {
			data: [],
			params: {
				member_id: util.userInfo('uniqid'),
				is_check: ''
			},
			useModal: {
				show: false,
				qrcode: {
					val: '', // 要生成的二维码值
					size: 160, // 二维码大小
					unit: 'upx', // 单位
					background: '#ffffff', // 背景色
					foreground: '#333333', // 前景色
					pdground: '#333333', // 角标色
					icon: '../../static/assets/favicon.ico', // 二维码图标
					iconsize: 16, // 二维码图标大小
					onval: true, // val值变化时自动重新生成二维码
					loadMake: true, // 组件加载完成后自动生成二维码
					src: '' // 二维码生成后的图片地址或base64
				}
			}
		};
	},
	onLoad(option) {
		if(option.category){
			this.params.is_check=option.category;
		}
		let that = this;
		this.getData();
		uni.getSystemInfo({
			success(sys) {
				that.useModal.qrcode.size = (sys.windowWidth / 100) * that.useModal.qrcode.size;
			}
		});
	},
	onNavigationBarSearchInputConfirmed(e) {
		this.params.composite = e.text;
	},
	onPullDownRefresh() {
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1500);
	},
	onReachBottom() {
		console.log('上拉加载');
	},
	methods: {
		getData() {
			let that = this;
			this.api.request({
				url: 'getMemberTicket',
				data: that.params,
				success(result) {
					that.data = result.data;
				}
			});
		},
		isUse(ticket) {
			if (ticket.state != 1) {
				return false;
			}
			let know = ticket.ticket.know;
			switch (know.aging_type) {
				case 1:
					if (util.date.today('timeStamp') == util.date.timeStamp(ticket.use_date)) {
						return true;
					} else {
						return false;
					}
					break;
				case 2:
					let startUseTime = util.date.notToday({
						operation: '-',
						dayNumber: know.aging_day,
						type: 'timeStamp'
					});
					if (util.date.today('timeStamp') >= startUseTime) {
						return true;
					} else {
						return false;
					}
					break;
				case 3:
					let endUseTime = util.date.notToday({
						operation: '+',
						dayNumber: know.aging_day,
						type: 'timeStamp'
					});
					if (util.date.today('timeStamp') <= endUseTime) {
						return true;
					} else {
						return false;
					}
					break;
				default:
					break;
			}
		},
		isRefund(ticket) {
			if (util.date.today('timeStamp') > util.date.timeStamp(ticket.use_date) || ticket.is_check == 'yes' || ticket.state != 1) {
				return false;
			} else {
				return true;
			}
		},
		toUse(ticket) {
			this.useModal.show = true;
			this.useModal.qrcode.val = JSON.stringify({
				order_body: ticket.uniqid,
				ticket_list: ticket.ticket.id
			});
		},
		toRefund(ticket, index) {
			let that = this;
			this.api.request({
				url: 'refundTicket',
				data: {
					uniqid: ticket.uniqid
				},
				success() {
					that.data[index].state = 3;
				}
			});
		},
		toRemove(ticket, index) {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '确认要删除该数据吗?',
				success(result) {
					if (result.confirm) {
						that.api.request({
							url: 'removeTicket',
							data: {
								uniqid: ticket.uniqid
							},
							success() {
								that.data.splice(index, 1);
							}
						});
					}
				}
			});
		},
		qrcodeRes(res) {
			this.useModal.qrcode.src = res;
		}
	}
};
</script>

<style lang="less">
page {
}

.ticket-item {
	margin: 20upx 0px;
	&:first-child {
		margin-top: 0px;
	}

	.ticket-detail {
		background: #f8f8f8;
		position: relative;
		padding: 20upx;
		height: calc(200upx / 3 * 2);
		image {
			width: 200upx;
			float: left;
			padding-right: 20upx;
			height: 100%;
		}
		.detail {
			padding-right: 140upx;
			& > view {
				height: calc(200upx / 3 * 2 / 3);
				line-height: calc(200upx / 3 * 2 / 3);
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		}
		.action {
			position: absolute;
			right: 20upx;
			top: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			button {
				& + button {
					margin-top: 10px;
				}
			}
		}
	}
}
.useModal {
	.qrcode {
		position: fixed;
		z-index: 1000;
		background: red;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 20upx;
		image {
			width: 80vw;
			height: 80vw;
		}
	}
	.mask {
		position: fixed;
		background: rgba(0, 0, 0, 0.5);
		width: 100vw;
		height: 100vh;
		left: 0%;
		top: 0%;
		z-index: 999;
	}
}
</style>
