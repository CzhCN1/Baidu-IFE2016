/**
 * 增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById("aqi-city-input");
	var data = document.getElementById("aqi-value-input");
	var table = document.getElementById("aqi-table");
	var newNode = document.createElement("tr");

	var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	var reg2 = /\w/;
	 var reg3 = /^[0-9]+.?[0-9]*$/;

	 //输入检测
	 if(!city.value){
	 	alert("输入不能为空!");
		return;
	 }
	else if(!reg.test(city.value) || reg2.test(city.value)){
		alert('城市只能为汉字!');
		return;
	}
	if(!data.value){
		alert("输入不能为空!");
		return;
	}
	else if(!reg3.test(data.value)){
   		alert("指数只能为数字!");
   		return;
	}

	newNode.innerHTML = "<td>"+city.value+"</td><td>"+data.value+"</td><td><button>删除</button></td>";
	console.log(table.childNodes[1]);
	table.childNodes[1].appendChild(newNode);
}

//删除事件代理
function parentListen(event){
	if(event.target && event.target.tagName=='BUTTON'){
		var tr = event.target.parentNode.parentNode;
		tr.parentNode.removeChild(tr);
		console.log(tr.childNodes[0]);
	}
}

function init() {
	// 在这下面给add-btn绑定一个点击事件，点击时触发addAqiData函数
	var addBtn = document.getElementById("addBtn");
	if (addBtn.addEventListener) {
		addBtn.addEventListener('click',addAqiData,false);
	} else {
		addBtn.attachEvent('onclick',addAqiData);
	}

	// 想办法给aqi-table中的所有删除按钮绑定事件，触发parentListen函数
	var table = document.getElementById('aqi-table');
	if (table.addEventListener) {
		table.addEventListener('click',parentListen,false);
	} else {
		table.attachEvent('onclick',parentListen);
	}

}

init();
