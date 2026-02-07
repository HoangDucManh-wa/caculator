"use strict";
const display = document.querySelector(".display"); //tham chieu den display
const numbers = document.querySelectorAll(".number"); //tham chieu den cac con so
const operators = document.querySelectorAll(".operator"); //tham chieu den cac toan tu
let dis = 0; //dis quyết định xem có nên xóa hết dữ liệu ở display khong
//Neu dis=0 thì xóa hết dữ liệu ở ô display rồi ghi dữ liệu mới vào
//Nếu dis=1 thì giữa lại dữ liệu cũ và ghi thêm dữ liệu mới ở ô display
//
//gan su kien vao cho các number.
numbers.forEach((number) => {
  number.addEventListener("click", () => {
    if (dis === 0 || display.textContent == 0) {
      display.textContent = ""; //xóa hết dữ liệu cũ ở chỗ hiển thị
    }
    display.textContent += number.textContent; //Thêm dữ liệu mới vào
    dis = 1; //cho dis=1 để có thể viết các số liền nhau trên màn hình
  });
});
//Thêm sư kiện vào cho các toán tử
operators.forEach((operator) => {
  operator.addEventListener("click", () => {
    if (dis == 0) {
      display.textContent = "";
    }
    display.textContent += operator.textContent;
    dis = 1;
  });
});
const equal = document.querySelector(".equal"); //tham chiếu đến dấu "="
equal.addEventListener("click", () => {
  dis = 0; //
  //đánh dấu kết thúc một biểu thức, dữ liệu trên display ở biểu thức cũ sẽ bị xóa đi để dữ liệu của biểu thức sau ghi vào
  let expression = display.textContent; //bieu thuc nguoi dung nhap

  let arr = expression.match(/\d+|[+\-*/]/g); //tách biểu thức trên display thành một mảng chứa các số và toán tử
  //Kiểm tra xem biểu thức người dùng nhập đã hợp lệ chưa?
  //
  if (arr[0] == "/" || arr[0] == "*") {
    display.textContent = "Error"; //Nếu mở đầu bằng dấu nhân hay chia thì kết luận lỗi và return
    return;
  }
  if (isNaN(arr[arr.length - 1])) {
    display.textContent = "Error"; //Nếu phần tử cuối ko phải là số, kết luận lỗi
    return;
  }
  //Nếu dấu nhân hoặc chia đứng cạnh toán tử khác, kết luận lỗi
  if (arr.length > 1) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (
        (isNaN(arr[i]) && (arr[i + 1] == "*" || arr[i + 1] == "/")) ||
        (isNaN(arr[i + 1]) && (arr[i] == "*" || arr[i] == "/"))
      ) {
        display.textContent = "Error";
        return;
      }
    }
  }
  //Sau khi chắc chắn không còn lỗi nữa bắt đầu bước tính toán
  //
  //làm đơn giản lại mảng arr
  let arr2 = []; //mảng arr2 là mảng rút gọn từ mảng arr để làm giảm độ phức tạp
  //vd:arr=['-','-',2,'+','-','3']->arr2=['-','-2','+','-3']
  let t = 0; //dinh vi phan tu thu t cua arr2
  let x; // dấu '+' hoặc '-' của phần tử khi từ arr sang arr2, ví dụ: arr=['-','-',3]->arr2=['-','-3(=3*x)'], x ở ví dụ này là -1
  for (let i = 0; i < arr.length; i++) {
    if (!(arr[i] == "+" || arr[i] == "-")) {
      //Nếu ko phải là '+' hay '-' thì bê nguyên phần tử đó từ arr sang arr2
      arr2[t] = arr[i];
      t++;
    } else {
      //nếu xuất hiện dấu "+" hay dấu "-" thì kiểm tra xem tiếp theo có xuát hiện dấu "+" hay dấu "-" tiếp không, nếu có thì sẽ rút gọn lại, vd: --+++7 -> -(-7)
      x = 1; //quyết định dấu của phần tử được đưa vào arr2
      arr2[t++] = arr[i];

      i++;
      //xử lý TH nếu có các dấu "+" và "-" liên tiếp nhau.
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
  console.log(arr2); //in ra arr2 để coder biết arr2 đã đúng chưa
  //Giải quyết vấn đề nhân chia trước, cộng trừ sau
  //Hướng đi: đưa biểu thức chứa cả phép nhân(chia),cộng(trừ) thành biểu thức chỉ có cộng, trừ
  let arr3 = Array(t).fill(0); //cho arr3 là mảng có độ ddài bằng arr2, nếu arr3[i]=0 thì phần tử arr2[i] liên quan đến phép "+,-", arr3[i]=1 thì arr2[i] liên quan đến phép nhân,chia
  let arr4 = []; //mảng để chứa các kết quả của biểu  nhân chia
  //vd:biểu thức: -5+3*2+6+1*2 thì arr4=[6,2];
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] == "*" || arr2[i] == "/") {
      arr3[i - 1] = 1; //những số hạng gắn với nhân, chia đều được đánh dấu riêng
      arr3[i + 1] = 1;
      if (arr2[i] == "*") {
        x = Number(arr2[i - 1]) * Number(arr2[i + 1]);
      } else {
        x = Number(arr2[i - 1]) / Number(arr2[i + 1]);
      }
      i += 2; //tăng i 2 đơn vị, bởi sau dấu nhân hoặc chia thì chắc chắn đó là một số hạng chứa không phải một toán tử, đúng hơn là sau bước làm đơn giản arr thì arr2 sẽ ko chứa hai toán tử liên tiếp kề nhau trong cùng một mảng
      //xử lý TH nhân chia liên tiếp, vd: 3*3/1*4
      while (i < arr2.length && (arr2[i] == "*" || arr2[i] == "/")) {
        if (arr2[i] == "*") {
          x *= Number(arr2[i + 1]);
        } else {
          x /= Number(arr2[i + 1]);
        }
        arr3[i + 1] = 1;
        i += 2;
      }
      arr4.push(x); //Thêm kết quả từ biểu thức nhân chia vào mảng arr4
    }
  }
  console.log(arr4);
  //sau khi qua bước này, ta sẽ xử lý biểu thức gồm nhân chia cộng trừ như một biểu thức chỉ chứa cộng, trừ
  //
  let result = 0; //kết quả cuối cùng hiển thị trên display
  let index = 0; //chỉ số của arr2
  let index_arr4 = 0; //chỉ số của arr4
  //Xét phần tử đầu tiển của arr2, xem là toán tử hay là số hạng->chọn result
  if (arr2[index] == "+") {
    index++;
    if (arr3[index] == 0) {
      //liên quan đến phép cộng trừ, lấy tiếp của arr2
      result = Number(arr2[index]);
    } else {
      //liên quan đến nhân chia, bỏ qua phần tử đó của arr2 nhảy sang bên arr4
      result = Number(arr4[index_arr4]);
      index_arr4++;
    }
    index++;
  } else if (arr2[index] == "-") {
    index++;
    if (arr3[index] == 0) {
      result = -Number(arr2[index]);
    } else {
      result = -Number(arr4[index_arr4]);
      index_arr4++;
    }
    index++;
  } else {
    //Nếu phần tử đầu là số hạng
    if (arr3[index] == 0) {
      result = Number(arr2[index]);
    } else {
      result = Number(arr4[index_arr4]);
      index_arr4++;
    }
    index++;
  }
  //duyệt các phần tử trong arr2, chỉ tính các phép cộng trừ thôi, phép nhân, chia thì ta đã gộp lại rồi
  /*vd1: arr2=[3,"*",'2','+',6];->arr3=[1,0,1,0,0],arr4=[6],result ban đầu=6
  duyệt arr2, đến dấu '+' thì result+=arr2[4]->result=6+6=12*/
  /*
  vd2: arr2=[1,'+',3,"*",4]->arr3=[0,0,1,0,1],arr4=[12],result ban đầu=1;
  duyệt arr2, đến dấu +, kiểm tra xem arr3[2]
  arr3[2]==1-> result+=arr4[0]->result=1+12=13,
  */
  for (let i = index; i < arr2.length; i++) {
    if (arr2[i] == "+") {
      //kiểm tra arr3[i+1] để quyết định cộng result với arr2[i+1] hay arr4[index_arr4]
      if (arr3[i + 1] == 0) {
        result += Number(arr2[i + 1]);
      } else {
        result += Number(arr4[index_arr4]);
        index_arr4++;
      }
    }
    if (arr2[i] == "-") {
      //kiểm tra arr3[i+1] để quyết định trừ result với arr2[i+1] hay arr4[index_arr4]
      if (arr3[i + 1] == 0) {
        result -= Number(arr2[i + 1]);
      } else {
        result -= Number(arr4[index_arr4]);
        index_arr4++;
      }
    }
  }
  console.log(result);
  display.textContent = result;
});
