import axios from "axios"
export default{
	name:"cart",
	data(){
		return {
			showflag:false,
			product:[
			
			],
			//总重量
			weight:0,
			//总价格
			price:0,
			//总产品件数
			number:0,
			//每一个产品的数量
			numbers:1
		}
	},
	mounted(){
		var that = this;
		axios.get("/v3/cart/get?connect_id=5ktek9r6bj7joujqqsvhefd0n7&store_id_list=3&item_id=")
		.then((response)=>{
//			console.log(response);
			this.product = response.data.cart;
//			console.log(this.product);
			if(this.product.length == 0){
				this.showflag = true;
			}else{
				//计算总重,总价格,总产品件数
				var length = response.data.cart.products.length;
				for(var i = 0;i < length; i ++){
	//				console.log(response.data.cart.products[i].weight);
					this.weight += Number(response.data.cart.products[i].weight) * Number(response.data.cart.products[i].qty);
					this.price += Number(response.data.cart.products[i].price) * Number(response.data.cart.products[i].qty);
				}
				this.number = length;
			}
		}).catch(function(err){
			console.log(err);
		})
		this.$nextTick(()=>{
			//全选
			$(".checkAll").click(function(){
				if($(this).attr("checked") != "checked"){
					$(this).attr("checked","checked");
					$(this).parents(".closing").siblings("ul").children("li").children("input").attr("checked","checked");
				}else{
					$(this).removeAttr("checked");
					$(this).parents(".closing").siblings("ul").children("li").children("input").removeAttr("checked");
				}
			})
		})
		setTimeout(function(){
				//单选
				$(".option").each(function(index,value){
					$(this).click(function(){
						if($(this).attr("checked") != "checked"){
							$(this).attr("checked","checked");
							$(".option").each(function(index,value){
								if($(this).attr("checked")!= "checked"){
									$(this).parents("ul").siblings(".closing").children("p:eq(0)").children("input").removeAttr("checked");
								}else{
									$(this).parents("ul").siblings(".closing").children("p:eq(0)").children("input").attr("checked","checked");
								}
							})
							//总商品数移出该商品数
							var str = parseInt($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html());
							//剩余商品数
							var residue = str + parseInt($(this).siblings(".number").children("p").children("span").html())
							$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html(residue);
							//总重量移出数
							var weight = Number($(this).parents("li").siblings("p").children("span:eq(1)").children("span").html());
							//当前商品重量
							var weight_one = Number($(this).siblings(".product").children("p:eq(0)").children("span:eq(1)").html() * Number($(this).siblings(".number").children("p").children("span").html()));
							$(this).parents("li").siblings("p").children("span:eq(1)").children("span").html(weight + weight_one);
							//当前显示的总价格
							var money = Number($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html());
							//该商品的总价格
							var money_one = (Number($(this).siblings(".product").children("p:eq(1)").children("span:eq(1)").html()) * Number($(this).siblings(".number").children("p").children("span").html()));
							$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html(parseFloat(money + money_one).toFixed(2));
						}else{
							$(this).removeAttr("checked");
							$(this).parents("ul").siblings(".closing").children("p:eq(0)").children("input").removeAttr("checked");
							//总商品数移出该商品数
							var str = parseInt($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html());
							//剩余商品数
							var residue = str - parseInt($(this).siblings(".number").children("p").children("span").html())
							$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html(residue);
							//总重量移出数
							var weight = Number($(this).parents("li").siblings("p").children("span:eq(1)").children("span").html());
							//当前商品重量
							var weight_one = Number($(this).siblings(".product").children("p:eq(0)").children("span:eq(1)").html() * Number($(this).siblings(".number").children("p").children("span").html()));
							$(this).parents("li").siblings("p").children("span:eq(1)").children("span").html(weight - weight_one);
							//当前显示的总价格
							var money = Number($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html());
							//该商品的总价格
							var money_one = (Number($(this).siblings(".product").children("p:eq(1)").children("span:eq(1)").html()) * Number($(this).siblings(".number").children("p").children("span").html()));
							$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html(parseFloat(money - money_one).toFixed(2));
						}
					})
				})
				//更改数量
				//获得按钮
				$(".minus").each(function(index,value){
					$(this).click(function(){
						var that = this;
						var singleNum = Number($(this).siblings(".num").html());
						singleNum -= 1;
						$(this).siblings(".num").html(singleNum);
						if(singleNum <= 0){
							$(this).siblings(".num").html(1);
							var names = $(this).parents(".number").siblings(".product").children(".name").html();
							$("#hint .names").html(names);
							var index = $(this).parents(".lis").index() - 1;
							control(index);
							$("#tilt").css("display","block");
							$("#hint").css("display","flex");
						}
						//计算总重
						$(".totalWeight").html((parseFloat($(".totalWeight").html()) - parseFloat($(this).parents(".number").siblings(".product").children("p:eq(0)").children("span:eq(1)").html())).toFixed(2));
						//计算总数量
						var str = parseInt($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html());
						$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html(str - 1);
						//计算总价格
						var money = Number($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html());
						//每个商品的价格
						var unit = Number($(this).parents(".number").siblings(".product").children("p:eq(1)").children("span:eq(1)").html());
						$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html((money - unit).toFixed(2));
//						console.log(unit);
					})
				})
				$(".add").each(function(index,value){
					$(this).click(function(){
						var singleNum = Number($(this).siblings(".num").html());
						singleNum += 1;
						$(this).siblings(".num").html(singleNum);
						//计算总重
						$(".totalWeight").html((parseFloat($(".totalWeight").html()) + parseFloat($(this).parents(".number").siblings(".product").children("p:eq(0)").children("span:eq(1)").html())).toFixed(2));
						//计算总数量
						var str = parseInt($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html());
//						console.log(str);
						$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("a").children("span").html(str + 1);
						//计算总价格
						//计算总价格
						var money = Number($(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html());
						//每个商品的价格
						var unit = Number($(this).parents(".number").siblings(".product").children("p:eq(1)").children("span:eq(1)").html());
						$(this).parents("ul").siblings(".closing").children("p:eq(1)").children("span").children("span:eq(1)").html((money + unit).toFixed(2));
					})
				})
				//添加地址
				$(".addAress").click(function(){
					$("#tilt").fadeIn("2000","linear");
					$("#address").animate({top:"1.7rem"},300,"linear");
				})
				$(".clos").click(function(){
					$("#tilt").fadeOut("2000","linear");
					$("#address").animate({top:"5.69rem"},300,"linear");
				})
				$("#tilt").click(function(){
					$("#address").animate({top:"5.69rem"},300,"linear");
					$("#tilt").fadeOut("2000","linear");
				})
			},1000)
		
		function control(index){
			//取消
			$(".cls").click(function(){

				$("#tilt").css("display","none");
				$("#hint").css("display","none");
			})
			//确定
			$(".ok").click(function(){
				console.log($("ul li").eq(index));
				$("ul li").eq(index).remove();
				var dename = $(this).parent().siblings().children("span").html();
				$("#tilt").css("display","none");
				$("#hint").css("display","none");
			})
		}
	},
	
}