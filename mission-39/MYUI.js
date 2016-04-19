var MYUI = (function(){
	//  sub-unit Table
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

	return{
		table : table,
	};
}());
