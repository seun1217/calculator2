// need history entries that are caught on each eval
// one source of truth
// don't want the history to go infinite. once its length becomes 10, unshift and push
// cache에 일단 기록 후 history에 write
//
// 입력할 때 일단 cache에만 저장
// eval하면 history에 저장

// 애초에 e.currentTarget.innerText
var cache = '';
var history = [];
var evaluated = false;
var lastPressed = '';
const keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48];
const operators = ['+', '-', '*', '/'];
const inputButtons = document.querySelectorAll('.inputButton');
const numbButtons = document.querySelectorAll('numbButton');
const tabItems = document.querySelectorAll('.tabItem');
const equal = document.querySelector('.equal');
const display = document.querySelector('.display');
const divs = document.querySelectorAll('div');
const allClear = document.querySelector('.allClear');
const undo = document.querySelector('.undo');

const keyMap = { '*': '&times;', '/': '&divide;' };

// Utility function: Check Eval

function checkEval(_key) {
  if (evaluated) {
    evaluated = false;
    cache = _key;
  } else {
    cache += _key;
  }
}
// Operator를 입력했을 때 eval이 false로 안 돌아오고 있다.

// Let the things show on the display
function update() {
  console.log('lastPressed: ' + lastPressed);
  if (cache.length > 0) {
    display.innerHTML = cache.replace(/\/|\*/gi, match => keyMap[match]);
  } else {
    display.innerHTML = '0';
  }
}

// register user entry to the cache
function entryInput(e) {
  const targetText = e.currentTarget.innerText;
  //for Operator Buttons, add spaces around
  if ([...e.currentTarget.classList].includes('operButton')) {
    if (operators.filter(e => e === lastPressed).length > 0) {
      cache = cache.slice(0, cache.length - 3);
    }
    cache += ' ' + targetText + ' ';
    // 지금 버튼의 innerText를 cache에 넣고, 다시 display에 넣고 있는데 cache에는 그대로 넣고 display에는 다르게 넣고 싶은거잖아.
  } else {
    // 계산 직후 숫자 입력시 계산 결과를 덮어씌워버림
    checkEval(targetText);
  }
  lastPressed = targetText;
}
// once evaluated, pressing number will overrwite the display and register a new element in the history array

inputButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    entryInput(e);
    update();
  });
});

// add keyDown events
document.addEventListener('keypress', e => {
  console.log('keydown');
  console.log(e.keyCode);
  for (elem of keyCodes) {
    if (e.keyCode === elem) {
      lastPressed = e.key;
      checkEval(e.key);
    }
  }

  if (e.keyCode === 189) {
    cache += ' - ';
    lastPressed = e.key;
  }

  if (e.keyCode === 191) {
    cache += ' / ';
    lastPressed = e.key;
  }

  if (e.keyCode === 27) {
    clearAll();
  }

  if (e.keyCode === 8) {
    cache = cache.slice(0, cache.length - 1);
    if (cache.length > 0) {
      display.innerHTML = cache;
    } else {
      display.innerHTML = '0';
    }
  }

  update();
});

// can't get + to work with 'keydown' event
document.addEventListener('keypress', e => {
  if (e.key === '+') {
    cache += ' + ';
    lastPressed = e.key;
  }
  if (e.key === '*' && e.shiftKey) {
    cache += ' * ';
    lastPressed = e.key;
  }
  if (e.key === 'Equal' || e.keyCode === 13) {
    evalCalc();
  }
  update();
});

document.addEventListener('keydown', e => {
  if (e.keyCode === 8) {
    cache = cache.slice(0, cache.length - 1);
    if (cache.length > 0) {
      display.innerHTML = cache;
    } else {
      display.innerHTML = '0';
    }
  }
  if (e.keyCode === 27) {
    clearAll();
  }
});

// Assign Tab Indices
tabItems.forEach((item, ind) => {
  item.tabIndex = ind + 1;
});

// Evaluate by "="
// after eval, number entered will just overwrite current value on display
function evalCalc() {
  console.log('Evaluated!');
  const evalResult = eval(cache);
  display.innerHTML = evalResult;
  // history.push(cache);
  cache = String(evalResult);
  evaluated = true;
}

equal.addEventListener('click', evalCalc);

// AC for clear all
function clearAll() {
  cache = '';
  display.innerHTML = '0';
}

allClear.addEventListener('click', e => {
  console.log('AC working!');
  clearAll();
});

// Undo
// undo.document.addEventListener('click', () => {
//   history.pull();
//   cache = history[history.length - 1];
//   display.innerHTML = cache;
// });

// pressing operator after an operator has been already registered will overwrite the operator
// if nothing to display, display
