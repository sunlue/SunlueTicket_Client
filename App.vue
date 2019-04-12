<script>
	export default {
		onLaunch: function(option) {
			this.api.asseccToken(true);
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@font-face {
		font-family: 'iconfont';
		/* project id 1122487 */
		src: url('//at.alicdn.com/t/font_1122487_9cet7bbt1x.eot');
		src: url('//at.alicdn.com/t/font_1122487_9cet7bbt1x.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1122487_9cet7bbt1x.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1122487_9cet7bbt1x.woff') format('woff'),
			url('//at.alicdn.com/t/font_1122487_9cet7bbt1x.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1122487_9cet7bbt1x.svg#iconfont') format('svg');
	}
</style>
