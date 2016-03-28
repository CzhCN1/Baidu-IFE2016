/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
var cityList = ["北京","上海","广州","深圳","成都","西安","福州","厦门","沈阳"];
// 用于渲染图表的数据
var chartData = [];

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
  var ul_col = document.getElementById('col');
  ul_col.innerHTML = "";
  var newLi;

  for(var i=0;i<chartData.length;i++){
    newLi = document.createElement("li");
    ul_col.appendChild(newLi);
    newLi.style.height = chartData[i]+'px';

    if(pageState.nowGraTime == "day"){
      newLi.style.width = 10+'px';
    }else if(pageState.nowGraTime == "week"){
      newLi.style.width = 70+'px';
    }else{
      newLi.style.width = 303+'px';
    }

    var maxHeight = Math.max.apply(null,chartData);
    if(chartData[i]<maxHeight*0.2){
      newLi.style.background = '#7DFE40';
    }else if(chartData[i]<maxHeight*0.4){
      newLi.style.background = '#DCCB47';
    }else if(chartData[i]<maxHeight*0.6){
      newLi.style.background = '#989B16';
    }
    else if(chartData[i]<maxHeight*0.8){
      newLi.style.background = '#284853';
    }else{
      newLi.style.background = '#020521';
    }
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化
  var time = document.getElementsByName('gra-time');
  var timeValue;
  for(var i=0;i<time.length;i++){
    if(time[i].checked){
      timeValue = time[i].value;
    }
  }
  if(timeValue == pageState.nowGraTime){
    return;
  }
  // 设置对应数据
  pageState.nowGraTime = timeValue;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化
  var city = document.getElementById('city-select');
  if(city.value == pageState.nowSelectCity){
    return;
  }
  // 设置对应数据
  pageState.nowSelectCity = city.value;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = document.getElementById('form-gra-time');
  radio.addEventListener('change',graTimeChange,false);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var city = document.getElementById('city-select');
  pageState.nowSelectCity = city.value;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  city.addEventListener('change',citySelectChange,false);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = [];
  var city_sel = cityList[pageState.nowSelectCity];
  var time_sel = pageState.nowGraTime;

  var city_data = aqiSourceData[city_sel];
  var temp_data = [];
  //遍历城市的aqi指数并压入临时数组
  for(var i in city_data){
    temp_data.push(city_data[i]);
  }
  //根据时间粒度计算chart数据
  var sum = 0;
  var j;
  if (time_sel == "month") {
    for(j=0;j<temp_data.length;j++){
      sum += temp_data[j];
      if(j == 30){
        chartData.push(Math.floor(sum/31));
        sum = 0;
      }
      if(j == 59){
        chartData.push(Math.floor(sum/29));
        sum = 0;
      }
      if(j == temp_data.length-1){
        chartData.push(Math.floor(sum/31));
      }
    }
  }else if(time_sel == "week"){
    for(j=1;j<temp_data.length+1;j++){
      sum += temp_data[j-1];

      if( j%7 === 0 ){
        chartData.push(Math.floor(sum/7));
        sum = 0;
      }
    }
  }else{
    chartData = temp_data;
  }
}

function eventAgent(){
  var dataDiv = document.getElementById('data');
  var newP;
  var ul_col = document.getElementById('col');
  ul_col.addEventListener('mouseover',function(event){
    if(event.target && event.target.tagName=='LI'){
      var x = event.clientX + document.body.scrollLeft - document.body.clientLeft - 60;
      var y = event.clientY + document.body.scrollTop  - document.body.clientTop - 170;
      dataDiv.style.left=x;
      dataDiv.style.top=y;
      dataDiv.style.display='block';

      dataDiv.innerHTML = 'aqi:'+ event.target.offsetHeight;
    }
  },false);

  ul_col.addEventListener('mouseout',function(event){
  if(event.target && event.target.tagName=='LI'){
    dataDiv.style.display='none';
    dataDiv.innerHTML="";
  }
  },false);
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
  renderChart();
  eventAgent();
}

init();
