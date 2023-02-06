import config from '@/config'
import modal from '@/plugins/modal.js'
// import { Message } from "element-ui";
// 数字金额转大小学
export function moneyToChinese(money) {
  //汉字的数字
  let cnNums = new Array(
    "零",
    "壹",
    "贰",
    "叁",
    "肆",
    "伍",
    "陆",
    "柒",
    "捌",
    "玖"
  );
  //基本单位
  let cnIntRadice = new Array("", "拾", "佰", "仟");
  //对应整数部分扩展单位
  let cnIntUnits = new Array("", "万", "亿", "兆");
  //对应小数部分单位
  let cnDecUnits = new Array("角", "分", "毫", "厘");
  //整数金额时后面跟的字符
  let cnInteger = "";
  //整型完以后的单位
  let cnIntLast = "";
  //最大处理的数字
  let maxNum = 999999999999999.9999;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = "";
  //分离金额后用的数组，预定义
  let parts;
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return "";
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf(".") == -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    let IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast + "圆";
  }
  //小数部分
  if (decimalNum != "") {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n != "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      } else if (n == "0") {
        chineseStr += cnNums[Number(n)];
      }
    }
  }
  if (chineseStr == "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == "") {
    chineseStr += cnInteger + "整";
  }
  return chineseStr;
}
// 表格必填验证 通过：false ，不通过：true
export function valiDate(e,tableData/* { columns, tableData } */) {
	console.log('-----',e)
	let tableCloumn = e.trChildren
	console.log('--tableCloumn---',tableCloumn)
  if(tableCloumn.length <= 1){
		modal.msgError(`未添加明细！`)
    return true
  } 
	let columns = tableCloumn[1].$children
	console.log('--columns---',columns)

  let colFilter = columns
    .filter((ele) => {
      return ele?.$attrs?.required;
    })
    .map((item) => {
      return {
        [item?.$attrs?.required?.prop]: item?.$attrs?.required?.label,
      };
    });
	console.log('--colFilter---',colFilter)
  console.log(tableData, "tableData");
  return tableData.some((ele) => {
    return colFilter.some((item) => {
      let key = Object.keys(item)[0];
      if (ele[key] == '' || ele[key] == null || ele[key] == undefined) {
        modal.msgError(`${item[key]}不能为空！`)
        return true;
      }
    });
  });
}
/* 电话验证规则 */
export function checkPhone(rule, value, data, callback){
  if (!value) {
    return callback('联系电话不能为空');
  }
  let isPhone = new RegExp("^1[34578][0-90{9}$]",'i')
  if(value.length < 11){
    return callback('请输入正确的手机号码');
  }
  else if( isPhone.test(value) ){
    return true
  }else{
    return callback('请输入正确的手机号码');
  } 
}
/* 邮箱验证规则 */
export function checkEmail(rule, value, callback){
  if (!value) {
    return callback(new Error('邮箱不能为空'));
  }
  setTimeout(() => {
    let isPhone = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$", 'i')
    console.log('isphone1=>',isPhone);
    if( isPhone.test(value) ){
      callback();
    }else{
      callback(new Error('请输入正确的邮箱格式'));
    } 
  }, 1000);
}
/* 时间计算 */
export function dateCalc (type, start, end){
  // console.log('utils-接收->',type, start, end)
  if(type == 'year'){
    let arr = []
    let i = start
    while( i <= end){
      arr.push(start++)
      i++
    }
    // console.log('utils内部--arr-->',arr)
    return arr
  }else{
    let startArr = start.split('-');
    let startM = parseInt(startArr[0]) * 12 + parseInt(startArr[1]);
    let endYM = end.split('-');
    let endM = parseInt(endYM[0]) * 12 + parseInt(endYM[1]);
    const monthDiffer = Math.abs(startM - endM);//月份相差
    // console.log('相差月份->',monthDiffer)
    let i = 0;
    let arr = [];

    if(type == 'monthrange'){
      while( i <= monthDiffer){
        if(startArr[1] >12){
          startArr[0]++
          startArr[1] = 1
        }
        arr.push( startArr[0] + '-' +( Number(startArr[1])>=10 ? '' : '0' )+ startArr[1]++)
        i++
      }
      // console.log('utils内部--arr-->',arr)
      return arr
    }else if(type == 'daterange'){
      const sDate = Date.parse(start)
      const eDate = Date.parse(end)
      if (sDate > eDate) {
        return 0
      }
      if (sDate === eDate) {
        return 1
      }
      const dayDiffer = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000);//天数相差
      // console.log('相差天数-》',dayDiffer)
      
      // console.log(startArr,'days')
      let yearView = startArr[0]
      let monthView = startArr[1]
      let dateView = startArr[2]
      if( monthDiffer > 0){
        let nowYear = yearView
        let nowMonth =  monthView
        while(i <= dayDiffer){
          let nowDays = new Date(nowYear + '-' + nowMonth);
          nowDays.setMonth( nowMonth );//当前月
          nowDays.setDate(0);
          let days = nowDays.getDate();//当月天数
          // console.log('当月天数',days)
          if( dateView > days){
            dateView = 1
          }
          arr.push(dateView++)
          i++
        }
      }else{
        let nowDays = new Date(start);
        nowDays.setMonth( monthView-1);//当前月
        nowDays.setDate(0);
        let days = nowDays.getDate();//当月天数
        let j = 0;// j表示相差天数
        while( j <= dayDiffer ){
          if( dateView > days){
            dateView = 1
          }
          arr.push( (dateView >= 10 ? '' : '0') + dateView++ )
          j++
        }
      }
  
      return arr
    }
  }
  
}

/* 返回服务器文件路径 */
export function fileUrl (filePath,isDown){
	let baseURL = config.baseUrl
  // let baseURL = process.env.VUE_APP_BASE_API
  let path = filePath.split('uploadPath')
  let imageUrl;

  if(baseURL.indexOf('dev-api') || baseURL.indexOf('prod-api')){
    let sysurl = baseURL.split('/dev-api')
    sysurl = baseURL.split('/prod-api')
    imageUrl = sysurl[0] +  "/uploadPath"  +  path[path.length - 1]
  }else{
    imageUrl = baseURL + "/uploadPath/"  + path[path.length - 1]
  }
  return imageUrl
}

// 验证对象是否为空
export function checkObject(rule, value, data, callback){
	if (Object.keys(value).length === 0) {
	    return callback('请输入下一步审批人'); // 如果为空,返回false
	}
	return true 
}
