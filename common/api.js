import url from '@/common/url.js'
let request = function(param, method) {
	asseccToken(function(asseccToken) {
		if (param.loading != 'none') {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
		}
		uni.request({
			url: url[param.url],
			method: method ? method : 'post',
			data: param.data ? param.data : {},
			header: {
				'auth-token': asseccToken,
				'content-type': 'application/json'
			},
			success: (result) => {
				if (result.data.code == 0) {
					typeof param.success == 'function' ? param.success(result.data.data) : '';
				} else {
					typeof param.error == 'function' ? param.error() : '';
					uni.showModal({
						title: '提示',
						content: result.data.info ? result.data.info : '请求数据错误',
						showCancel: false,
					});
				}
			},
			fail: (res) => {
				uni.showModal({
					title: '提示',
					content: '网络异常',
					showCancel: false,
				});
			},
			complete() {
				uni.hideLoading();
			}
		})
	})
}

const asseccToken = function(callback) {
	let token = uni.getStorageSync('token');
	let currDateTime = new Date().getTime();
	if (token == '' || currDateTime > token.timeStamp + 7000000 || callback===true) {
		uni.request({
			url: url['accessToken'],
			method: 'POST',
			header: {
				'content-type': 'application/json',
				'api-key': 'acsachusahcuia'
			},
			success: (result) => {
				try {
					result.data.data['timeStamp'] = new Date().getTime();
					uni.setStorageSync('token', result.data.data);
					typeof callback == 'function' ? callback(result.data.data.access_token) : '';
					return result.data.data.access_token;
				} catch (e) {
					console.log(e)
					uni.showModal({
						title: '提示',
						content: '授权异常',
						showCancel: false,
					});
				}
			}
		})
	} else {
		typeof callback == 'function' ? callback(token.access_token) : ''
		return token.access_token;
	}
}

module.exports = {
	asseccToken: asseccToken,
	request: request
}
