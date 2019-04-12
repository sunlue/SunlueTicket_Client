<template>
	<view>
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice}}</view></view>
				<view class="btn" @tap="toPay">提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {uniNumberBox} from '@dcloudio/uni-ui'
	export default {
		components:{
			uniNumberBox,
		},
		data() {
			return {
				buylist:[],
				
				form:{
					contact:'',
					mobile:'',
					card_number:'',
					note:''
				},
				
				goodsPrice:0.0,	//商品合计价格
				sumPrice:0.0,	//用户付款价格
				freight:12.00,	//运费
				note:'',		//备注
				int:1200,		//抵扣积分
				deduction:0		//抵扣价格
			};
		},
		onLoad(params) {
			this.buylist=JSON.parse(params.params)
		},
		methods: {
			numberBox(index,value){
				this.buylist[index].number=value;
			},
			toPay(){
				//商品列表
				let goodsid=[];
				let len = this.buylist.length;
				for(let i=0;i<len;i++){
					goodsid.push(this.buylist[i].id);
				}
			}
		}
	}
</script>

<style lang="scss">
</style>
