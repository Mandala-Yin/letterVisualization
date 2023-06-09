// var minBirthYear = 1299;
// var maxBirthYear = 1625;
// var minDeathYear = 1368;
// var maxDeathYear = 1694;
var minBirthYear = 1290, minDeathYear = 1290;
var maxBirthYear = 1700, maxDeathYear = 1700;

var birthStartYear = minBirthYear, birthEndYear = maxBirthYear;
var deathStartYear = minDeathYear, deathEndYear = maxDeathYear;

function createSlider(timelineId, left, year, labelId, markerId, selectionId, sliderId) {
    var timeline = document.getElementById(timelineId);
    var slider = document.createElement("div");
    slider.className = "slider";
    slider.style.left = left + "px";
    console.log(left)
    slider.setAttribute("draggable", "true");
    slider.id = sliderId; // 添加滑块的唯一标识符
    slider.addEventListener("drag", handleSliderDrag);
    slider.addEventListener("dragend", handleSliderDragEnd);
    slider.style.color = 'rgb(81,59,39)';

    var yearLabel = document.createElement("div");
    yearLabel.className = "year-label";
    document.getElementById(labelId).appendChild(yearLabel);

    var yearMarker = document.createElement("div");
    yearMarker.className = "year-marker";
    document.getElementById(markerId).appendChild(yearMarker);

    var selection = document.getElementById(selectionId);

    timeline.appendChild(slider);

    return { slider, selection, yearLabel };
}

function calculateYear(timelineId, startLabelId, endLabelId, startMarkerId, endMarkerId, selectionId, startSlider, endSlider, startYearLabel, endYearLabel, minYear, maxYear) {
    var timeline = document.getElementById(timelineId);
    var axisRect = timeline.getBoundingClientRect();
    var startYear = Math.round((startSlider.offsetLeft / axisRect.width) * (maxYear - minYear)) + minYear;
    var endYear = Math.round((endSlider.offsetLeft / axisRect.width) * (maxYear - minYear)) + minYear;

    if (timelineId == "birthTimeline") {
        birthStartYear = startYear;
        birthEndYear = endYear;
    } else if (timelineId == "deathTimeline") {
        deathStartYear = startYear;
        deathEndYear = endYear;
    }

    // startYearLabel.innerText = startYear;
    // endYearLabel.innerText = endYear;

    var startMarker = document.getElementById(startMarkerId);
    var endMarker = document.getElementById(endMarkerId);
    startMarker.innerText = startYear;
    endMarker.innerText = endYear;

    var selection = document.getElementById(selectionId);
    selection.style.left = startSlider.offsetLeft + "px";
    selection.style.width = (endSlider.offsetLeft - startSlider.offsetLeft + endSlider.offsetWidth) + "px";
}

function handleSliderDrag(e) {
    var slider = e.target;
    var sliderId = slider.id; // 获取滑块的唯一标识符
    var axisRect = slider.parentNode.getBoundingClientRect();
    var minPos = 0;
    var maxPos = axisRect.width;
    var offsetX = e.clientX - axisRect.left;
    var newPos = offsetX - (slider.offsetWidth / 2);

    if (newPos < minPos) {
        newPos = minPos;
    }

    if (newPos > maxPos) {
        newPos = maxPos;
    }

    if (e.clientX != 0)
        slider.style.left = newPos + "px";

    if (sliderId === "birthStartSlider" || sliderId === "birthEndSlider") {
        calculateYear(
            "birthTimeline",
            "birthStartLabel",
            "birthEndLabel",
            "birthStartMarker",
            "birthEndMarker",
            "birthSelection",
            birthStartSlider.slider,
            birthEndSlider.slider,
            birthStartSlider.yearLabel,
            birthEndSlider.yearLabel,
            minBirthYear,
            maxBirthYear
        );
    } else if (sliderId === "deathStartSlider" || sliderId === "deathEndSlider") {
        calculateYear(
            "deathTimeline",
            "deathStartLabel",
            "deathEndLabel",
            "deathStartMarker",
            "deathEndMarker",
            "deathSelection",
            deathStartSlider.slider,
            deathEndSlider.slider,
            deathStartSlider.yearLabel,
            deathEndSlider.yearLabel,
            minDeathYear,
            maxDeathYear
        );
    }
}

function handleSliderDragEnd(e) {
    calculateYear(
        "birthTimeline",
        "birthStartLabel",
        "birthEndLabel",
        "birthStartMarker",
        "birthEndMarker",
        "birthSelection",
        birthStartSlider.slider,
        birthEndSlider.slider,
        birthStartSlider.yearLabel,
        birthEndSlider.yearLabel,
        minBirthYear,
        maxBirthYear
    );

    calculateYear(
        "deathTimeline",
        "deathStartLabel",
        "deathEndLabel",
        "deathStartMarker",
        "deathEndMarker",
        "deathSelection",
        deathStartSlider.slider,
        deathEndSlider.slider,
        deathStartSlider.yearLabel,
        deathEndSlider.yearLabel,
        minDeathYear,
        maxDeathYear
    );
    filterData();
}

