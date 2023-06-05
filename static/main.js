// 提取需要的字段
var authors = data.map(d => d['作者']);
var authorBirthYears = data.map(d => d['作者生年']);
var authorDeathYears = data.map(d => d['作者卒年']);
var titles = data.map(d => d['作品标题']);
var correspondenceRelationships = data.map(d => d['通讯关系']);
var correspondents = data.map(d => d['通讯人']);
var correspondentBirthYears = data.map(d => d['通讯人生年']);
var correspondentDeathYears = data.map(d => d['通讯人卒年']);
var correspondenceCounts = data.map(d => d['通讯次数']);
var correspondenceYears = data.map(d => d['通讯年份']);
var era = data.map(d => d['年号']);
var year = data.map(d => d['年']);
var anthology = data.map(d => d['文集']);
var source = data.map(d => d['出处']);
var volume = data.map(d => d['卷']);
var cssSequenceNumber = data.map(d => d['CSS序号']);
var cssNumber = data.map(d => d['CSS编号']);
var remarks = data.map(d => d['备注']);

var communicationRelations = data.map(d => [d['通讯关系'], d['作者'], d['通讯人']]);

// 初始化 echarts 实例
var myChart = echarts.init(document.getElementById('plot'));

myChart.showLoading();

// 数据预处理
var uniqueNodesSet = new Set();
var uniqueNodes = {};

data.forEach(function (item) {
  uniqueNodesSet.add(item.作者);
  uniqueNodesSet.add(item.通讯人);
});

var uniqueNodesArray = Array.from(uniqueNodesSet);
uniqueNodesArray.forEach(function (node, index) {
  uniqueNodes[node] = index + 1;
});

console.log(uniqueNodes)

// 构造节点数据
var nodes = Object.keys(uniqueNodes).map(function (key) {
  return {
    id: uniqueNodes[key],
    name: key,
    symbolSize: 10, // 节点的大小
  };
});

console.log('node', nodes)

// 构造边数据
var links = communicationRelations.slice(0, 500).map(function (rela) {
  return {
    source: uniqueNodes[rela[1]] + '',
    target: uniqueNodes[rela[2]] + ''
  };
});

var edges = communicationRelations.map(function (rela) {
  return {
    source: uniqueNodes[rela[1]] + '',
    target: uniqueNodes[rela[2]] + '',
    value: 10
  };
});

console.log('link', links)

let option = {
  tooltip: {},
  emphasis: { // 高亮样式
    focus: 'series', // 设置高亮类型为系列
    itemStyle: {
      borderWidth: 1, // 边框宽度
      borderColor: 'yellow', // 边框颜色
      shadowBlur: 10, // 阴影模糊度
      shadowColor: 'yellow' // 阴影颜色
    }
  },
  // grid: {  // 创建一个虚拟的坐标轴
  //   show: true,
  //   left: '10%',
  //   right: '10%',
  //   top: '10%',
  //   bottom: '10%',
  // },
  // dataZoom: [{  // 应用dataZoom到虚拟的坐标轴
  //   type: 'slider',
  //   xAxisIndex: [0],
  //   // yAxisIndex: [0],
  // }],
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'value',
  },
  series: [{
    name: 'Communication Network',
    roam: true,
    type: 'graph',
    layout: 'force',
    nodes: nodes,
    edges: edges,
    // coordinateSystem: 'cartesian2d',
    // xAxisIndex: 0, // 对第一个x轴进行缩放
    // yAxisIndex: 0 // 对第一个y轴进行缩放
  }],
  // dataZoom: {
  //   type: 'inside', // 内置型数据区域缩放组件
  //   xAxisIndex: 0, // 对第一个x轴进行缩放
  //   yAxisIndex: 0, // 对第一个y轴进行缩放
  // },
  focusNodeAdjacency: true
};

myChart.setOption(option);
myChart.hideLoading();

// myChart.dispatchAction({
//   type: 'highlight',
//   name: '申时行', // 数据点的名称
//   itemStyle: {
//       borderWidth: 3,
//       borderColor: 'yellow',
//       shadowBlur: 10,
//       shadowColor: 'yellow'
//     }
// });