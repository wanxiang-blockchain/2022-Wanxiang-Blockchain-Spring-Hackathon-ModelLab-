import { Stake, Unstake, Vest } from "./action";
import { NonNegative, StandardNum } from "../utils/numberUtil";
export class Token {

    // constructor
    // params:
    //      symbol: "Apex",
    //      totalSupply: 1000000,
    //      allocations: [
    //          { name: "Team", prop: 0, class: "team-slider" },
    //          { name: "Investor", prop: 0, class: "investor-slider" },
    //          { name: "Advisor", prop: 0, class: "advisor-slider" },
    //          { name: "Foundation", prop: 0, class: "foundation-slider" },
    //          { name: "Community", prop: 0, class: "community-slider" },
    //      ],
    //      community: {
    //          allocations: [
    //              { name: "Airdrop", prop: 0, class: "airdrop-turntable" },
    //              { name: "Staking", prop: 0, class: "staking-turntable" },
    //          ],
    //          stakingLifetime: 0,
    //          stakingRewardRefresh: 0,
    //          stakingRewardDecreaseFactor: 0,
    //      },
    constructor(symbol, totalSupply, allocations, community) {
        this.symbol = symbol;
        this.totalSupply = Number(totalSupply);

        // TODO stakedPercent 是否必要?
        // TODO freeMoneyPercent 是否必要？

        // allocatedAmount: 项目发行代币已通过 Vest 分配出去的数量
        // Example: {"Team": 200, "Community": 800}
        this.allocatedAmount = new Map();
        // allocatedAmountDelta: 项目发行代币已通过 Vest 分配出去的数量 增量数据
        this.allocatedAmountDelta = new Map();
        // allocatedAmountTotal: 项目发行代币已通过 Vest 分配出去的总量
        this.allocatedAmountTotal = Number(0);
        // allocationPercent: 项目代币分配方案
        // Example: {"Team": 0.2, "Community": 0.8}
        this.allocationPercent = new Map();
        // stakedAmount: 代币在质押池中质押的数量
        // Example: {"Team": 100, "Community": 100}
        this.stakedAmount = new Map();
        // stakedAmountDelta: 代币在质押池中质押的数量 增量数据
        // Example: {"Team": 0, "Community": 0}
        this.stakedAmountDelta = new Map();
        // stakedTotal: 代币在质押池中的总量
        this.stakedTotal = Number(0);
        // freeMoney: 代币可以自由流通使用的数量
        // Example: {"Team": 100, "Community": 700}
        this.freeMoney = new Map();
        // freeMoneyDelta: 代币可以自由流通使用的数量 增量数据
        // Example: {"Team": 0, "Community": 0}
        this.freeMoneyDelta = new Map();
        // freeMoneyTotal: 代币可以自由流通的总量
        this.freeMoneyTotal = Number(0);

        allocations.forEach(element => {
            // 获取 allocationPercent 数据
            this.allocationPercent.set(element.name, Number(element.prop) / 100);    

            this.allocatedAmount.set(element.name, Number(0));
            this.allocatedAmountDelta.set(element.name, Number(0));
            this.stakedAmount.set(element.name, Number(0));
            this.stakedAmountDelta.set(element.name, Number(0));
            this.freeMoney.set(element.name, Number(0));
            this.freeMoneyDelta.set(element.name, Number(0));
        })

        // TODO 还需要考虑 public sale 部分
        // communityPolicy: token 给社区分配代币的策略
        this.communityPolicy = {
            allocations: new Map(), // 社区代币的分配比例 Example: {"Airdrop": 0.2, "Staking": 0.8}
            stakingPool:                Number(0), // TODO [DONE, 还可以如何优化？] 如何更新这个 stakingPool? 在实例化 Stake 节点时，根据其 rewardPolicyFrom 参数来更改对应 token 的 stakingPool 属性 
            stakingRewardLifetime:      Number(community.stakingLifetime),
            stakingRewardRefreshPeriod: Number(community.stakingRewardRefresh),
            stakingRewardDefactor:      Number(community.stakingRewardDecreaseFactor) / 100,
        }

        community.allocations.forEach(element => {
            this.communityPolicy.allocations.set(element.name, Number(element.prop) / 100);
        })

        // canVest: token 是否可以 vest 
        this.canVest = Number(1);

        // 社区的发行策略中可能有直接对外发售/空投的币, 这部分币在一开始就属于 freeMoney
        if (this.communityPolicy.allocations.has("Airdrop") ) {
            let amount =  StandardNum(this.totalSupply * this.allocationPercent.get("Community") * this.communityPolicy.allocations.get("Airdrop"));
            this.freeMoney.set("Community", StandardNum(this.freeMoney.get("Community") + amount));
            this.freeMoneyTotal += amount;
        }
        if (this.communityPolicy.allocations.has("PublicSale")) {
            let amount = StandardNum(this.totalSupply * this.allocationPercent.get("Community") * this.communityPolicy.allocations.get("PublicSale"));
            this.freeMoney.set("Community", StandardNum(this.freeMoney.get("Community") + amount));
            this.freeMoneyTotal += amount;
        }
        this.allocatedAmountDelta.set("Community", StandardNum(this.allocationPercent.get("Community") * this.totalSupply));
    }

