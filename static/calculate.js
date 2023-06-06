// var minBirthYear = 1299;
// var maxBirthYear = 1625;
// var minDeathYear = 1368;
// var maxDeathYear = 1694;
var minBirthYear = 1290, minDeathYear = 1290;
var maxBirthYear = 1700, maxDeathYear = 1700;

function createSlider(timelineId, left, year, labelId, markerId, selectionId, sliderId) {
    var timeline = document.getElementById(timelineId);
    var slider = document.createElement("div");
    slider.className = "slider";
    slider.style.left = left + "px";
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
    var startYear = Math.round(((startSlider.offsetLeft - axisRect.left) / (axisRect.width - startSlider.offsetWidth)) * (maxYear - minYear)) + minYear;
    var endYear = Math.round(((endSlider.offsetLeft - axisRect.left + endSlider.offsetWidth) / (axisRect.width - endSlider.offsetWidth)) * (maxYear - minYear)) + minYear;

    // 边界影响
    startYear = startYear + 54
    endYear = endYear + 45

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
    var maxPos = axisRect.width - slider.offsetWidth;
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
}

var birthTimeline = document.getElementById("birthTimeline");
var birthStartSlider = createSlider("birthTimeline", 100, minBirthYear, "birthStartLabel", "birthSelection", "birthStartSlider");
var birthEndSlider = createSlider("birthTimeline", birthTimeline.offsetWidth - 100, maxBirthYear, "birthEndLabel", "birthSelection", "birthEndSlider");

var deathTimeline = document.getElementById("deathTimeline");
var deathStartSlider = createSlider("deathTimeline", 100, minDeathYear, "deathStartLabel", "deathSelection", "deathStartSlider");
var deathEndSlider = createSlider("deathTimeline", deathTimeline.offsetWidth - 100, maxDeathYear, "deathEndLabel", "deathSelection", "deathEndSlider");


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
        var checkboxes = document.querySelectorAll('.check-box input[type="checkbox"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
    }
}


// 获取复选框元素
var checkboxes = document.querySelectorAll('.check-box input[type="checkbox"]');

// 添加事件监听器
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        if (!this.checked) {
            checkboxes[checkboxes.length - 1].checked = false;
        }
        filterDataBySelectedItems();
    });
});

checkboxes[checkboxes.length - 1].checked = true;

function filterDataBySelectedItems() {
    var selectedItems = document.querySelectorAll('.check-box input[type="checkbox"]:checked');
    var selectedValues = Array.from(selectedItems).map(function (item) {
        return item.value;
    });

    filteredData = data.filter(function (row) {
        return selectedValues.includes(row['通讯关系']);
    });

    updateData();
    updateGraph();
    updateBar("作者");
    return filteredData;
}


selectAllRelations();


// 获取 selectAuthor 元素
var authorInput = document.getElementById("authorInput");
var selectAuthor = document.getElementById("selectAuthor");

authorInput.oninput = filterOptions;
// 过滤选项的函数
function filterOptions() {
    var keyword = authorInput.value;
    selectAuthor.innerHTML = "";
    // 遍历 authors 集合并创建选项
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

selectAuthor.addEventListener("input", function() {
  selectNode(selectAuthor.value);
});


filterOptions();
updateData();
updateGraph();
updateBar("作者");