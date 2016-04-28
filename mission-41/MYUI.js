var MYUI = (function(){

	//**********************************************************************************
	//**********************************************************************************
	//										表格组件
	//**********************************************************************************
	//**********************************************************************************
	var table =(function(){
		//save config options
		var config;

		//实例化一个table对象
		function init(opts){
			return new Table(opts);
		}

		//Table 函数构造器
		function Table(opts){
			config = this.parseOpts(opts);		//save config options
			this.tabInit();				//initiate table style
			this.addTh();				//add tableHead to table
			this.addTr();				//add tableRow to table

			//check config  whether freeze the first row
			var tab = document.getElementById(config.tabId);
			if(config.thStickyFlag){
				document.addEventListener('scroll',function(){
					var thRow = tab.childNodes[0],
					      top = tab.offsetTop,
					      height = tab.offsetHeight;
					//判断是否冻结首行
					if(window.scrollY > top){
						thRow.style.position = "fixed";
						thRow.style.top = "0px";
						thRow.nextSibling.style.display = "";
					}else{
						thRow.style.position = "static";
						thRow.nextSibling.style.display = "none";
					}
					//判断是否显示首行
					if(window.scrollY > (top + height ) ){
						thRow.style.display = "none";
					}else{
						thRow.style.display = "";
					}
				},false);
			}
		}

		//Table 函数原型
		Table.prototype = {
			//default Opts
			defaultOpts : {
				thStickyFlag : false,
				sortFlag : false,
			},
			//parse options
			parseOpts : function(opts){
				for(var key in this.defaultOpts){
					if(!opts[key]){
						opts[key] = this.defaultOpts[key];
					}
				}
				opts.rowNum = opts.trContent.length + 1;
				opts.colNum = opts.thContent.length;
				return opts;
			},
			//initiate table style
			tabInit : function(){
				var tab = document.getElementById(config.tabId);
				tab.className += ' '+"UI_table";
			},
			//add tableHead to table
			addTh : function(){
				var thNode = document.createElement('tr'),
			      	      tdList,
			      	      arrowWrap,
			      	      tab = document.getElementById(config.tabId);

			      	//add td nodes
			      	thNode = this.addTd(thNode,config.thContent);
			      	//get all td nodes
			      	tdList = thNode.childNodes;
			      	//add sort arrow for td nodes
			      	for(var i = 1;i<config.colNum;i++){
			      		//check sortFlag
			      		if(config.sortFlag[i]){
			      			arrowWrap = document.createElement('div');
			      			arrowWrap.className += ' '+"arrowWrap";
			      			addArrowUp(arrowWrap);
						addArrowDown(arrowWrap);
						tdList[i].appendChild(arrowWrap);
			      		}
				}
				//append first row for table
				tab.appendChild(thNode);

				//由于第一行元素fixed定位后脱离文档流
				//所以添加一个空行来撑起原位置，通常不显示
				//当首行fixed定位后显示
				var blankTr,balnkTd;
				blankTr = document.createElement('tr');
				balnkTd = document.createElement('td');
				blankTr.appendChild(balnkTd);
				blankTr.style.display = "none";
				tab.appendChild(blankTr);


				function addArrowDown(tdNode){
					var divNode = document.createElement('div');
					divNode = addArrow(divNode,true);
					divNode.className += ' '+"arrowDown";
					tdNode.appendChild(divNode);
				}
				function addArrowUp(tdNode){
					var divNode = document.createElement('div');
					divNode = addArrow(divNode,false);
					divNode.className += ' '+"arrowUp";
					tdNode.appendChild(divNode);
				}
				function addArrow(divNode,flag){
					divNode.className += ' '+"arrow";
					divNode.addEventListener('click',function(eve){
						var content = eve.target.parentNode.parentNode.innerHTML.split('<')[0],
						      listNum = config.thContent.indexOf(content),
						      sortList = [],
						      newList = [],
						      trList = tab.childNodes;
						//取出要排序的数据，保存在数组中
						for( var i = 1;i<config.rowNum;i++){
							sortList.push(trList[i+1].childNodes[listNum].innerHTML);
						}

						//得到所要求经排序后的数组
						//降序排序
						newList = sortList.sort(sortNumber);
						//需要升序则取反
						if(!flag){
							newList = newList.reverse();
						}

						//获得当前列的数据分布情况
						sortList = [];
						for( i = 1;i<config.rowNum;i++){
							sortList.push(trList[i+1].childNodes[listNum].innerHTML);
						}

						//根据前后两个数组，重新排序列表项
						changeOrder(newList,sortList);

						function sortNumber(a,b){
							return b - a ;
						}
						//根据排序结果重新排列行序
						function changeOrder(newList,oldList){
							var len = newList.length,
							      pos_before,
							      pos_now,
							      trList = tab.childNodes,
							      tempNode = document.createElement('tr'),
							      temp;
							for(var k = 0;k<len;k++){
								//记录当前值在新表中位置，并寻找当前值在原表中的位置
								pos_now = k;
								pos_before = oldList.indexOf(newList[k]);
								//如果当前值在两个表中的位置不一样，则交换两个节点的内容
								if(pos_now !== pos_before){
									tempNode.innerHTML = trList[pos_before+2].innerHTML;
									trList[pos_before+2].innerHTML = trList[pos_now+2].innerHTML;
									trList[pos_now+2].innerHTML = tempNode.innerHTML;

									//更新表的内容
									temp = oldList[pos_before];
									oldList[pos_before] = oldList[pos_now];
									oldList[pos_now] = temp;
								}
							}
						}
					},false);
					return divNode;
				}
				return thNode;
			},
			// add Td to Tr
			addTd : function(rowNode,contentList){
				var tdNode/*,
				      config = this.defaultOpts*/;
				for(var i = 0;i<config.colNum;i++){
					tdNode = document.createElement('td');
					tdNode.innerHTML = contentList[i];
					rowNode.appendChild(tdNode);
				}
				return rowNode;
			},
			// add Tr to Table
			addTr : function(){
				var trNode,
				      tab = document.getElementById(config.tabId);
				for(var i = 0; i < config.rowNum-1;i++){
					trNode = document.createElement('tr');
					trNode = this.addTd(trNode,config.trContent[i]);
					tab.appendChild(trNode);
				}
			},
		};

		// return API
		return{
			init : init,
		};
	}());


	//**********************************************************************************
	//**********************************************************************************
	//										日历组件
	//**********************************************************************************
	//**********************************************************************************
	var calendar = (function(){
		var config = {},
			myDate = new Date(),
			that;

		//实例化一个calendar对象
		function init(opts){
			return new Calendar(opts);
		}

		//Calendar构造函数
		function Calendar(opts) {
			config = this.parseOpts(opts);
			that = this;

			this.createYearList();		//根据配置信息计算年份列表
			this.addCalendar();			//创建日历，添加样式class，绑定日历点击显示隐藏的事件
			this.addHeader();			//创建日历头部分
			this.createDayList();		//根据日历头选项生成本月的日期列表
			this.addDays();				//添加日期列表td节点
			this.updateDays();			//刷新日历内容
			this.selectDay();			//添加日期单击选择的事件

		}

		//Calendar 原型
		Calendar.prototype = {
			defaultOpts : {
				monthList:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
				yearStart:1970,
				yearEnd:2020,
				yearNow : myDate.getFullYear(),
				monthNow : myDate.getMonth(),
				monthDay:[31,null,31,30,31,30,31,31,30,31,30,31],
				weekDay :['Su','Mo','Tu','We','Th','Fr','Sa'],
				dayList :[],
				dayClassList:[],
				hiddenFlag : false,
				inputValue : myDate.getFullYear()+'-'+myDate.getMonth()+'-'+myDate.getDate(),
			},
			parseOpts : function(opts){
				for(var key in this.defaultOpts){
					if(!opts[key]){
						opts[key] = this.defaultOpts[key];
					}
				}
				return opts;
			},
			/**
			 * [addCalendar 添加class修改整体样式,为input添加点击事件]
			 */
			addCalendar : function(){
				var calendar = document.getElementById(config.calId);
				//为日历div添加class
				calendar.className += ' '+"UI_calendar";
				//判断是否隐藏日历
				if(config.hiddenFlag){
					//隐藏日历显示
					calendar.style.display = "none";
					//与日历绑定的输入框
					var input = document.getElementById(config.inputId);
					input.className += ' '+"UI_calendarInput";
					//点击输入框弹出日历
					input.addEventListener('click',function(eve){
						calendar.style.display = "";
						eve.stopPropagation();
					},false);
					//阻止日历上点击事件的冒泡
					calendar.addEventListener('click',function(eve){
						eve.stopPropagation();
					},false);
					//点击页面其他部位隐藏日历
					document.addEventListener('click',function(eve){
						calendar.style.display = "none";
					},false);
				}

			},
			/**
			 * [addHeader 添加日历的头部(月份,年的选择)]
			 */
			addHeader : function(){
				var calendar = document.getElementById(config.calId),  //日历组件
				    nDiv = document.createElement('div');	//div.header
				nDiv.className += ' '+"header";
				nDiv.appendChild(addMonthSelect());
				nDiv.appendChild(addYearSelect());
				calendar.appendChild(nDiv);
				//点击隐藏弹出框
				document.addEventListener('click',clickHidden,false);
				/**
				 * [addMonthSelect 生成monthSelect节点并返回]
				 * return : monthSelect节点
				 */
				function addMonthSelect(){
					var nMonth = document.createElement('div'),
						nMonthShow = document.createElement('div');
					nMonth.className += ' '+"month";
					nMonthShow.innerHTML = config.monthList[config.monthNow];
					nMonthShow.className += ' '+"monthShow";
					nMonthShow.id = "monthShow";
					nMonth.appendChild(nMonthShow);
					nMonth.appendChild(addArrow(config.monthList));
					nMonth.appendChild(addHidden(config.monthList));

					nMonthShow.addEventListener('click',function(eve){
						var divHidden = eve.target.nextSibling.nextSibling;
						divHidden.style.display = 'block';
						eve.stopPropagation();
					},false);

					return nMonth;
				}
				/**
				 * [addMonthSelect 生成yearSelect节点并返回]
				 * return : yearSelect节点
				 */
				function addYearSelect(){
					var nYear = document.createElement('div'),
						nYearShow = document.createElement('div');
					nYear.className += ' '+"year";
					nYearShow.innerHTML = config.yearNow;
					nYearShow.className += ' '+"yearShow";
					nYearShow.id = "yearShow";
					nYear.appendChild(nYearShow);
					nYear.appendChild(addArrow(config.yearList));
					nYear.appendChild(addHidden(config.yearList));

					nYearShow.addEventListener('click',function(eve){
						var divHidden = eve.target.nextSibling.nextSibling;
						divHidden.style.display = 'block';
						eve.stopPropagation();
					},false);
					return nYear;
				}

				/**
				 * [addArrow 添加箭头节点并绑定事件]
				 */
				function addArrow(list){
					var arrowWrap = document.createElement('div'),
						arrowUp = document.createElement('div'),
						arrowDown = document.createElement('div');
					arrowWrap.className += ' '+"arrowWrap";
					arrowUp.className += ' '+"arrowUp arrow";
					arrowDown.className += ' '+"arrowDown arrow";
					arrowWrap.appendChild(arrowUp);
					arrowWrap.appendChild(arrowDown);
					
					arrowUp.addEventListener('click',function(eve){
						var divShow = eve.target.parentNode.previousSibling,
							nowIndex = list.indexOf(divShow.innerHTML);
						if(list == config.yearList){
							nowIndex = list.indexOf(parseInt(divShow.innerHTML));
						}
						if(list[nowIndex-1]){
							divShow.innerHTML = list[nowIndex-1];
						}
						that.updateCalendar();
						that.loadSelectDay();
					},false);
					arrowDown.addEventListener('click',function(eve){
						var divShow = eve.target.parentNode.previousSibling,
							nowIndex = list.indexOf(divShow.innerHTML);
						if(list == config.yearList){
							nowIndex = list.indexOf(parseInt(divShow.innerHTML));
						}
						if(list[nowIndex+1]){
							divShow.innerHTML = list[nowIndex+1];
						}
						that.updateCalendar();
						that.loadSelectDay();
					},false);

					return arrowWrap;
				}
				/**
				 * [addHidden 添加隐藏的选择列表]
				 * @param {[type]} list [选项列表]
				 */
				function addHidden(list){
					var divHidden = document.createElement('div');
					divHidden.className += "hidden";
					for(var i=0,len = list.length;i<len;i++){
						var nOpt = document.createElement('option');
						nOpt.innerHTML = list[i];
						divHidden.appendChild(nOpt);
					}
					//为隐藏列表添加点击事件
					divHidden.addEventListener('click',function(eve){
						var content,
							divShow;
						if(eve.target.nodeName == "OPTION"){
							content = eve.target.innerHTML;
							divShow = divHidden.previousSibling.previousSibling;
							divShow.innerHTML = content;
							that.updateCalendar();	//更新日历
							clickHidden();			//点击选项后隐藏列表
							that.loadSelectDay();	//读取已选择的日期
						}
					},false);

					return divHidden;
				}
				/**
				 * [clickHidden 点击隐藏]
				 * @return {[type]} [description]
				 */
				function clickHidden(){
					//寻找class="hidden"的节点 改变display属性为hidden
					var childList = calendar.getElementsByTagName('*');
					for(var i = 0; i<childList.length; i+=1){
						if(childList[i].className === "hidden"){
							childList[i].style.display = "none";
						}
					}
				}
			},
			/**
			 * [addDays 添加日历的日期部分]
			 */
			addDays : function(){
				var calendar = document.getElementById(config.calId),  //日历组件
					nDays = document.createElement('div'),
					nTable = document.createElement('table');
				nDays.className += ' '+ "days";
				nTable.id = "dayTable";
				nTable.appendChild(addWeek());
				for(var i = 0;i<6;i++){
					nTable.appendChild(addDay(i));
				}
				nDays.appendChild(nTable);
				calendar.appendChild(nDays);

				/**
				 * [addWeek 添加第一行星期]
				 */
				function addWeek(){
					var nTr = document.createElement('tr');
					for(var i =0;i<7;i++){
						var nTd = document.createElement('td');
						nTd.innerHTML = config.weekDay[i];
						nTr.appendChild(nTd);
					}
					nTr.className += "week";
					return nTr;
				}
				/**
				 * [addDay 添加日期节点]
				 * @param {[type]} num [生成第几行日期]
				 */
				function addDay(num){
					var nTr = document.createElement('tr');
					nTr.id = "tr"+(num+1);
					for(var i=0+num*7,len=(1+num)*7;i<len;i++){
						var nTd = document.createElement('td');
						nTr.appendChild(nTd);
					}
					return nTr;
				}
			},
			//生成年份列表
			createYearList : function() {
				var yearList = [];
				for(var i = config.yearStart,j = config.yearEnd;i<=j;i++){
					yearList.push(i);
				}
				config.yearList = yearList;
			},
			//生成日期列表
			createDayList :	function(){
				//chosMonth : 0~11
				var chosMonth = config.monthList.indexOf(document.getElementById('monthShow').innerHTML),
					chosYear = parseInt(document.getElementById('yearShow').innerHTML),
					newDate = new Date(chosYear,chosMonth),
					preMonth,
					nextMonth,
					dayList = [],
					dayClassList = [];
				//判断是否为闰年，确定二月天数
				if(isLeapYear()){
					config.monthDay[1] = 29;
				}
				else{
					config.monthDay[1] = 28;
				}
				//判断上个月与下个月
				if(chosMonth === 0){
					preMonth = 11;
					nextMonth = 1;
				}else if(nextMonth === 11){
					preMonth = 10;
					nextMonth = 0;
				}else{
					preMonth = chosMonth-1;
					nextMonth = chosMonth+1;
				}
				//上个月余下的天数
				var i,
					len = newDate.getDay();
				if(len === 0){
					len = 7;
				}
				for(i = 0;i<len;i++){
					dayList.push(config.monthDay[preMonth]-len+i+1);
					dayClassList.push("preThisMonth");
				}
				//这个月的天数
				for(i = 0,len = config.monthDay[chosMonth];i<len;i++){
					dayList.push(i+1);
					dayClassList.push("isThisMonth");
				}
				//下个月的天数
				var j;
				for(i = dayList.length,j = 1;i<42;i++,j++){
					dayList.push(j);
					dayClassList.push("nextThisMonth");
				}
				config.dayList = dayList;
				config.dayClassList = dayClassList;
				//判断是否是闰年
				function isLeapYear(){
					return (chosYear % 400 === 0 || (chosYear % 4 === 0 && chosYear % 100 !==0));
				}
			},
			/**
			 * [updateDays 更新日期节点的内容,并添加class]
			 * @return {[type]} [description]
			 */
			updateDays : function(){
				var idList = ["tr1","tr2","tr3","tr4","tr5","tr6"],
					nTr,
					tdList;
				for(var i =0;i<6;i++){
					nTr = document.getElementById(idList[i]);
					tdList = nTr.getElementsByTagName('td');
					for(var j =0;j<7;j++){
						tdList[j].innerHTML = config.dayList[i*7+j];
						tdList[j].className =config.dayClassList[i*7+j];
					}
				}
			},
			/**
			 * [updateCalendar 更新日历]
			 * @return {[type]} [description]
			 */
			updateCalendar : function(){
				that.createDayList();	//根据新的选项生成本月的日期列表
				that.updateDays();		//更新日期的显示
				that.removeAttr();		//移除被选中的样式class
			},
			/**
			 * [updateInput 更新Input输入框的值]
			 * @param  {[type]} year  [选中日期的年份]
			 * @param  {[type]} month [选中日期的月份]
			 * @param  {[type]} day   [选中日期的日子]
			 * @return {[type]}       [description]
			 */
			updateInput : function(year,month,day){
				var input = document.getElementById(config.inputId),
					str = "";

				if(parseInt(month)<10){
					month = "0"+ month;
				}
				if(parseInt(day)<10){
					day = "0"+ day;
				}
				str += year+"-"+month+"-"+day;

				input.value = str;
				config.inputValue = str;	//保存已选日期至config
			},
			/**
			 * [selectDay 单击选择日期的事件]
			 * @return {[type]} [description]
			 */
			selectDay : function(){
				var dayTable = document.getElementById("dayTable");

				//事件代理 Table代理所有Td节点的点击事件
				dayTable.addEventListener('click',function(eve){
					var yearShow = document.getElementById('yearShow'),
						monthShow = document.getElementById('monthShow'),
						input = document.getElementById(config.inputId),
						nTd = eve.target,
						selectDay = nTd.innerHTML;
					//判断点击目标是否是td节点
					if(nTd.nodeName == "TD" && nTd.className !== ""){
						//移除已选择节点的样式
						that.removeAttr();
						//如果点击了非本月的日期
						if(nTd.className !== "isThisMonth"){
							var posYear = config.yearList.indexOf(parseInt(yearShow.innerHTML)),
								posMonth = config.monthList.indexOf(monthShow.innerHTML);
							//如果点击了前一个月的日期
							if(nTd.className == "preThisMonth"){
								if(posMonth !== 0){
									posMonth--;
								}else{
									if(posYear !== 0){
										posYear--;
										posMonth = 11;
									}
								}
							//如果点击了下一个月的日期
							}else if(nTd.className == "nextThisMonth"){
								if(posMonth !== 11){
									posMonth++;
								}else{
									if(posYear !== config.yearList.length-1){
										posYear++;
										posMonth = 0;
									}
								}
							}
							//更新日历头部的选项显示
							yearShow.innerHTML = config.yearList[posYear];
							monthShow.innerHTML = config.monthList[posMonth];
							
							that.updateCalendar();		//更新日历
							that.addAttr(selectDay);	//添加点击日期的样式
						//选择了当月的日期
						}else{
							//为该节点添加选择后的样式
							nTd.setAttribute("select","selected");
						}
						//日期输入框内容更新
						that.updateInput(yearShow.innerHTML,config.monthList.indexOf(monthShow.innerHTML)+1,selectDay);
						
						//隐藏日历表单
						if(config.selectHiddenFlag){
							document.getElementById(config.calId).style.display = "none";
						}
		
						//执行回调
						that.callBack();
					}
				},false);
			},
			/**
			 * [removeAttr 移除已选择日期的样式]
			 * @return {[type]} [description]
			 */
			removeAttr : function(){
				var pNode = document.getElementById("dayTable"),
					tagName = 'td',
					attrName = 'select',
					nList = (pNode?pNode:document).getElementsByTagName((tagName?tagName:'*'));
				for(var i=0,len = nList.length;i<len;i++){
					if(nList[i].hasAttribute(attrName)){
						nList[i].removeAttribute(attrName);
					}
				}
			},
			/**
			 * [addAttr 为已选择的日期添加样式]
			 * @param {[type]} dayNum [description]
			 */
			addAttr : function(dayNum){
				var pNode = document.getElementById("dayTable"),
					tagName = 'td',
					attrName = 'select',
					nList = (pNode?pNode:document).getElementsByTagName((tagName?tagName:'*'));
				for(var i=0,len = nList.length;i<len;i++){
					if(nList[i].innerHTML == dayNum && nList[i].className == "isThisMonth"){
						nList[i].setAttribute("select","selected");
					}
				}
			},
			/**
			 * [loadSelectDay 读取已选择的日期，判断该日期是否出现在当前日历中，若出现则添加已选择的样式]
			 * @return {[type]} [description]
			 */
			loadSelectDay : function(){
				var parseDay = config.inputValue.split('-'),
					monthShow = document.getElementById("monthShow"),
					yearShow = document.getElementById("yearShow");
				//如果是已选择日期的当前月和当前年
				if(yearShow.innerHTML == parseDay[0] && monthShow.innerHTML == config.monthList[parseInt(parseDay[1])-1]){
					//为该节点添加已选择样式
					that.addAttr(parseInt(parseDay[2]));
				}
			},
			callBack : function(){
				if(config.selectCallback){
					config.selectCallback();
				}
			}
		};

		//return API
		return{
			init:init,
		};

	}());

	return{
		table : table,
		calendar : calendar,
	};
}());
