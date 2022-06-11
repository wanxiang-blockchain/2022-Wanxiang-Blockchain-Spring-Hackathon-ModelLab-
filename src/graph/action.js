import { Token } from "./token";
import { pow, divide, subtract, chain } from 'mathjs';
import { NonNegative, StandardNum } from "../utils/numberUtil";
import { mapInit } from "../utils/mapInit";
export class Action {

    constructor() {
        // stakeLabelIDMap <key: nodeLabel, value: nodeID> : stake 节点的 label(交互页面可由用户自定义的文本名) 与 id 映射表
        this.stakeLabelIDMap = new Map();
        // stakeLabelIDMap <key: nodeLabel, value: nodeID> : unstake 节点的 label 与 id 映射表
        this.unstakeLabelIDMap = new Map();
        // stakeLabelIDMap <key: nodeLabel, value: nodeID> : vest 节点的 label 与 id 映射表
        this.vestLabelIDMap = new Map();
    }
}

export class Stake {

    // constructor
    // params:
    //      stakeToken: "Apex",
    //      rewardToken: "esApex"
    //      rewardPolicy {
    //          BigInt rewardTotal;
    //          int rewardLifetime;
    //          int rewardRefreshPeriod;
    //          float rewardDefactor;
    //      },
    //      stakeAmount: [
    //          { name: "Team", prop: 0, class: "team-slider" },
    //          { name: "Investor", prop: 0, class: "investor-slider" },
    //          { name: "Advisor", prop: 0, class: "advisor-slider" },
    //          { name: "Foundation", prop: 0, class: "foundation-slider" },
    //          { name: "Community", prop: 0, class: "community-slider" },
    //      ],
    // TODO rewardToken, stakeToke 是否必要？
    constructor(label, rewardPolicy, stakeAmount) {
        // label: 用户在前端交互页面为节点自定义的名字
        this.label = label;

        // stakeToken: stake 支持的质押币种
        // rewardToken: stake 的质押奖励币种

        // rewardTotal: stake 产生的质押奖励币总量
        this.rewardTotal = Number(rewardPolicy.rewardTotal);
        // rewardLifetime: stake 产生质押奖励的总时长
        this.rewardLifetime = Number(rewardPolicy.rewardLifetime);
        // rewardRefreshPeriod: stake 产生质押奖励的周期
        this.rewardRefreshPeriod = Number(rewardPolicy.rewardRefreshPeriod);
        // rewardDefactor: stake 质押奖励的衰减因子
        this.rewardDefactor = Number(rewardPolicy.rewardDefactor);

        // stakeAmount: stake 的数量(以百分比的形式)
        // Example: {"Team": 0.8, "Community": 0.8}
        this.stakeAmount = new Map();

        // TODO inPoolAmount 相关参数暂时不需要了，因为以 Token 节点的 stakedAmount 为准
        // inPoolAmount: stake 质押池中已经有的质押币数量
        // Example: {"Team": 100, "Community": 100}
        // this.inPoolAmount = new Map();
        // inPoolAmountDelta: stake 质押池中已经有的质押币数量 增量数据
        // this.inPoolAmountDelta = new Map();
        // inPoolAmountTotal: stake 质押池中已有的质押币总量
        // this.inPoolAmountTotal = 0;

        // rewardAllocated: stake 已经产生的奖励分配
        // Example: {"Team": 10000, "Community": 10000}
        this.rewardAllocated = new Map();
        // rewardAllocatedDelta: stake 已经产生的奖励分配 增量数据
        this.rewardAllocatedDelta = new Map();
        // rewardAllocatedTotal: stake 已经产生的奖励总量
        this.rewardAllocatedTotal = Number(0);
        // rewardList: 保存了每天可以释放的 reward 量
        this.rewardList = this.calculateRewardList(this.rewardTotal, this.rewardLifetime, this.rewardRefreshPeriod, this.rewardDefactor);
        // rewardIdx: 记录当前奖励释放的进度
        this.rewardIdx = Number(0);

        stakeAmount.forEach(element => {
            // 获取 stakeAmount 数据
            this.stakeAmount.set(element.name, Number(element.prop) / 100);
            // inPoolAmount 表示已经质押在池子里的数量
            // this.inPoolAmount.set(element.name, 0);
            // this.inPoolAmountDelta.set(element.name, 0);
            // rewardAllocated 表示已经分配的收益
            this.rewardAllocated.set(element.name, Number(0));
            this.rewardAllocatedDelta.set(element.name, Number(0));
        })

        console.log(this.label, "::Stake: reward total:", this.rewardTotal);
        
    }

