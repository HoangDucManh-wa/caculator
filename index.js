"use strict";
const display = document.querySelector(".display");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
let dis = 0; //dis quyet dinh xem co nen xoa het du lieu o display khong
numbers.forEach((number) => {
  number.addEventListener("click", () => {
    if (dis === 0 || display.textContent == 0) {
      display.textContent = "";
    }
    display.textContent += number.textContent;
    dis = 1;
  });
});
operators.forEach((operator) => {
  operator.addEventListener("click", () => {
    if (dis === 0) {
      display.textContent = "";
    }
    display.textContent += operator.textContent;
    dis = 1;
  });
});
const equal = document.querySelector(".equal");
equal.addEventListener("click", () => {
  dis = 0;
  let expression = display.textContent;
  let arr = expression.match(/\d+|[+\-*/]/g);
  console.log(arr);
  //kiem tra co loi ko
  if (arr[0] == "/" || arr[0] == "*") {
    display.textContent = "Error";

    return;
  }
  if (isNaN(arr[arr.length - 1])) {
    display.textContent = "Error";
    return;
  }
  if (arr.length > 1) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (isNaN(arr[i]) && (arr[i + 1] == "*" || arr[i + 1] == "/")) {
        display.textContent = "Error";
        return;
      }
    }
  }
  //tinh toan
  let arr2 = [];
  let t = 0; //dinh vi phan tu thu t cua arr2
  let x;
  for (let i = 0; i < arr.length; i++) {
    if (!(arr[i] == "+" || arr[i] == "-")) {
      arr2[t] = arr[i];
      t++;
    } else {
      x = 1;
      arr2[t++] = arr[i];

      i++;
      while (i < arr.length && (arr[i] == "+" || arr[i] == "-")) {
        if (arr[i] == "+") {
          x *= 1;
        } else {
          x *= -1;
        }
        i++;
      }
      arr2[t++] = x * arr[i];
    }
  }
  console.log(arr2);
  let arr3 = Array(t).fill(0);
  let arr4 = [];
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] == "*" || arr2[i] == "/") {
      arr3[i - 1] = 1;
      arr3[i + 1] = 1;
      if (arr2[i] == "*") {
        x = arr2[i - 1] * arr2[i + 1];
      } else {
        x = arr2[i - 1] / arr2[i + 1];
      }
      i += 2;
      while (i < arr2.length && (arr2[i] == "*" || arr2[i] == "/")) {
        if (arr2[i] == "*") {
          x *= arr2[i + 1];
        } else {
          x /= arr2[i + 1];
        }
        arr3[i + 1] = 1;
        i += 2;
      }
      arr4.push(x);
    }
  }
  console.log(arr4);

  let result = 0;
  let index = 0;
  let index_arr4 = 0;
  if (arr2[index] == "+") {
    index++;
    result = arr2[index];
  } else if (arr2[index] == "-") {
    index++;
    result = -arr2[index];
  } else {
    if (arr3[index] == 0) {
      result = arr2[index];
    } else {
      result = arr4[index];
    }
    index++;
  }
  for (let i = index; i < arr2.length; i++) {
    if (arr2[i] == "+") {
      if (arr3[i + 1] == 0) {
        result += arr2[i + 1];
      } else {
        result += arr4[index_arr4];
      }
    }
    if (arr2[i] == "-") {
      if (arr3[i + 1] == 0) {
        result -= arr2[i + 1];
      } else {
        result -= arr4[index_arr4];
      }
    }
  }
  console.log(result);
  display.textContent = result;
});
