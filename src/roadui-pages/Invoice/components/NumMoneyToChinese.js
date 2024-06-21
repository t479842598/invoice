
export function useConvertNumMoneyToChinese(money) {
    /**
     * 将数字金额转换为中文金额表示
     * @param {number|string} money - 要转换的数字金额，可以是数字或数字字符串
     * @returns {string} 转换后的中文金额字符串
     */
    function MoneyToChinese(money) {
        // 定义中文数字和单位数组
        var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
        var cnIntRadice = new Array("", "拾", "佰", "仟");
        var cnIntUnits = new Array("", "万", "亿", "兆");
        var cnDecUnits = new Array("角", "分", "毫", "厘");
        var cnInteger = "整"; // 整数金额后缀
        var cnIntLast = "元"; // 整数部分最后的单位
        var maxNum = 999999999999999.9999; // 可处理的最大数字金额
        var IntegerNum; // 金额的整数部分
        var DecimalNum; // 金额的小数部分
        var ChineseStr = ""; // 中文金额字符串
        var parts; // 用于分割金额的数组
        var Symbol = ""; // 金额正负符号标记

        // 空字符串检查
        if (money == "") {
            return "";
        }

        // 转换为浮点数，处理正负号和超出最大值的情况
        money = parseFloat(money);
        if (money >= maxNum) {
            alert('超出最大处理数字');
            return "";
        }
        if (money < 0) {
            money = -money;
            Symbol = "负 ";
        }

        // 转换为字符串格式，准备处理
        money = money.toString();
        if (money.indexOf(".") == -1) {
            IntegerNum = money;
            DecimalNum = '';
        } else {
            parts = money.split(".");
            IntegerNum = parts[0];
            DecimalNum = parts[1].substr(0, 4);
        }

        // 处理整数部分
        if (parseInt(IntegerNum, 10) > 0) {
            var zeroCount = 0; // 用于处理连续零的情况
            var IntLen = IntegerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = IntegerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == "0") {
                    zeroCount++;
                }
                else {
                    if (zeroCount > 0) {
                        ChineseStr += cnNums[0];
                    }
                    zeroCount = 0;
                    ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    ChineseStr += cnIntUnits[q];
                }
            }
            ChineseStr += cnIntLast;
        }

        // 处理小数部分
        if (DecimalNum != '') {
            var decLen = DecimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = DecimalNum.substr(i, 1);
                if (n != '0') {
                    ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }

        // 添加整数标志和空字符串检查
        if (ChineseStr == '') {
            ChineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (DecimalNum == '') {
            ChineseStr += cnInteger;
        }
        ChineseStr = Symbol + ChineseStr;

        return ChineseStr;
    }

    return MoneyToChinese(money);
}