    // 执行测算逻辑
    run(preNode, curDay) {
        // 如果没有前序节点，则不会执行测算逻辑
        if (preNode == null) {
            return ;
        }
        // 当池子的奖励计划已经结束，或者分配出去的奖励已经达到初始设置的奖励总额时，不再执行当前 stake 的测算逻辑
        if (this.rewardIdx >= this.rewardLifetime || this.rewardAllocatedTotal >= this.rewardTotal) {
            // log 提示 stake 已不会继续释放奖励
            // TODO 把 stake 池子里已有的 stakedAmount 释放出去成为 freeMoney. 如何避免 Unstake 那边的操作重复取出？
            // if (preNode.constructor === Token) {
            //     for (let item of preNode.stakedAmount) {
                    
            //         if (item[1] <= 0)
            //             continue;
            //         // 从前序 token 节点中减去 stake 的全部数量
            //         let stakeDelta = preNode.stakedAmountDelta.get(item[0]);
            //         console.log(this.label, "::Stake: stakeAmount minus:", item[1]);
            //         stakeDelta -= item[1];
            //         preNode.stakedAmountDelta.set(item[0], stakeDelta);
            //         // 往前序 token 节点的 freeMoneyDelta 加上 stake 的全部数量
            //         let freeMoneyDelta = preNode.freeMoneyDelta.get(item[0]);
            //         freeMoneyDelta += item[1];
            //         preNode.freeMoneyDelta.set(item[0], freeMoneyDelta);
            //     }
            // }
            return ;
        }

        if (preNode.constructor === Token) {
            // TODO [Done, StakeAmount 统一放在 Token 节点中. Stake 和 Unstake 操作都基于 Token 节点的 StakeAmount 数据, 但还不确定存在什么问题] Stake 如何感知到 Unstake 操作的影响
            // this.inPoolAmount = preNode.stakedAmount;
            // this.inPoolAmountDelta = preNode.stakedAmountDelta;
            // this.inPoolAmountTotal = preNode.stakedTotal;
            // console.log(this.label, "::pre Node is: ", preNode.symbol);

            // 当天加入 stake 池子中的 token 量
            for (let item of preNode.stakedAmountDelta) {
                if (preNode.freeMoney.has(item[0])) {
                    // TODO [Done] 如果增量数据为 0，就跳过
                    let delta = StandardNum(preNode.freeMoney.get(item[0]) * this.stakeAmount.get(item[0]));
                    if (delta <= 0.0)
                        continue;
                    item[1] += delta;
                    // 把上述当天加入 stake 池子的 token 量累加到前序节点的 stakedAmount 上
                    preNode.stakedAmountDelta.set(item[0], item[1]);
                    // 把上述当天加入 stake 池子的 token 从前序节点中减去
                    preNode.freeMoneyDelta.set(item[0], preNode.freeMoneyDelta.get(item[0]) - delta);
                    
                }
                
                // this.inPoolAmountDelta.set(item[0], item[1]);
            }


            // 当天 stake 池子产生的奖励量, 只有当 inPoolAmountTotal > 0 时才会有奖励分配
            if (preNode.stakedTotal > 0) {
                let curReward = this.rewardList[this.rewardIdx];
                console.log(this.label,"::Stake: curent reward:", curReward);
                for (let item of this.rewardAllocatedDelta) {
                    // TODO [Done] 增量数据如果为0，就跳过
                    let delta = StandardNum(preNode.stakedAmount.get(item[0]) / preNode.stakedTotal * curReward);
                    if (delta <= 0.0)
                        continue;
                    item[1] += delta;
    
                    this.rewardAllocatedDelta.set(item[0], item[1]);
                }

                this.rewardIdx++;
            }
            
        } else if (preNode.constructor === Stake) {
            console.log(this.label, "::pre Node is: ", preNode.label);

        } else if (preNode.constructor === Vest) {
            console.log(this.label, "::pre Node is: ", preNode.label);

        } else if (preNode.constructor === Unstake) {
            console.log(this.label, "::pre Node is: ", preNode.label);
        }
    }

