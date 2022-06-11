// 异步的休眠
export function Sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
// 同步的休眠 前端页面可能会处于不可操作的阶段
// function Sleep(millisecond) {
//     let now = new Date();
//     let exitTime = now.getTime() + millisecond;
//     while(true) {
//         now = new Date();
//         if (now.getTime() > exitTime)
//             return;
//     }
// }