// 随机生成指定长度的字符串（默认长度为 32）
export function randomString(e) {    
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    let a = t.length;
    let n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}