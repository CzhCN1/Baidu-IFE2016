# 一个简单的UI库
　　利用原型模式创立一个小型的UI代码库，包括表格组件和日历组件的自动生成。
## 表格组件
###[demo](gentlemanczh.com/works/Baidu_IFE/mission-39/)
1. 提供生成表格的接口，表格中的数据，表格样式低耦合。
2. 可以配置对哪些列支持排序功能，并在表头进行排序按钮的显示。
3. 提供点击排序按钮后的响应接口，并提供默认的排序方法，当提供的接口没有具体实现时，按默认的排序方法进行排序操作，并更新表格中的数据显示。
4. 提供首行冻结的选择，即当页面向下滚动，使得第一行已经在屏幕外时，则第一行则变成始终固定在屏幕最上方。当整个表格都滚动出屏幕时，固定的第一行也消失。  

		var tab1 = MYUI.table.init({
			tabId : "tab",
			thContent : ['姓名','语文','数学','英语','总分'],
			sortFlag : [false,true,true,true,true],
			trContent : [
					['小明',80,90,70,240],
					['小红',90,60,90,240],
					['小亮',60,100,70,230],
					['小强',100,70,80,250],
					['小刚',70,70,80,220],
				     ],
			thStickyFlag : true,
		});  
## 日历组件  
###[demo](gentlemanczh.com/works/Baidu_IFE/mission-41/)

2. 通过某种方式选择年、月，选择了年月后，日期列表做相应切换。
3. 通过单击某个具体的日期进行日期选择。
4. 组件初始化时，可配置可选日期的上下限。可选日期和不可选日期需要有样式上的区别。
5. 提供设定日期的接口，指定具体日期，日历面板相应日期选中。
6. 提供获取日期的接口，获取日历面板中当前选中的日期，返回一个日期对象。
7. 增加一个接口，用于当用户选择日期后的回调处理。
8. 增加可配置项，面板默认 显示/隐藏。
9. 增加可配置项，点击选择具体日期后，面板显示/隐藏。  

		var cla = MYUI.calendar.init({
			calId : "calendar",		//日历元素节点的ID
			inputId : "calInput",	//与日历绑定输入框的ID
			hiddenFlag : false,		//是否隐藏日历
			selectHiddenFlag:true,	//选择日期后是否隐藏日历
			yearStart:2000,			//起始年份
			yearEnd:2020,			//结束年份
			selectCallback : doSomething,//选择日期后执行的回调
		});
		//选择日期后的回调
		function doSomething(){
			var calInput = document.getElementById('calInput');
			alert(calInput.value);
		}