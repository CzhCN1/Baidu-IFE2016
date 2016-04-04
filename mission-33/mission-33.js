var do_btn = document.getElementById('do'),
      go_input = document.getElementById('go'),
      pos_x = 1,		//当前的横坐标
      pos_y = 1,		//当前的纵坐标
      dir = ["top","right","bottom","left"],	//方向列表
      dir_now = 0;		//当前的方向下标

//GO指令
 function go(){
 	switch(dir_now){
 	case 0:
 		if (pos_y === 1) {
 			break;
 		}else{
 			pos_y--;
 		}
 		break;
 	case 1:
 		if (pos_x === 10) {
 			break;
 		}else{
 			pos_x++;
 		}
 		break;
 	case 2:
 		if (pos_y === 10) {
 			break;
 		}else{
 			pos_y++;
 		}
 		break;
 	case 3:
 		if (pos_x === 1) {
 			break;
 		}else{
 			pos_x--;
 		}
 		break;
 	}

 }

 //TUN LEF指令
 function turnLeft(){
 	if(dir_now === 0){
 		dir_now = 3;
 	}else{
 		dir_now--;
 	}
 }

//TUN RIG指令
 function turnRight() {
 	if(dir_now === 3){
 		dir_now = 0;
 	}else{
 		dir_now++;
 	}
 }

 //TUN BAC指令
 function turnBack(){
 	if(dir_now > 1){
 		dir_now -= 2;
 	}else{
 		dir_now += 2;
 	}
 }

//执行按钮点击事件
do_btn.addEventListener('click',function(){
	var nDiv1 = document.createElement('div'),
	      nDiv2 = document.createElement('div'),
	      nTr = document.getElementsByTagName("tr")[pos_y],
	      nTd = nTr.getElementsByTagName("td")[pos_x];

	//清除上次位置的属性
	nTd.innerHTML = "";
	nTd.className = "";

	//根据输入执行相应函数
	switch(go_input.value){
	case "GO":
		go();
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
	}

	//计算当前的位置
	nTr = document.getElementsByTagName("tr")[pos_y];
	nTd = nTr.getElementsByTagName("td")[pos_x];
	nTd.className = dir[dir_now];

	//添加两个DIV节点
	nTd.appendChild(nDiv1);
	nTd.appendChild(nDiv2);
},false);