    // 执行 Delta 数据到 Commit 数据的更新
    update() {

        // for (let item of this.inPoolAmount) {
        //     item[1] += this.inPoolAmountDelta.get(item[0]);
        //     this.inPoolAmount.set(item[0], item[1]);
        //     this.inPoolAmountTotal += this.inPoolAmountDelta.get(item[0]);
        //     this.inPoolAmountDelta.set(item[0], 0);
        // }

        for (let item of this.rewardAllocated) {
            item[1] = NonNegative(item[1] + this.rewardAllocatedDelta.get(item[0]));
            this.rewardAllocated.set(item[0], Number(item[1]));
            this.rewardAllocatedTotal = NonNegative(this.rewardAllocatedTotal + this.rewardAllocatedDelta.get(item[0]));
            this.rewardAllocatedDelta.set(item[0], Number(0));
        }

        console.log(this.label, "::Stake: rewardAllocated:", this.rewardAllocated);
        console.log(this.label, "::Stake: rewardAllocatedDelta:", this.rewardAllocatedDelta);
        console.log(this.label, "::Stake: rewardAllocatedTotal:", this.rewardAllocatedTotal);
    }

    // 计算出当奖励总量为 totalAmount, staking奖励时长 totalTime, 奖励刷新周期为 periodTime, 每个周期奖励的衰减系数为 defactor 的情况下，完整的每天奖励量列表
    // 例如: [1000,900,810,...], 意为第1天的奖励量为1000, 第2天的奖励量为900,...
    calculateRewardList(totalAmount, totalTime, periodTime, defactor) {
        // TODO [Done] corner case 的返回值需要修改为 array 类型
        if (totalAmount == 0 ) {
            return [0];
        }
        if (totalTime <= 1 ) {
            return [totalAmount];
        } 
        if (periodTime == 0) {
            return [totalAmount];
        }
        if (defactor == 0) {
            return [totalAmount];
        }
        const periodNum = divide(totalTime, periodTime);
        const dividend = subtract(1, defactor);
        const divisor = subtract(1, pow(defactor, periodNum));
        let releaseBase = StandardNum(chain(totalAmount).multiply(dividend).divide(divisor));
        if (defactor == 1.0) {
            releaseBase = StandardNum(chain(totalAmount).divide(periodNum));
        }

        let res = [];
        for (let i = 0;i < totalTime; i++) {
            let curPeriod = Math.floor(i / periodTime);
            let tmp = StandardNum(releaseBase * pow(defactor, curPeriod) / periodTime);
            res.push(tmp);
            
        }
        return res;
    }

    // 当模型从暂停状态重新启动测算时，用户可能对参数进行了修改，新的参数需要更新到模型中
    // 更新已存在的 stake 实例里的参数
    selfUpdate(label, rewardPolicy, stakeAmount) {
        this.label = label;
        // TODO 暂不支持在测算中途更改 rewardTotal，因为 rewardList 是在测算初始的时候就计算出来了
        // this.rewardTotal = Number(rewardPolicy.rewardTotal);
        this.rewardLifetime = Number(rewardPolicy.rewardLifetime);
        this.rewardRefreshPeriod = Number(rewardPolicy.rewardRefreshPeriod);
        this.rewardDefactor = Number(rewardPolicy.rewardDefactor);

        stakeAmount.forEach(element => {
            // 更新 stakeAmount 数据
            this.stakeAmount.set(element.name, Number(element.prop) / 100);
        })
    }

}

export class Unstake {

