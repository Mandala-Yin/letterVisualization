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

console.log('link', links)

let option = {
  tooltip: {},
  series: [{
    name: 'Communication Network',
    type: 'graph',
    layout: 'force',
    data: nodes,
    links: links
  }]
};

myChart.setOption(option);
myChart.hideLoading();