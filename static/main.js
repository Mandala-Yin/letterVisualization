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
  selectedNodeInfo.innerHTML = '作者：' + name;
  selectedRows = filteredData.filter(function (row) {
    return row['作者'] === name;
  });
  updateSelectedLetters()
}

var authorBirthYears = data.map(d => d['作者生年']);
var authorDeathYears = data.map(d => d['作者卒年']);
var titles = data.map(d => d['作品标题']);
var correspondenceRelationships = data.map(d => d['通讯关系']);
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

var myChart;
function updateGraph() {
  // 初始化 echarts 实例
  myChart = echarts.init(document.getElementById('plot'));

  myChart.showLoading();

  // 构造节点数据
  var nodes = Array.from(persons).map(function (key) {
    var ans = letterCountsByAuthor[key];
    if (!ans) {
      ans = 1;
    }
    ans = 5 * Math.log(ans + 10)
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
      symbolSize: ans, // 节点的大小
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
    tooltip: {},
    emphasis: { // 高亮样式
      focus: 'adjacency', // 设置高亮类型为系列
      itemStyle: {
        borderWidth: 1, // 边框宽度
        borderColor: 'yellow', // 边框颜色
        shadowBlur: 10, // 阴影模糊度
        shadowColor: 'yellow' // 阴影颜色
      },
      lineStyle: {
        width: 10
      }
    },
    legend: {
      data: ['作者', '收信人', '作者 & 收信人']
    },
    series: [{
      name: 'Communication Network',
      roam: true,
      type: 'graph',
      layout: 'force',
      nodes: nodes,
      edges: edges,
      categories: [
        { name: '作者', itemStyle: { color: '#794e50' } },
        { name: '收信人', itemStyle: { color: '#689095' } },
        { name: '作者 & 收信人', itemStyle: { color: '#bbc5a5' } },
      ],
    }],
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
  } else if (type === 'both'){
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
  } else if (type === '收信者') {
    option.tooltip = {
      formatter: function (params) {
        var xValue = params.name; // x 轴数据项的值
        var yValue = params.data; // y 轴数据项的值
        return '收到' + xValue + '封信的有' + yValue + '人';
      }
    }
  } else if (type === 'both'){
    option.tooltip = {
      formatter: function (params) {
        var xValue = params.name; // x 轴数据项的值
        var yValue = params.data; // y 轴数据项的值
        return '通信' + xValue + '封的有' + yValue + '人';
      }
    }
  }


  chart.setOption(option);
}


// Generate year options dynamically
var startYearSelect = document.getElementById("start-year");
var endYearSelect = document.getElementById("end-year");
var currentYear = new Date().getFullYear();

for (var year = currentYear; year >= 1900; year--) {
  var yearOption = document.createElement("option");
  yearOption.value = year;
  yearOption.text = year;
  startYearSelect.appendChild(yearOption);
  endYearSelect.appendChild(yearOption.cloneNode(true));
}

function filterByYear() {
  // Add your filtering logic here based on the selected start and end years
  var startYear = startYearSelect.value;
  var endYear = endYearSelect.value;
  var relationFilter = Array.from(document.getElementById("relation-filter").options)
    .filter(option => option.selected && option.value !== "all" && option.value !== "clear")
    .map(option => option.value);

  // Example: log the selected years to the console
  console.log("Start Year:", startYear);
  console.log("End Year:", endYear);
  console.log("通讯关系:", relationFilter);
}

function filter() {
  var filterBy = { '通讯关系': false, '作者生年': true, '作者卒年': true };
  var relationFtr = ['致书Y', '答Y书', '向Y致贺', '致Y啓', '代Y作文'];
  var birthYFtr = { 'startY': 1500, 'endY': 1601 };  // 含左不含右
  var deathYFtr = { 'startY': 1500, 'endY': 1601 };  // 含左不含右

  if (filterBy['通讯关系']) {
    filtered_data = filtered_data.filter(function (item) {
      return relationFtr.includes(item['通讯关系']);
    });
  }
  if (filterBy['作者生年']) {
    filtered_data = filtered_data.filter(function (item) {
      return !isNaN(item['作者生年']);
    });
    filtered_data = filtered_data.filter(function (item) {
      var birthYear = parseFloat(item['作者生年'].replace('≈', ''));
      return birthYFtr['startY'] <= birthYear && birthYear < birthYFtr['endY'];
    });
  }
  if (filterBy['作者卒年']) {
    filtered_data = filtered_data.filter(function (item) {
      return !isNaN(item['作者卒年']);
    });
    filtered_data = filtered_data.filter(function (item) {
      var deathYear = parseFloat(item['作者卒年'].replace('≈', ''));
      return deathYFtr['startY'] <= deathYear && deathYear < deathYFtr['endY'];
    });
  }

  var filtered_df = new DataFrame(filtered_data);
  // filtered_df.to_excel('data/filtered_data.xlsx', index=false);
}

// 过滤选项函数
function filterOptions() {
  var searchText = authorInput.value.toLowerCase();

  // 显示符合搜索条件的选项，隐藏其他选项
  Array.from(selectAuthor.options).forEach(function (option) {
    var author = option.value.toLowerCase();
    if (author.includes(searchText)) {
      option.style.display = 'block';
    } else {
      option.style.display = 'none';
    }
  });
}

function callSearch() {
  let searchText = document.getElementById('search_text').value.trim(); // 获取搜索词并去除首尾空格

  // 进行搜索
  let searchResults = Array.from(authors).filter(function (row) {
    return row.includes(searchText);
  });

  // 保存选中的结果到 JavaScript 元素
  let resultElement = document.getElementById('search_results');
  resultElement.textContent = JSON.stringify(searchResults);
}