    // constructor
    // params:
    //      coolTime: 180
    //      unstakeAmount: [
    //          { name: "Team", prop: 0, class: "team-slider" },
    //          { name: "Investor", prop: 0, class: "investor-slider" },
    //          { name: "Advisor", prop: 0, class: "advisor-slider" },
    //          { name: "Foundation", prop: 0, class: "foundation-slider" },
    //          { name: "Community", prop: 0, class: "community-slider" },
    //      ],
    constructor(label, coolTime, unstakeAmount) {
        // label: 用户在前端交互页面为节点自定义的名字
        this.label = label;
        // coolTime: unstake 操作执行后的锁仓时间
        this.coolTime = Number(coolTime);
        
        // unstakeAmount: unstake 解除质押的数量(以百分比的形式)
        // Example: {"Team": 0.1, "Community": 0.2}
        this.unstakeAmount = new Map();
        // unstakeHistory: unstake 锁仓单的记录，当锁仓时间结束时，从记录中获取可以释放的量
        // Example: {11: {"Team": 1000, "Community": 2000}}
        this.unstakeHistory = new Map();

        unstakeAmount.forEach(element => {
            this.unstakeAmount.set(element.name, Number(element.prop) / 100);
        })
    }

    // 执行测算逻辑
    run(preNode, curDay) {
        // 如果没有前序节点，则不会执行测算逻辑
        if (preNode == null) {
            return ;
        }
        //  TODO: 考虑什么情况下 unstake 的run函数可以跳过？unstakeAmount 为 0的时候？
        // if (condition) {
        //     return ;
        // }
        
        if (preNode.constructor === Token) {
            // console.log(this.label, "::pre Node is: ", preNode.symbol);
            let unStakeRecord = new Map();
            for (let item of this.unstakeAmount) {
                let amount = StandardNum(preNode.stakedAmount.get(item[0]) * item[1]);
                // 如果当前参与方 unstake 的 <=  0，跳过
                if (amount <= 0.0) {
                    // unStakeRecord.set(item[0], Number(0));
                    continue;
                }
                    
                let stakeDelta = preNode.stakedAmountDelta.get(item[0]) - amount;
                preNode.stakedAmountDelta.set(item[0], stakeDelta);
                unStakeRecord.set(item[0], amount);
            }

            // 当 unStakeRecord 记录里有内容时，插入到 unstakeHistory 中
            if(unStakeRecord.size > 0){
                
                for (let item of unStakeRecord) {
                    if (!this.unstakeHistory.has(curDay + this.coolTime)) {
                        // 为什么需要各参与者的数值初始化为0？因为 antv 数据可视化效果需要
                        this.unstakeHistory.set(curDay + this.coolTime, mapInit(this.unstakeAmount.keys()));
                    }

                    let old = this.unstakeHistory.get(curDay + this.coolTime).get(item[0]);
                    if (old == undefined) old = Number(0);
                    old += item[1];

                    // TODO (xufei) item[1] 换成 old？
                    this.unstakeHistory.get(curDay + this.coolTime).set(item[0], old);
                }
               
            }
            
            
        } else if (preNode.constructor === Stake) {
            console.log(this.label,"::pre Node is: ", preNode.label);

        } else if (preNode.constructor === Vest) {
            console.log(this.label,"::pre Node is: ", preNode.label);

        } else if (preNode.constructor === Unstake) {
            console.log(this.label,"::pre Node is: ", preNode.label);
        }
    }

    // 执行 Delta 数据到 Commit 数据的更新
    update() {
        console.log(this.label,": unstake History: ", this.unstakeHistory);
    }

    // 当模型从暂停状态重新启动测算时，用户可能对参数进行了修改，新的参数需要更新到模型中
    // 更新已存在的 Unstake 实例里的参数
    selfUpdate(label, coolTime, unstakeAmount) {
        this.label = label;
        this.coolTime = Number(coolTime);
        unstakeAmount.forEach(element => {
            this.unstakeAmount.set(element.name, Number(element.prop) / 100);
        })
    }
}

export class Vest {

