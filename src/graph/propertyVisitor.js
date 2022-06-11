import { TimeContext, RoleContext, ExprContext } from "../parser/PropertyParser";
export class PropertyVisitor {
    constructor(endDay, data, nodes) {
      this.state = 0;
      this.endDay = endDay;
      this.data = data;
      this.nodes = new Set();
      for (let item of nodes) {
          this.nodes.add(item.label);
      }
      this.node = "";
      this.role = "";
    }
  
    visitChildren(ctx) {
      
      if (!ctx) {
        return;
      }
  
      if (ctx.children) {
        return ctx.children.map(child => {
          if (child.children && child.children.length != 0) {
            return child.accept(this);
          } else {
            console.log(child);
            // 当处理 Time 语法时 eg. "After 100 days"
            if (child.parentCtx instanceof TimeContext) {
                // Time 语法上下文中 下标为 1 的词是我们需要的
                if (child == child.parentCtx.children[1]) {
                    let tmpValue = child.symbol.text;
                    // 判断测算模型测算的时间是否已达到 property 中规定的时间
                    if (parseInt(tmpValue) <= this.endDay) {
                        this.state++;
                    }
                }
            } 
            // 当处理 Role 语法时 eg. "AVAX.Token"
            else if (child.parentCtx instanceof RoleContext) {
                if (child == child.parentCtx.children[0]) {
                    // 判断 node 节点名称是否合法
                    if (this.nodes.has(child.symbol.text)) {
                        this.state++;
                    }
                    this.node = child.symbol.text;
                    
                }
                if (child == child.parentCtx.children[2]) {
                    this.role = child.symbol.text;
                    // 根据已获取的 node 节点名字和 role 角色名字，保留测算数据中相关的部分数据
                    for (let i = 0; i < this.data.length; i++) {
                        // 找到 node 节点的数据
                        if (this.data[i].type == this.node) {
                            // 组装有效的数据
                            let tmp = new Map();   // {type: "Team", data: {测算数据中最后一天的数据}}
                            for (let j = 0; j < this.data[i].data.length; j++) {
                                // 判断 role 名称是否合法
                                if (this.role == this.data[i].data[j].type)
                                    this.state++;
                                tmp.set(this.data[i].data[j].type, this.data[i].data[j].data[this.data[i].data[j].data.length - 1]);
                            }
                            this.data = tmp;
                            break;
                        }
                    }
                    
                }

            }
            else if (child.parentCtx instanceof ExprContext) {
                if (child == child.parentCtx.children[0]) {
                    // 计算当前 node 中所有 role 数值的总和，方便后续对不同 role 的占比进行计算
                    let total = Number(0);
                    for (let item of this.data) {
                        total += Number(item[1].value);
                    }
                    switch (child.parentCtx.children[0].symbol.text) {
                        case ">=":
                            // 计算当前 node 节点下 role 角色的数据占比是否满足 >= 的条件
                            if (Number(this.data.get(this.role).value) / total * 100 >= Number(child.parentCtx.children[1].symbol.text)) {
                                this.state++;
                            }
                            break;
                        case "==":
                            if (Number(this.data.get(this.role).value) / total * 100 == Number(child.parentCtx.children[1].symbol.text)) {
                                this.state++;
                            }
                            break;
                        case "<=":
                            if (Number(this.data.get(this.role).value) / total * 100 <= Number(child.parentCtx.children[1].symbol.text)) {
                                this.state++;
                            }
                            break;
                        case ">":
                            if (Number(this.data.get(this.role).value) / total * 100 > Number(child.parentCtx.children[1].symbol.text)) {
                                this.state++;
                            }
                            break;
                        case "<":
                            if (Number(this.data.get(this.role).value) / total * 100 < Number(child.parentCtx.children[1].symbol.text)) {
                                this.state++;
                            }
                            break;
                        case "!=":
                            if (Number(this.data.get(this.role).value) / total * 100 != Number(child.parentCtx.children[1].symbol.text)) {
                                this.state++;
                            }
                            break;
                        default:
                            alert("Operator not legal!");
                            break;
                    }
  
                }
                
            }
            return child.getText();
          }
        });
      }
    }
  }