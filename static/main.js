var authors;
var receivers;
var persons;
var letterCountsByAuthor;
var letterCountsByReceiver;
var letterCountsByPerson;
var letterCount;
var communicationRelations;

function updateData() {

  authors = new Set(filteredData.map(d => d['作者']));
  let nAuthors = authors.size;

  letterCountsByAuthor = Array.from(authors).reduce(function (counts, author) {
    var count = filteredData.filter(function (row) {
      return row['作者'] === author;
    }).length;
    counts[author] = count;
    return counts;
  }, {});

  receivers = new Set(filteredData.map(d => d['通讯人']));
  let nReceivers = receivers.size;

  letterCountsByReceiver = Array.from(receivers).reduce(function (counts, receiver) {
    var count = filteredData.filter(function (row) {
      return row['通讯人'] === receiver;
    }).length;
    counts[receiver] = count;
    return counts;
  }, {});

  // 数据预处理
  persons = new Set([...authors, ...receivers]);
  letterCountsByPerson = Array.from(persons).reduce(function (counts, person) {
    var count = filteredData.filter(function (row) {
      return row['通讯人'] === person || row['作者'] === person;
    }).length;
    counts[person] = count;
    return counts;
  }, {});

  let nLetter = filteredData.length;

  // 获取 data-analysis-content 元素
  var dataAnalysisContent = document.getElementById("data-analysis-content");

  dataAnalysisContent.innerHTML =
    "     作者数量: " + nAuthors + "<br>"
    + "     通讯人数量: " + nReceivers + "<br>"
    + "     信件数量: " + nLetter;

  communicationRelations = filteredData.map(d => [d['通讯关系'], d['作者'], d['通讯人']]);
}

updateData();

function selectNode(name) {

  selectedRows = filteredData.filter(function (row) {
    return row['作者'] === name;
  });
  if (selectedRows.length > 0) {
    if (selectedRows[0]['作者生年'] && selectedRows[0]['作者卒年']) {
      selectedNodeInfo.innerHTML = '作者：' + name + '（生年：' + selectedRows[0]['作者生年'] + ', 卒年：' + selectedRows[0]['作者卒年'] + ', ';
    } else {
      selectedNodeInfo.innerHTML = '作者：' + name + '（';
    }
    if (letterCountsByAuthor[name]) {
      selectedNodeInfo.innerHTML += '共寄信：' + letterCountsByAuthor[name] + '封）';
    } else {
      selectedNodeInfo.innerHTML += '共寄信：0 封）';
    }
  } else {
    selectedNodeInfo.innerHTML = '收信者：' + name + '（共收信：' +  letterCountsByReceiver[name] + '封）';
  }
  updateSelectedLetters()
}

var myChart;
function updateGraph() {
  // 初始化 echarts 实例
  myChart = echarts.init(document.getElementById('plot'));

  myChart.showLoading();

  // 构造节点数据
  var nodes = Array.from(persons).map(function (key) {
    var ans = letterCountsByAuthor[key];
    if (!ans) {
      ans = 0;
    }
    var category;
    var inAuthors = authors.has(key);
    var inReceivers = receivers.has(key);

    if (inAuthors && inReceivers) {
      category = 2;
    } else if (inAuthors) {
      category = 0;
    } else {
      category = 1;
    }

    return {
      id: key,
      name: key,
      value: ans,
      symbolSize: 5 * Math.log(ans + 10), // 节点的大小
      category: category
    };
  });

  var edges = communicationRelations.map(function (rela) {
    return {
      source: rela[1],
      target: rela[2],
      value: 10
    };
  });

  let option = {
    tooltip: {
    },
    emphasis: {
      focus: 'adjacency',
      itemStyle: {
        color: 'yellow',
      },
      lineStyle: {
        width: 10
      }
    },
    legend: {
      data: ['作者', '收信人', '作者 & 收信人'],
      textStyle: {
        fontFamily: 'fzq', // 设置字体
        fontSize: 18, // 设置字体大小
        fontWeight: 'normal', // 设置字体粗细
        color: 'rgb(81,59,39)' // 设置字体颜色
      },
    },
    series: [{
      name: '通讯关系图',
      roam: true,
      type: 'graph',
      layout: 'force',
      nodes: nodes,
      edges: edges,
      categories: [
        { name: '作者', itemStyle: { color: '#794e50' } },
        { name: '收信人', itemStyle: { color: '#bbc5a5' } },
        { name: '作者 & 收信人', itemStyle: { color: '#689095' } },
      ],
    }],
    textStyle: {
      fontFamily: 'fzq', // 设置字体
      fontSize: 18, // 设置字体大小
      fontWeight: 'normal', // 设置字体粗细
      color: 'rgb(81,59,39)' // 设置字体颜色
    },
    scaleLimit: {
      min: 0.4,
      max: 2
    },
    label: {
      show: true,
      position: 'right',
      formatter: '{b}'
    },
    labelLayout: {
      hideOverlap: true
    },
    lineStyle: {
      color: 'source',
      curveness: 0.3
    },
    focusNodeAdjacency: true,
  };

  myChart.setOption(option);

  myChart.on('click', function (params) {
    if (params.dataType === 'node') {
      // 将选中节点的信息存储到selectedNode变量中
      selectNode(params.data.name);
    }
  });

  myChart.hideLoading();
}


function updateBar(type) {
  var chart = echarts.init(document.getElementById('plot2'));

  // 统计每个数出现的次数
  var countMap = new Map();
  if (type === '作者') {
    Object.values(letterCountsByAuthor).forEach(function (num) {
      countMap.set(num, (countMap.get(num) || 0) + 1);
    });
  } else if (type === '收信者') {
    Object.values(letterCountsByReceiver).forEach(function (num) {
      countMap.set(num, (countMap.get(num) || 0) + 1);
    });
  } else if (type === 'both') {
    Object.values(letterCountsByPerson).forEach(function (num) {
      countMap.set(num, (countMap.get(num) || 0) + 1);
    });
  }

  // 提取排序后的 x 轴数值和对应的次数
  var entries = Array.from(countMap.entries());

  // 对 entries 进行排序
  entries.sort(function (a, b) {
    return a[0] - b[0];
  });

  var xData = entries.map(function (entry) {
    return entry[0];
  });

  var yData = entries.map(function (entry) {
    return entry[1];
  });

  var option = {
    textStyle: {
      fontFamily: 'fzq', // 设置字体
      fontSize: 18, // 设置字体大小
      fontWeight: 'normal', // 设置字体粗细
      color: 'rgb(81,59,39)' // 设置字体颜色
    },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'bar',
      data: yData,
      color: 'rgb(81,59,39)'
    }]
  };

  if (type === '作者') {
    option.tooltip = {
      formatter: function (params) {
        var xValue = params.name; // x 轴数据项的值
        var yValue = params.data; // y 轴数据项的值
        return '寄出' + xValue + '封信的有' + yValue + '人';
      }
    }
    option.series[0].color = '#794e50';
  } else if (type === '收信者') {
    option.tooltip = {
      formatter: function (params) {
        var xValue = params.name; // x 轴数据项的值
        var yValue = params.data; // y 轴数据项的值
        return '收到' + xValue + '封信的有' + yValue + '人';
      }
    }
    option.series[0].color = '#bbc5a5';
  } else if (type === 'both') {
    option.tooltip = {
      formatter: function (params) {
        var xValue = params.name; // x 轴数据项的值
        var yValue = params.data; // y 轴数据项的值
        return '通信' + xValue + '封的有' + yValue + '人';
      }
    }
    option.series[0].color = '#689095';
  }


  chart.setOption(option);
}