import url from '@/common/url.js'
import api from "@/common/api.js"

const goLogin = function() {
	// #ifdef MP
	uni.reLaunch({
		url: '/pages/login/index'
	})
	// #endif
	// #ifdef H5
	let ua = navigator.userAgent.toLowerCase();
	let isWeixin = ua.indexOf('micromessenger') != -1;
	if (isWeixin) {
		const callback_url = window.location.href;
		const oAuth_url = url.oAuth_url.mp_weixin;
		window.location.href = oAuth_url + encodeURIComponent(callback_url);
		return false;
	} else {
		uni.reLaunch({
			url: '/pages/login/mobile'
		})
	}
	// #endif
}

const checkLogin = function(callback) {
	uni.getStorage({
		key: 'isLogin',
		success(result) {
			typeof callback == 'function' ? callback({
				code: 'success'
			}) : '';
			if (!result || result.data == null) {
				goLogin();
			}
		},
		fail(error) {
			typeof callback == 'function' ? callback({
				code: 'error'
			}) : '';
			goLogin();
		}
	})
}

let payExec = {
	unifiedorder: function(data, callback) {
		if (data['trade_type'] == 'JSAPI') {
			uni.getStorage({
				key: 'userInfo',
				success: (userInfo) => {
					data['openid'] = userInfo['data']['openid'];
				},
				fail() {
					uni.showToast({
						title: '授权异常',
						icon: 'none'
					})
					return false;
				}
			})
		}
		api.request({
			url: 'weixinPay',
			data: data,
			success: (result) => {
				callback(result);
			}
		})
	},
	onBridgeReady: function() {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', {
				"appId": "wx2421b1c4370ec43b", //公众号名称，由商户传入     
				"timeStamp": "1395712654", //时间戳，自1970年以来的秒数     
				"nonceStr": "e61463f8efa94090b1f366cccfbbb444", //随机串     
				"package": "prepay_id=u802345jgfjsdfgsdg888",
				"signType": "MD5", //微信签名方式：     
				"paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
			},
			function(res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					// 使用以上方式判断前端返回,微信团队郑重提示：
					//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
				}
			});
	},
	weixin: function(data) {
		var that = this;
		this.unifiedorder(data, function(result) {
			let ua = navigator.userAgent.toLowerCase();
			let isWeixin = ua.indexOf('micromessenger') != -1;
			if (data.trade_type == 'MWEB' && isWeixin === false) {
				window.location.href = result.mweb_url
			} else if (data.trade_type == 'JSAPI') {
				// #ifdef MP-WEIXIN
				uni.requestPayment({
					provider: 'weixin',
					timeStamp: result.timeStamp,
					nonceStr: result.nonceStr,
					package: result.package,
					signType: result.signType,
					success() {

					}
				})
				// #endif
				// #ifdef H5
				if (isWeixin) {
					if (typeof WeixinJSBridge == "undefined") {
						if (document.addEventListener) {
							document.addEventListener('WeixinJSBridgeReady', that.onBridgeReady, false);
						} else if (document.attachEvent) {
							document.attachEvent('WeixinJSBridgeReady', that.onBridgeReady);
							document.attachEvent('onWeixinJSBridgeReady', that.onBridgeReady);
						}
					} else {
						that.onBridgeReady();
					}
				}
				// #endif
			}
		})
	}
}

const pay = function(order_sn) {
	let data = new Object;
	data['order_sn'] = order_sn;
	// #ifdef MP-WEIXIN
	data['trade_type'] = 'JSAPI';
	// #endif
	// #ifdef H5
	let ua = navigator.userAgent.toLowerCase();
	let isWEIXIN = ua.indexOf('micromessenger') != -1;
	if (isWEIXIN) {
		data['trade_type'] = 'JSAPI';
	} else {
		data['trade_type'] = 'MWEB';
	}
	payExec.weixin(data);
	// #endif
}

const userInfo = function(field) {
	let data = uni.getStorageSync('userInfo');
	if (field) {
		return data[field];
	}
	return data;
}

const date = {
	timeStamp: function(date) {
		return new Date(date).getTime();
	},
	//今日时间
	today: function(type) {
		let dateTime = new Date();
		let year = dateTime.getFullYear();
		let month = dateTime.getMonth() + 1;
		let day = dateTime.getDate();
		let date = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
		switch (type) {
			case 'timeStamp':
				return this.timeStamp(date);
				break;
			default:
				return date;
				break;
		}
	},
	//历史时间
	notToday: function(params) {
		let timeStamp = this.today('timeStamp');
		if (params.operation == '+') {
			timeStamp = this.today('timeStamp') + (60 * 60 * 24 * 1000 * parseInt(params.dayNumber));
		} else if (params.operation == '-') {
			timeStamp = this.today('timeStamp') - (60 * 60 * 24 * 1000 * parseInt(params.dayNumber));
		}
		let dateTime = new Date(timeStamp);
		let year = dateTime.getFullYear();
		let month = dateTime.getMonth() + 1;
		let day = dateTime.getDate();
		let date = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
		switch (params.type) {
			case 'timeStamp':
				return this.timeStamp(date);
				break;
			default:
				return date;
				break;
		}
	},
}


module.exports = {
	checkLogin,
	userInfo,
	date,
	pay
}
