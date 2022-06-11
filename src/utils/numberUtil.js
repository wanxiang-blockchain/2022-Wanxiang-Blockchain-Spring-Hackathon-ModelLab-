// 保留输入 number 的小数点后 4 位
export function StandardNum(num) {
    return Number(Math.floor(Number(num) * 10000) / 10000);
}

export function NonNegative(num) {
    return num < 0.0 ? 0.0 : num;
}