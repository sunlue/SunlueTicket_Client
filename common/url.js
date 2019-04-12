const http = 'http://ticket.sunlue.cn/'
// const http = 'http://39.98.173.170:9000/'
const apiUrl = http + 'api/'
const url = {
	'oAuth_url': {
		'mp_weixin': http + 'oauth/weixin/init?callback='
	},
	'memberLogin': apiUrl + 'member/login',
	'memberReg': apiUrl + 'member/reg',
	'userLogin': apiUrl + 'user/login',
	'accessToken': apiUrl + 'access_token',
	'getTicket': apiUrl + 'ticket/list/all',
	'getTicketTypeTicket': apiUrl + 'ticket/setting/type/ticket',
	'getTicketDetails': apiUrl + 'ticket/list/details',
	'getTicketPrice': apiUrl + 'ticket/price/get',
	'getTicketOrder': apiUrl + 'order/get',
	'createTicketOrder': apiUrl + 'order/set',
	'cancelTicketOrder': apiUrl + 'order/cancel',
	'removeTicketOrder': apiUrl + 'order/remove',
	'detailTicketOrder': apiUrl + 'order/detail',
	'removeTicket': apiUrl + 'order/ticket/remove',
	'weixinPay': apiUrl + 'pay/weixin',
	'getMemberTicket': apiUrl + 'ticket/member',
	'refundTicket': apiUrl + 'ticket/refund'
};
export default url
