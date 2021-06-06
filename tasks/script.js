const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

let updatedOnLoad = false;

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;
let dragging = false;

function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = [];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];
  }
}


function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  })
}

function filterArray(array) {
  console.log(array);
  const filteredArray = array.filter(item => item !== null);
  console.log(filteredArray);
  return filteredArray;
}

function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item', 'col');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;   
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  columnEl.appendChild(listEl);
}


function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray)

  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray)

  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray)

  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray)

  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, colum) {
  const selectedArray = listArrays[colum];
  const selectedColumnEl = listColumns[colum].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    }
    else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    console.log(selectedArray);
    updateDOM();
  }
}

function addToColumn(colum) {
  const itemText = addItems[colum].textContent;
  const selectedArray = listArrays[colum];
  selectedArray.push(itemText);
  addItems[colum].textContent = '';
  updateDOM();
}

function showInputBox(colum) {
  addBtns[colum].style.visibility = 'hidden';
  saveItemBtns[colum].style.display = 'flex';
  addItemContainers[colum].style.display = 'flex';
}

function hideInputBox(colum) {
  addBtns[colum].style.visibility = 'visible';
  saveItemBtns[colum].style.display = 'none';
  addItemContainers[colum].style.display = 'none';
  addToColumn(colum);
}


function rebuildArrays() {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  listColumns[column].classList.add('over')
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();

  listColumns.forEach((column) => {
    column.classList.remove('over');
  });

  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

  dragging = false;
  rebuildArrays();
}

updateDOM();
