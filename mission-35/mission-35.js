	var doingFlag = false,	//动作执行标志
	      pos_x = 1,		//当前的横坐标
	      pos_y = 1,		//当前的纵坐标
	      dir = [0,90,180,270,360],	//方向列表
	      dir_now = 0;		//当前的方向下标

	//通过方向，计算运动后的位置
	function positionFoward(dirFoward){
		switch(dirFoward){
	 	case 0:
	 		if (pos_y === 1) {	//边界检测
	 			break;
	 		}else{
	 			pos_y--;
	 		}
	 		break;
	 	case 1:
	 		if (pos_x === 10) {	//边界检测
	 			break;
	 		}else{
	 			pos_x++;
	 		}
	 		break;
	 	case 2:
	 		if (pos_y === 10) {	//边界检测
	 			break;
	 		}else{
	 			pos_y++;
	 		}
	 		break;
	 	case 3:
	 		if (pos_x === 1) {	//边界检测
	 			break;
	 		}else{
	 			pos_x--;
	 		}
	 		break;
	 	}
	}

	//转向动画
	//输入为方向的下标
	function animateDir(now_dir,target_dir){
	 	var square = document.getElementById('square'),
	 	      speed,		//转向速度
	 	      clockwise,		//true顺时针旋转 false逆时针
	 	      timer,
	 	      degree ;		//旋转的角度

/*	 	square.style.transform = 'rotate(' + dir[now_dir] + 'deg)';
*/
	 	//当前方向与目标方向相同
	 	if(dir[target_dir] == dir[now_dir]){
	 		doingFlag = false;
	 		return;
	 	}else if( dir[now_dir] - dir[target_dir] > 0 && dir[now_dir] - dir[target_dir] < 270 ){
	 		//now > target 使用逆时针
	 		clockwise = false;
	 	}else if( dir[target_dir] - dir[now_dir] == 270){
	 		clockwise = false;
	 		now_dir = 4;
	 	}else if( dir[now_dir] - dir[target_dir] == 270){
	 		clockwise = true;
	 		target_dir = 4;
	 	}else{
	 		//now < target 使用顺时针
	 		clockwise = true;
	 	}
	 	//计算动画速度
	 	if((Math.abs(dir[target_dir] - dir[now_dir]))  == 90){
	 		speed = 2;	//2ms
	 	}else{
	 		speed = 1;	//1ms
	 	}
	 	degree = dir[now_dir];
	 	timer = setInterval(function(){
	 		if(clockwise){
	 			degree++;
	 		}else{
	 			degree--;
	 		}
	 		square.style.transform = 'rotate(' + degree + 'deg)';
	 		if(degree == dir[target_dir]){
	 			clearInterval(timer);
	 			doingFlag = false;
	 		}
	 	},speed);
	 	//更新当前方块的方向状态
	 	if(target_dir == 4){
	 		dir_now = 0;
	 	}else{
	 		dir_now = target_dir;
	 	}
	}

	//根据X,Y坐标,相对原位置移动
	function move(){
		var square = document.getElementById('square'),
		      now_top = parseInt(window.getComputedStyle(square, null).top),	//当前方块顶边距
		      now_left = parseInt(window.getComputedStyle(square, null).left),	//当前方块左边距
		      target_top = 60 + (pos_y - 1) * 61,					//移动后方块顶边距
		      target_left = 60 + (pos_x - 1) * 61,					//移动后方块左边距
		      distance,			//保存需要改变的值，top或者left
		      target_distance,
		      x_flag,			//布尔量　是否是ｘ方向的移动
		      timer;

		//判断需要改变的是左边距还是顶边距
		if(target_top == now_top && target_left == now_left){
			doingFlag = false;
			return;
		}else if(target_top == now_top){
			x_flag = true;
			distance = now_left;
			target_distance = target_left;
		}else{
			x_flag = false;
			distance = now_top;
			target_distance = target_top;
		}

		timer = setInterval(function(){
			if(x_flag){
				if(now_left > target_left){
					distance--;
				}else{
					distance++;
				}
				square.style.left = distance + 'px';
			}else{
				if(now_top > target_top){
					distance--;
				}else{
					distance++;
				}
				square.style.top = distance + 'px';
			}
			if(target_distance == distance){
				clearInterval(timer);
				doingFlag = false;
			}
		},1);
	}

	 //TUN LEF指令
	function turnLeft(){
		if(dir_now === 0){
			animateDir(0,3);
		}else{
			animateDir(dir_now,dir_now-1);
		}
	}

	//TUN RIG指令
	 function turnRight() {
	 	if(dir_now == 3){
	 		animateDir(3,0);
	 	}else{
	 		animateDir(dir_now,dir_now+1);
	 	}
	 }

	 //TUN BAC指令
	 function turnBack(){
	 	if(dir_now<2){
	 		animateDir(dir_now,dir_now+2);
	 	}else{
	 		animateDir(dir_now,dir_now-2);
	 	}
	 }

	(function(){
		var square = document.getElementById('square'),
		      do_btn = document.getElementById('do'),
		      refresh_btn = document.getElementById('refresh'),
		      text_input = document.getElementById('textarea'),
		      row_num = 1;	//textarea的内容行数

		//初始化
		refresh();

		//textarea键盘按键被按下事件
		text_input.addEventListener('keydown',function(){
			setTimeout(function(){
				var content = text_input.value,
				      nNum;
				//若未匹配到换行则正则匹配返回NULL，没有length属性
				//故先判断是否有换行
				if( content.match(/\n/g) ){
					nNum = content.match(/\n/g).length;
				}else{
					nNum = 0;
				}

				//行数为换行数+1
				//判断换行符的数目是否变化
				if(row_num !==  nNum + 1){
					//更新行标
					rowNum(row_num, nNum + 1 );
					row_num = nNum + 1;

				}else{
					return;
				}
			},0);
		},false);

		//执行按钮点击事件
		do_btn.addEventListener('click',function(){
			if(doingFlag){
				return;
			}

			doingFlag = true;
			var square = document.getElementById('square'),
			      finalOrder = [],
			      timer_order,
			      i = 0;
			finalOrder = parseOrder();
			console.log(finalOrder);
			function delayDo(){
				doOrder(finalOrder[i]);
				if(finalOrder[i+1]){
					i++;
					setTimeout(delayDo,500);
				}else{
					return;
				}
			}
			delayDo();
		},false);

		//Refresh按钮点击事件
		refresh_btn.addEventListener('click',refresh,false);

		function refresh(){
			var content = text_input.value,
			      nNum,
			      square = document.getElementById('square');
			if(doingFlag){
				return;
			}
			pos_x = 1;		//当前的横坐标
			pos_y = 1;		//当前的纵坐标
			dir_now = 0;		//当前的方向下标
			square.style.left = 60 + 'px';
			square.style.top = 60 + 'px';
			square.style.transform = 'rotate(' + 0 + 'deg)';

			//若未匹配到换行则正则匹配返回NULL，没有length属性
			//故先判断是否有换行
			if( content.match(/\n/g) ){
				nNum = content.match(/\n/g).length;
			}else{
				nNum = 0;
			}

			//行数为换行数+1
			//判断换行符的数目是否变化
			if(row_num !==  nNum + 1){
				//更新行标
				rowNum(row_num, nNum + 1 );
				row_num = nNum + 1;

			}else{
				return;
			}
		}

	}());

	//行标更新函数
	function rowNum(num_before,num_now){
		var leftCol = document.getElementById("leftCol"),
		       topValue;
		while(num_before !== num_now){
			var pNode;
			if(num_now < num_before){
				pNode = leftCol.lastChild;
				leftCol.removeChild(pNode);
				num_before--;
			}else{
				pNode = document.createElement("p");
				pNode.innerHTML = num_before + 1;
				leftCol.appendChild(pNode);
				num_before++;
			}
		}

		if(num_now > 11){
				topValue =0 - (num_now - 11) * 22 + 8;
				console.log(topValue);
				leftCol.style.top = topValue + 'px';
		}else{
			leftCol.style.top = 0+'px';
		}
	}

	//命令解析检错
	function parseOrder(){
		var text_input = document.getElementById('textarea'),
		      content = text_input.value,	//textarea内容
		      leftCol = document.getElementById("leftCol"),
		      orderLists = [],		//逐行解析的内容
		      numRepeat ,		//每条指令 移动格数
		      rowOrderLists,		//解析单行指令
		      finalOrder = [], 		//最终需执行的命令列表
		      errFlag = false,		//命令非法标志
		      orders = ["GO","TUN","TRA","MOV","TOP","RIG","BAC","BOT","LEF"]; //正确的指令条目

		orderLists = content.split("\n");		//用换行符分割内容

		for(i = 0,len = orderLists.length;i<len;i++){
			if(orderLists[i].match(/\d/)){	//用正则匹配命令的执行次数
				numRepeat = parseInt(orderLists[i].match(/\d/));
				if(numRepeat>9){	//如果执行次数超过９次按９次执行
					numRepeat = 9;
				}
			}else{
				numRepeat = 1;		//如果没有输入执行次数　默认为１
			}
			rowOrderLists = [];
			rowOrderLists = orderLists[i].match(/([A-Za-z]+)/g);	//正则匹配分解一行命令保存至数组

			//命令格式判断　命令为空，ＧＯ命令同行还有其他指令，其他运动命令后没有跟方向指令均判断为错误
			if( !rowOrderLists || rowOrderLists.length>2 || (rowOrderLists[0] == "GO" && rowOrderLists[1]) || (rowOrderLists[0] !== "GO" && !rowOrderLists[1]) ){
				leftCol.getElementsByTagName('p')[i].style.background = '#f00';
			}else{
				//判断行内的指令是否包换在合法指令数组内
				for(var j = 0;j<rowOrderLists.length;j++){
					if(orders.indexOf(rowOrderLists[j]) == -1){
						leftCol.getElementsByTagName('p')[i].style.background = '#f00';
						errFlag = true;
						break;
					}
				}
				//将合法指令压入最终指令数组中
				if(!errFlag){
					leftCol.getElementsByTagName('p')[i].style.background = '';
					while(numRepeat){	//若指令重复多次，则把指令多次压入
						numRepeat--;
						if(rowOrderLists[1]){
							finalOrder.push(rowOrderLists[0]+" "+rowOrderLists[1]);
						}else{
							finalOrder.push(rowOrderLists[0]);
						}
					}

				}
				errFlag = false;
			}
		}
		return finalOrder;
	}

	//根据输入命令执行
	function doOrder(order){
		//根据输入执行相应函数
		switch(order){	//************************************************
		case "GO":
	 		positionFoward(dir_now);
	 		move();
			break;
		case "TUN LEF":
			turnLeft();
			break;
		case "TUN RIG":
			turnRight();
			break;
		case "TUN BAC":
			turnBack();
			break;

		// TRA
		case "TRA TOP":
			positionFoward(0);
			move();
			break;
		case "TRA RIG":
			positionFoward(1);
			move();
			break;
		case "TRA BOT":
			positionFoward(2);
			move();
			break;
		case "TRA LEF":
			positionFoward(3);
			move();
			break;

		// MOV
		case "MOV TOP":
			animateDir(dir_now,0);
			positionFoward(0);
			move();
			break;
		case "MOV RIG":
			animateDir(dir_now,1);
			positionFoward(1);
			move();
			break;
		case "MOV BOT":
			animateDir(dir_now,2);
			positionFoward(2);
			move();
			break;
		case "MOV LEF":
			animateDir(dir_now,3);
			positionFoward(3);
			move();
			break;
		}
	}