    // 执行测算逻辑
    run(preNode, curDay) {

        // 如果没有前序节点，则不会执行测算逻辑
        if (preNode == null) {
            return ;
        }

        if (preNode.constructor === Token) {
            // TODO Token 节点的前序节点是 Token 的情况暂时不处理
            return ;
        } 
        else if (preNode.constructor === Stake) {
            // 把前序 Stake 节点分配的 reward 加到自身的 freeMoneyDelta 增量数据上
            for (let item of this.freeMoneyDelta) {
                if (preNode.rewardAllocatedDelta.has(item[0])) {
                    item[1] += preNode.rewardAllocatedDelta.get(item[0]);
                    this.freeMoneyDelta.set(item[0], StandardNum(item[1]));
                }
            }
            
        } 
        else if (preNode.constructor === Unstake) {
            // 如果前序 unstake 节点的 unstakeHistory 中有当天的释放记录，则把释放的币加到自身的 freeMoneyDelta 上
            if (preNode.unstakeHistory.has(curDay)) {
                for (let item of this.freeMoneyDelta) {
                    if (preNode.unstakeHistory.get(curDay).has(item[0])) {
                        item[1] += preNode.unstakeHistory.get(curDay).get(item[0]);
                        this.freeMoneyDelta.set(item[0], StandardNum(item[1]));
                    }
                    
                }

                // TODO vestHistory 暂时不能删除，否则无法在数据可视化面板看到有效数据
                // preNode.unstakeHistory.delete(curDay);
            }
        } 
        else if (preNode.constructor === Vest) {
            // 如果前序 vest 节点的 vestHistory 中有当天的释放记录，则把释放的币加到自身的 freeMoneyDelta 上
            if (preNode.vestHistory.has(curDay)) {
                for (let item of this.freeMoneyDelta) {
                    if (preNode.vestHistory.get(curDay).has(item[0])) {
                        item[1] += preNode.vestHistory.get(curDay).get(item[0]);
                        this.freeMoneyDelta.set(item[0], StandardNum(item[1]));
                    }
                    
                }

                // TODO vestHistory 暂时不能删除，否则无法在数据可视化面板看到有效数据
                // preNode.vestHistory.delete(curDay);
            }
        }
        else {
            // log 提示报错: 不支持的节点类型
        }

    }

    // 执行 Delta 数据到 Commit 数据的更新
    update() {
        console.log(this.symbol, "::token: freeMoneyDelta:", this.freeMoneyDelta);
        console.log(this.symbol, "::token: stakedAmountDelta:", this.stakedAmountDelta);
        console.log(this.symbol, "::token: allocatedAmountDelta:", this.allocatedAmountDelta);
        // 执行 stakedAmount 的数据更新, 并重置增量数据
        for(let item of this.stakedAmount.entries()) {
            item[1] = NonNegative(item[1] + this.stakedAmountDelta.get(item[0]));
            this.stakedAmount.set(item[0], StandardNum(item[1]));
            this.stakedTotal = NonNegative(this.stakedTotal + this.stakedAmountDelta.get(item[0]));
            this.stakedAmountDelta.set(item[0], Number(0));
        }

        // 执行 freeMoney 的数据更新, 并重置增量数据
        for(let item of this.freeMoney.entries()) {
            item[1] = NonNegative(item[1] + this.freeMoneyDelta.get(item[0]));
            this.freeMoney.set(item[0], StandardNum(item[1]));
            this.freeMoneyTotal = NonNegative(this.freeMoneyTotal + this.freeMoneyDelta.get(item[0]));
            this.freeMoneyDelta.set(item[0], Number(0));
        }

        // 执行 allocatedAmount 的数据更新，并重置增量数据
        for(let item of this.allocatedAmount.entries()) {
            item[1] = NonNegative(item[1] + this.allocatedAmountDelta.get(item[0]));
            this.allocatedAmount.set(item[0], StandardNum(item[1]));
            this.allocatedAmountTotal = NonNegative(this.allocatedAmountTotal + this.allocatedAmountDelta.get(item[0]));
            this.allocatedAmountDelta.set(item[0], Number(0));
        }
       
        // 对于有发行量的币，需要更新 canVest 参数
        if (this.totalSupply > 0) {
            if (this.allocatedAmountTotal < this.totalSupply) {
                // 当已通过 Vest 分配出去的量小于发行总量时，允许继续 vest
                this.canVest = 1;
            } else {
                // 当已通过 Vest 分配出去的量大于等于发行总量时，不允许继续 vest
                this.canVest = 0;
            }
        }

        console.log(this.symbol, "::token: stakedAmount:", this.stakedAmount);
        
        console.log(this.symbol, "::token: stakedTotal:", this.stakedTotal);
        console.log(this.symbol, "::token: freeMoney:", this.freeMoney);
    
        console.log(this.symbol, "::token: freeMoneyTotal:", this.freeMoneyTotal);
        console.log(this.symbol, "::token: allocatedAmount:", this.allocatedAmount);
        
        console.log(this.symbol, "::token: allocatedAmountTotal:", this.allocatedAmountTotal);
    }

    //  更新已存在的 Token 实例里的参数
    selfUpdate(symbol, totalSupply, allocations, community) {
        this.symbol = symbol;
        this.totalSupply = Number(totalSupply);

        allocations.forEach(element => {
            // 更新 allocationPercent 数据
            this.allocationPercent.set(element.name, Number(element.prop) / 100);    
        })

        this.communityPolicy.stakingRewardLifetime = Number(community.stakingLifetime);
        this.communityPolicy.stakingRewardRefreshPeriod = Number(community.stakingRewardRefresh);
        this.communityPolicy.stakingRewardDefactor = Number(community.stakingRewardDecreaseFactor) / 100;

        community.allocations.forEach(element => {
            this.communityPolicy.allocations.set(element.name, Number(element.prop) / 100);
        })
    }
}
