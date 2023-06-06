let selectLettersDiv = document.getElementById('selectedLetters');
let selectedLettersTableBody = document.getElementById('selectedLettersTableBody');
let paginationDiv = document.getElementById('pagination');

let selectedRows = []

// 分页参数
let currentPage = 1;
let rowsPerPage = 20;

// 更新选中节点信息的函数
function updateSelectedLetters() {
  // 计算当前页的起始索引和结束索引
  let startIndex = (currentPage - 1) * rowsPerPage;
  let endIndex = startIndex + rowsPerPage;

  // 清空表格内容
  selectedLettersTableBody.innerHTML = '';

  // 更新表格内容
  for (let i = startIndex; i < endIndex && i < selectedRows.length; i++) {
    let row = selectedRows[i];
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${row.作品标题}</td>
      <td>${row.通讯人}</td>
      <td>${row.通讯关系}</td>
    `;
    selectedLettersTableBody.appendChild(newRow);
  }

  // 更新分页
  updatePagination(selectedRows.length);
}

// 更新分页函数
function updatePagination(totalRows) {
  // 计算总页数
  let totalPages = Math.ceil(totalRows / rowsPerPage);

  // 清空分页内容
  paginationDiv.innerHTML = '';

  // 添加页码按钮
  for (let i = 1; i <= totalPages; i++) {
    let pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', function() {
      currentPage = i;
      updateSelectedLetters();
    });
    paginationDiv.appendChild(pageButton);
  }
}

// 初始化时更新选中节点信息
updateSelectedNodeInfo();