var birthTimeline = document.getElementById("birthTimeline");
var birthStartSlider = createSlider("birthTimeline", 0, minBirthYear, "birthStartLabel", "birthSelection", "birthStartSlider");
var birthEndSlider = createSlider("birthTimeline", birthTimeline.offsetWidth, maxBirthYear, "birthEndLabel", "birthSelection", "birthEndSlider");

var deathTimeline = document.getElementById("deathTimeline");
var deathStartSlider = createSlider("deathTimeline", 0, minDeathYear, "deathStartLabel", "deathSelection", "deathStartSlider");
var deathEndSlider = createSlider("deathTimeline", deathTimeline.offsetWidth, maxDeathYear, "deathEndLabel", "deathSelection", "deathEndSlider");


calculateYear(
    "birthTimeline",
    "birthStartLabel",
    "birthEndLabel",
    "birthStartMarker",
    "birthEndMarker",
    "birthSelection",
    birthStartSlider.slider,
    birthEndSlider.slider,
    birthStartSlider.yearLabel,
    birthEndSlider.yearLabel,
    minBirthYear,
    maxBirthYear
);

calculateYear(
    "deathTimeline",
    "deathStartLabel",
    "deathEndLabel",
    "deathStartMarker",
    "deathEndMarker",
    "deathSelection",
    deathStartSlider.slider,
    deathEndSlider.slider,
    deathStartSlider.yearLabel,
    deathEndSlider.yearLabel,
    minDeathYear,
    maxDeathYear
);


function selectAllRelations() {
    var selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox.checked) {
        var checkboxes = document.querySelectorAll('#check-box-1 input[type="checkbox"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
    }
}


var checkboxes1 = document.querySelectorAll('#check-box-1 input[type="checkbox"]');
checkboxes1.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        if (!this.checked) {
            checkboxes1[checkboxes1.length - 1].checked = false;
        }
        filterData();
    });
});
checkboxes1[checkboxes1.length - 1].checked = true;

// 获取复选框元素
var checkboxes2 = document.querySelectorAll('#check-box-2 input[type="checkbox"]');
// 添加事件监听器
checkboxes2.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        if (checkboxes2[0].checked && checkboxes2[1].checked) {
            updateBar("both");
        } else if (checkboxes2[0].checked) {
            updateBar("作者")
        } else if (checkboxes2[1].checked) {
            updateBar("收信者")
        } else {
            updateBar("none")
        }
    });
});
checkboxes2[0].checked = checkboxes2[1].checked = true;

function filterData() {
    var selectedItems = document.querySelectorAll('#check-box-1 input[type="checkbox"]:checked');
    var selectedValues = Array.from(selectedItems).map(function (item) {
        return item.value;
    });

    filteredData = data.filter(function (row) {
        var flag = true;
        flag = flag && selectedValues.includes(row['通讯关系']);
        if (row['作者生年'] !== '') {
            flag = flag && row['作者生年'] >= birthStartYear && row['作者生年'] <= birthEndYear;
        }
        if (row['作者卒年'] !== '') {
            flag = flag && row['作者卒年'] >= deathStartYear && row['作者卒年'] <= deathEndYear;
        }
        return flag;
    });

    updateData();
    updateGraph();
    updateBar("both");
    return filteredData;
}

// 获取 selectAuthor 元素
var authorInput = document.getElementById("authorInput");
var selectAuthor = document.getElementById("selectAuthor");

authorInput.oninput = filterOptions;
// 过滤选项的函数
function filterOptions() {
    var keyword = authorInput.value;
    selectAuthor.innerHTML = "";

    var blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.text = "";
    selectAuthor.appendChild(blankOption);

    authors.forEach(function (author) {
        if (author.includes(keyword)) {
            // 创建选项元素
            var option = document.createElement("option");
            // 设置选项的值为作者名称
            option.value = author;
            // 设置选项的显示文本为作者名称
            option.text = author;
            // 将选项添加到 selectAuthor 元素中
            selectAuthor.appendChild(option);
        }
    });
}

selectAuthor.addEventListener("input", function () {
    if(selectAuthor.value == "")
        return;
    selectNode(selectAuthor.value);
    myChart.dispatchAction({
        type: 'highlight',
        name: selectAuthor.value, // 数据点的名称
        itemStyle: {
            borderWidth: 3,
            borderColor: 'yellow',
            shadowBlur: 10,
            shadowColor: 'yellow'
        }
    });
});

selectAllRelations();
filterOptions();
updateData();
updateGraph();
updateBar("both");