    // constructor
    // params:
    //      vestAmount: [
    //          {
    //              name: "Team",
    //              prop: 0,
    //              class: "team-slider",
    //              lockUpTime: 0,
    //              releasePeriod: 0,
    //              cliff: 0,
    //          },
    //          {
    //              name: "Investor",
    //              prop: 0,
    //              class: "investor-slider",
    //              lockUpTime: 0,
    //              releasePeriod: 0,
    //              cliff: 0,
    //          },
    //          {
    //              name: "Advisor",
    //              prop: 0,
    //              class: "advisor-slider",
    //              lockUpTime: 0,
    //              releasePeriod: 0,
    //              cliff: 0,
    //          },
    //          {
    //              name: "Foundation",
    //              prop: 0,
    //              class: "foundation-slider",
    //              lockUpTime: 0,
    //              releasePeriod: 0,
    //              cliff: 0,
    //          },
    //          {
    //              name: "Community",
    //              prop: 0,
    //              class: "community-slider",
    //              lockUpTime: 0,
    //              releasePeriod: 0,
    //              cliff: 0,
    //          },
    //      ],
    constructor(label, vestAmount) {
        // label: 用户在前端交互页面为节点自定义的名字
        this.label = label;
        // vestHistory: vest 锁仓单的记录，当锁仓时间结束时，从记录中获取可以释放的量
        // Example: {181: {"Team": 10000, "Community": 40000}}
        this.vestHistory = new Map();
        // vestAmount: vest 锁仓的数量(以百分比的形式)
        // Example: {"Team": 1.0, "Community": 1.0}
        this.vestAmount = new Map();
        // vestPolicy: vest 锁仓的策略
        // Example: {"Team": {lockupTime: 180, releasePeriod: 30, cliff: 30}}
        this.vestPolicy = new Map();

        vestAmount.forEach(element => {
            this.vestAmount.set(element.name, Number(element.prop) / 100);
            this.vestPolicy.set(element.name, {lockupTime: Number(element.lockUpTime), releasePeriod: Number(element.releasePeriod), cliff: Number(element.cliff)});
        })

    }

