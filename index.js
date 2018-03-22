/*
  ＳＵＤＯＫＵ
  Tatu Arvela, 2018
*/

String.prototype.replaceAt = function (index, char) {
  var a = this.split("");
  a[index] = char;
  return a.join("");
}

function generateInputGrid() {
  for (i = 1; i <= 9; i++) {
    var newRow = document.createElement('div');
    newRow.setAttribute('id', 'row-' + i);
    newRow.setAttribute('class', 'row');
    document.getElementById('grid').appendChild(newRow);
    for (j = 1; j <= 9; j++) {
      var newCell = document.createElement('input');
      newCell.setAttribute('id', ((i - 1) * 9) + j);
      newCell.setAttribute('class', 'cell');
      newCell.setAttribute('type', 'text');
      newCell.setAttribute('maxlength', '1');
      document.getElementById('row-' + i).appendChild(newCell);
    }
  }
}

function getCellValues() {
  var input = '';
  for (i = 1; i <= 81; i++) {
    var rawValue = document.getElementById(i).value;
    var value = (parseInt(rawValue) > 0) ? rawValue : '.';
    input += value;
  }
  return input;
}

function setCellValues(values) {
  var outputValues = values.split('');
  for (i = 1; i <= 81; i++) {
    var value = parseInt(outputValues[i - 1]) || 0;
    var element = document.getElementById(i);
    element.value = value;
    setNumberImage(element, value);
  }
  updateBrainAnimation();
}




function setNumberImage(element, value) {
  if (value > 0)
    element.style.backgroundImage = 'url("' + value + '.png")';
  else
    element.style.backgroundImage = 'none';
}

function updateBrainAnimation() {
  var cells = document.getElementsByClassName('cell');
  var hints = 0;
  for (i = 1; i <= 81; i++) {
    var value = parseInt(cells[i - 1].value);
    if (value > 0)
      hints++;
  }

  if (hints >= 15)
    document.getElementById('brain').classList.add('active');
  else
    document.getElementById('brain').classList.remove('active');
}



var solver = sudoku_solver();

function hint() {
  var cellValues = getCellValues()
  var firstEmpty = cellValues.indexOf('.');
  if (firstEmpty >= 0) {
    var value = solver(cellValues)[0][firstEmpty];
    var element = document.getElementById(firstEmpty + 1);

    element.value = value;
    setNumberImage(element, value);
  }
}

function solve() {
  var solution = solver(getCellValues());

  if (solution.length == 0) {
    console.log('No solutions')
    return false;
  }
  if (solution.length == 1) {
    console.log('Unique solution')
  }
  if (solution.length > 1) {
    console.log('Multiple solutions')
  }

  var parsedSolution = solution[0].join('');
  setCellValues(parsedSolution);
}

function clear() {
  empty = '';
  for (i = 0; i < 81; i++)
    empty += '.';
  setCellValues(empty)
}



var keycodeMap = {
  // Empty
  32: ' ',
  // Number keys
  49: 1, 50: 2, 51: 3,
  52: 4, 53: 5, 54: 6,
  55: 7, 56: 8, 57: 9,
  // Numpad
  97: 1, 98: 2, 99: 3,
  100: 4, 101: 5, 102: 6,
  103: 7, 104: 8, 105: 9,
  // Letters to numbers
  65: 1, 66: 2, 67: 3,
  68: 4, 69: 5, 70: 6,
  71: 7, 72: 8, 73: 9
}

var cellToReturnTo = 81;

var buttonToReturnTo = 'hint';

function handleCellKeypress(event) {
  var active = parseInt(document.activeElement.id);
  var curr = event.target;
  var currId = parseInt(curr.id.substring(1))

  switch (true) {
    // Arrow keys
    case (event.keyCode === 37): // left
      var next = document.getElementById(active - 1)
      if (next != null)
        next.focus();
      break;
    case (event.keyCode === 38): // up
      var next = document.getElementById(active - 9)
      if (next != null)
        next.focus();
      break;
    case (event.keyCode === 39): // right
      var next = document.getElementById(active + 1)
      if (next != null)
        next.focus();
      break;
    case (event.keyCode === 40): // down
      var next = document.getElementById(active + 9)
      if (next != null) {
        next.focus();
      }
      else {
        cellToReturnTo = active;
        document.getElementById(buttonToReturnTo).focus();
      }
      break;

    // Backspace
    case (event.keyCode == 8 || event.keyCode == 46):
      curr.value = ' ';
      setNumberImage(curr, -1);
      updateBrainAnimation();
      var next = document.getElementById(active - 1);
      if (next != null) {
        next.focus();
      }
      event.preventDefault();
      break;

    // Numbers
    case (keycodeMap[event.keyCode] != null):
      curr.value = keycodeMap[event.keyCode];
      setNumberImage(curr, keycodeMap[event.keyCode]);
      updateBrainAnimation();
      var next = document.getElementById(active + 1);
      if (next != null) {
        next.focus();
      }
      event.preventDefault();
      break;

    case (event.keyCode == 27 || event.keyCode == 9):
      break;

    default:
      curr.value = ' ';
      setNumberImage(curr, -1);
      break;
  }
}

function registerCellHandlers() {
  var cells = document.getElementsByClassName('cell');
  for (var i = 0; i < cells.length; i++) {
    cells[i].onkeydown = handleCellKeypress;
    cells[i].addEventListener("focusout", function (event) {
      cellToReturnTo = event.target.id;
    });
  }
}

function registerButtonHandlers() {
  document.getElementById('hint').onclick = hint;
  document.getElementById('solve').onclick = solve;
  document.getElementById('clear').onclick = clear;

  var buttons = document.getElementsByClassName('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onkeydown = function (event) {
      active = document.activeElement.id;
      switch (event.keyCode) {
        case 37:
          if (active === 'solve')
            document.getElementById('hint').focus();
          else if (active === 'clear')
            document.getElementById('solve').focus();
          break;

        case 38:
          document.getElementById(cellToReturnTo).focus();
          break;

        case 39:
          if (active === 'hint')
            document.getElementById('solve').focus();
          else if (active === 'solve')
            document.getElementById('clear').focus();
          break;
      }
    }

    buttons[i].addEventListener("focusout", function (event) {
      buttonToReturnTo = event.target.id;
    });
  }
}



generateInputGrid();
registerCellHandlers();
registerButtonHandlers();