    // 执行测算逻辑
    run(preNode, curDay) {
        // 如果没有前序节点，则不会执行测算逻辑
        if (preNode == null) {
            return ;
        }
        //  TODO: 考虑什么情况下 vest 的run函数可以跳过？vestAmount 为 0的时候？
        // if (condition) {
        //     return ;
        // }
        
        if (preNode.constructor === Token) {
            let vestRecord = new Map();
            if(preNode.totalSupply > 0 && preNode.canVest == 1) {
                // 对于项目发行代币，vest 的对象是初始分配的币量
                for (let item of this.vestAmount) {
                    let amount = StandardNum((preNode.allocationPercent.get(item[0]) * preNode.totalSupply - preNode.allocatedAmount.get(item[0])) * item[1]);
                    // 对于 amount <= 0 的情况，不插入到 vestRecord 里
                    if (amount <= 0.0) {
                        // vestRecord.set(item[0], Number(0));
                        continue;
                    }
                        
                    preNode.allocatedAmountDelta.set(item[0], preNode.allocatedAmountDelta.get(item[0]) + amount);

                    vestRecord.set(item[0], amount);
                }
                
            } else if (preNode.totalSupply <= 0 ) {
                // 对于非项目发行代币，vest 的对象可能是 freeMoney 部分
                for (let item of this.vestAmount) {
                    let amount = StandardNum(preNode.freeMoney.get(item[0]) * item[1]);
                    // 对于 amount <= 0 的情况，不插入到 vestRecord 里
                    if (amount <= 0.0) {
                        // vestRecord.set(item[0], Number(0));
                        continue;
                    }
                        
                    preNode.freeMoneyDelta.set(item[0], preNode.freeMoneyDelta.get(item[0]) - amount);
                    vestRecord.set(item[0], amount);
                }
               
            }
            // 当 vestRecord 记录里有内容时，插入到 vestHistory 中
            if(vestRecord.size > 0){

                for (let item of vestRecord) {
                    // 线性释放
                    let releasePeriod = this.vestPolicy.get(item[0]).releasePeriod;
                    let releaseNumber = Math.floor(this.vestPolicy.get(item[0]).lockupTime / releasePeriod);
                    let cliff = this.vestPolicy.get(item[0]).cliff;
                    if (cliff == 0) releaseNumber++;
                    let releaseAmount = StandardNum(item[1] / releaseNumber);
                    
                    if (this.vestPolicy.get(item[0]).lockupTime == 0 || releasePeriod == 0 ) {
                        releaseNumber = 1;
                        releaseAmount = item[1];
                    }

                    for (let i = 0; i < releaseNumber; i++) {
                        // 如果 vestHistory 里没有 curDay + cliff + i * releasePeriod 的记录时，初始化
                        if (!this.vestHistory.has(curDay + cliff + i * releasePeriod)) {
                            // 为什么需要各参与者的数值初始化为0？因为 antv 数据可视化效果需要
                            this.vestHistory.set(curDay + cliff + i * releasePeriod, mapInit(this.vestAmount.keys()));
                        } 
                        // 将这次计算需要通过 vest 释放的 amount 累加到历史数据上
                        let old = this.vestHistory.get(curDay + cliff + i * releasePeriod);
                        old.set(item[0], (old.get(item[0]) == undefined ? 0 : old.get(item[0])) + releaseAmount);
                        this.vestHistory.set(curDay + cliff + i * releasePeriod, old);
                    }

                    // 老版本是这么写的，比较繁琐
                    // 对于 lockUpTime 为 0，即不需要锁仓立即释放的情况
                    // if (this.vestPolicy.get(item[0]).lockupTime == 0 && cliff == 0 && releasePeriod == 0) {
                    //     // 如果 vestHistory 里没有 curDay 的记录时，初始化
                    //     if (!this.vestHistory.has(curDay)) {
                    //         this.vestHistory.set(curDay, new Map());
                    //     } 
                    //     // 将这次计算需要通过 vest 释放的 amount 累加到历史数据上
                    //     let old = this.vestHistory.get(curDay);
                    //     old.set(item[0], (old.get(item[0]) == undefined ? 0 : old.get(item[0])) + item[1]);
                    //     this.vestHistory.set(curDay, old);
                    // } 
                    // else {
                    //     for (let i = 0; i < releaseNumber; i++) {
                    //         // 如果 vestHistory 里没有 curDay + cliff + i * releasePeriod 的记录时，初始化
                    //         if (!this.vestHistory.has(curDay + cliff + i * releasePeriod)) {
                    //             this.vestHistory.set(curDay + cliff + i * releasePeriod, new Map());
                    //         } 
                    //         // 将这次计算需要通过 vest 释放的 amount 累加到历史数据上
                    //         let old = this.vestHistory.get(curDay + cliff + i * releasePeriod);
                    //         old.set(item[0], (old.get(item[0]) == undefined ? 0 : old.get(item[0])) + releaseAmount);
                    //         this.vestHistory.set(curDay + cliff + i * releasePeriod, old);
                    //         // console.log(this.label, "::Vest: inserting vest history:", curDay + cliff + i * releasePeriod, " - ", old);
                    //     }
                    // }
                    
                }
                
            }
            
        } else if (preNode.constructor === Stake) {
            console.log(this.label,"::pre Node is: ", preNode.label);

        } else if (preNode.constructor === Vest) {
            console.log(this.label,"::pre Node is: ", preNode.label);

        } else if (preNode.constructor === Unstake) {
            console.log(this.label,"::pre Node is: ", preNode.label);
        }

    }

    // 执行 Delta 数据到 Commit 数据的更新
    update() {
        console.log(this.label,": vest History: ", this.vestHistory);
    }

    // 当模型从暂停状态重新启动测算时，用户可能对参数进行了修改，新的参数需要更新到模型中
    // 更新已存在的 Vest 实例里的参数
    selfUpdate(label, vestAmount) {
        this.label = label;
        vestAmount.forEach(element => {
            this.vestAmount.set(element.name, Number(element.prop) / 100);
            this.vestPolicy.set(element.name, {lockupTime: Number(element.lockUpTime), releasePeriod: Number(element.releasePeriod), cliff: Number(element.cliff)});
        })

    }
}
