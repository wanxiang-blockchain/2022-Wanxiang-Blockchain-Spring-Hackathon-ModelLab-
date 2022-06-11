import { Scheduler } from "./scheduler";
import { Action, Stake, Unstake, Vest } from "./action";
import { Token } from "./token";
import { Sleep } from "./../utils/sleep";
import { StandardNum } from "../utils/numberUtil";

// var isPaused = false;
// self.addEventListener('message', function (e) {
//     // console.log("thread message:", e);
//     var data = e.data;
//     switch (data) {
//       case 'pause':
//         console.log("---------------worker paused");
//         isPaused = true;
//         break;
//       default:
//         // self.postMessage('Unknown command: ' + data.msg);
//     };
//   }, false);

export class Model {

    constructor(graph, endDay, slot) {
        this.graph = graph;
        // endDay: 模型的测算终止时间
        this.endDay = Number(endDay);
        // slot: 模型测算的停顿窗口，每隔这一段时间模型测算过程会停顿 5s，方便操作者进行下一步的调整
        this.slot = Number(slot);
        // status: 模型处于哪个状态中 0 - off, 1 - on, 2 - pause
        this.status = Number(1);
        // curDay: 模型测算的当前时间
        this.curDay = Number(1);
        // antvNodes 保存的是原始 antv 定义的节点对象
        // TODO antvNodes 是否仅仅在初始化的时候用到？
        this.antvNodes = new Map();
        // nodesInstance 保存所有节点对象数据 <key: tokenID, value: nodeClassInstance>
        this.nodesInstance = new Map();
        // action 内包含 stakeLabelIDMap, unstakeLabelIDMap, vestLabelIDMap
        this.action = new Action();
        // tokenLabelIDMap <key: nodeLabel, value: nodeID>
        this.tokenLabelIDMap = new Map();
        // EdgeMap <key: sourceID, value: <key: targetID, value: EdgeClassInstance> >
        this.edgeMap = new Map();
        // data: 测算模型测算过程中产生的数据
        this.data = [];

        this.initData();

        this.scheduler = new Scheduler(graph, this.antvNodes);
        
        // this.data: [
        //     {
        //         type: "Token2",
        //         data: [
        //             {
        //                 type: "Team",
        //                 data: [
        //                     { time: 0, value: 60 },
        //                     { time: 1, value: 80 },
        //                     { time: 2, value: 90 },
        //                     { time: 3, value: 80 },
        //                     { time: 4, value: 90 },
        //                     { time: 5, value: 110 },
        //                     { time: 6, value: 120 },
        //                     { time: 7, value: 140 },
        //                 ]
        //             },
        //             {
        //                 type: "Community",
        //                 data: [
        //                     { time: 0, value: 50 },
        //                     { time: 1, value: 90 },
        //                     { time: 2, value: 40 },
        //                     { time: 3, value: 80 },
        //                     { time: 4, value: 30 },
        //                     { time: 5, value: 110 },
        //                     { time: 6, value: 170 },
        //                     { time: 7, value: 180 },
        //                 ]
        //             }

        //         ]
        //     },
        //     {
        //         type: "Token1",
        //         data: [
        //             {
        //                 type: "Team",
        //                 data: [
        //                     { time: 0, value: 90 },
        //                     { time: 1, value: 100 },
        //                     { time: 2, value: 90 },
        //                     { time: 3, value: 100 },
        //                     { time: 4, value: 90 },
        //                     { time: 5, value: 110 },
        //                     { time: 6, value: 90 },
        //                     { time: 7, value: 120 },
        //                 ]
        //             },
        //             {
        //                 type: "Community",
        //                 data: [
        //                     { time: 0, value: 70 },
        //                     { time: 1, value: 110 },
        //                     { time: 2, value: 80 },
        //                     { time: 3, value: 190 },
        //                     { time: 4, value: 90 },
        //                     { time: 5, value: 100 },
        //                     { time: 6, value: 70 },
        //                     { time: 7, value: 150 },
        //                 ]
        //             }


        //         ]
        //     }
        // ]
        
    }

    initData() {
        this.getNodes();
        this.getEdges();

    }

    // 获取当前画布上的所有节点，保存节点原始 antv 数据和用户配置属性参数
    getNodes() {

        // 获取所有节点的 antv 相关数据，同时建立起不同节点类型的 label(用户设置的节点名字) -> id 的映射表
        let nodes = this.graph.model.getNodes();
        nodes.forEach(element => {
            this.antvNodes.set(element.id, element);
            
            switch(element.getData().type) {
                case "Token":
                    this.tokenLabelIDMap.set(element.label, element.id);
                    break;
                case "Stake":
                    this.action.stakeLabelIDMap.set(element.label, element.id);
                    break;
                case "Unstake":
                    this.action.unstakeLabelIDMap.set(element.label, element.id);
                    break;
                case "Vest":
                    this.action.vestLabelIDMap.set(element.label, element.id);
                    break;
                default:
                    break;
            }
        });

        console.log("nodes:", this.antvNodes);

        // 初始化 Token 节点对象并加入到 nodesInstance 中
        for (let item of this.tokenLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.tokenData;
            this.nodesInstance.set(item[1], new Token(item[0], nodeData.totalSupply, nodeData.allocations, nodeData.community));
            this.data.push({type: item[0], data: []});
        }

        // 根据 stake 节点的 rewardPolicyFrom 参数，更新对应的 token 节点的 stakingPool 参数
        // TODO 非常丑陋，如何优化？
        for (let item of this.action.stakeLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.stakeData;
            this.nodesInstance.get(this.tokenLabelIDMap.get(nodeData.rewardPolicyFrom)).communityPolicy.stakingPool++;
        }

        // 初始化 stake 节点对象并加入到 nodesInstance 中
        for (let item of this.action.stakeLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.stakeData;
            let tokenInstance = this.nodesInstance.get(this.tokenLabelIDMap.get(nodeData.rewardPolicyFrom));
            let rewardPolicy = {
                // 此处 rewardTotal 指的是单个 stake 池子所能释放奖励的总量。其值取决于释放的 token 中设置的 Community Staking 总量除以可以释放该 token 的 stake 池总数  
                rewardTotal: StandardNum(tokenInstance.communityPolicy.allocations.get("Staking") * tokenInstance.allocationPercent.get("Community") * tokenInstance.totalSupply / tokenInstance.communityPolicy.stakingPool),
                rewardLifetime: tokenInstance.communityPolicy.stakingRewardLifetime,
                rewardRefreshPeriod: tokenInstance.communityPolicy.stakingRewardRefreshPeriod,
                rewardDefactor: tokenInstance.communityPolicy.stakingRewardDefactor,
            };
            this.nodesInstance.set(item[1], new Stake(item[0], rewardPolicy, nodeData.stakeAmount));
            this.data.push({type: item[0], data: []});
        }

        // 初始化 unstake 节点对象并加入到 nodesInstance 中
        for (let item of this.action.unstakeLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.unstakeData;
            this.nodesInstance.set(item[1], new Unstake(item[0], nodeData.coolDownTime, nodeData.unstakeAmount));
            this.data.push({type: item[0], data: []});
        }

        // 初始化 vest 节点对象并加入到 nodesInstance 中
        for (let item of this.action.vestLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.vestData;
            this.nodesInstance.set(item[1], new Vest(item[0], nodeData.vestAmount));
            this.data.push({type: item[0], data: []});
        }

    }

    // 获取当前画布上的所有边，保存边上用户配置的属性参数
    getEdges() {
        // let edges = this.graph.getEdges()
        // edges.forEach(element => {
        //     let src = element.getSourceNode().id;
        //     let dst = element.getTargetNode().id;

        //     let edgeData = element.getData().edgeData;
        //     console.log("edges", edgeData);

        //     let edge = new Edge(src, dst, edgeData.distribution);
        //     if (this.edgeMap.get(src) == undefined) {
        //         this.edgeMap.set(src, new Map());
        //     }
        //     this.edgeMap.get(src).set(dst, edge);
        // })
    }

    async start() {
        while (this.curDay <= this.endDay) {
            let step = this.scheduler.schedule();

            if (step.endFlag == true) {
                // 更新所有节点
                this.nodesInstance.forEach(function(value, key) {
                    value.update();
                })
                // 为数据可视化做准备，更新测算过程中每日的动态数据 
                this.updateDailyData();

                
                // 每隔一段周期都暂停 5s
                if (this.slot > 0 && this.curDay % this.slot == 0) {
                    await Sleep(5000);
                }
                this.curDay++;
                // 如果模型处于 Off / Pause 状态，直接跳出函数
                if (this.status == 0 || this.status == 2) {
                    return;
                }

                continue;
            }

            if (this.nodesInstance.get(step.curNode) == undefined) {
                // log 报错提示: 不存在该节点
                console.log("error:: cur node does not exist!", step);
                break ;
            }

            console.log("day:", this.curDay);
            // 执行当前节点的 run 方法
            if (step.preNode == null) {
                this.nodesInstance.get(step.curNode).run(null, this.curDay);
            }
            else {
                this.nodesInstance.get(step.curNode).run(this.nodesInstance.get(step.preNode), this.curDay);
            }

        }

        // 为数据可视化做准备，更新一次测算总体的数据，如 unstakeHistory, vestHistory 等
        this.updateOverallData();
        // log 提示: 测算运行完毕
        return;
    }

    updateDailyData() {
        for (let i = 0; i < this.data.length; i++) {
            
            // 更新 token 节点相关的 data
            if (this.tokenLabelIDMap.has(this.data[i].type)) {
                let tmpInstance = this.nodesInstance.get(this.tokenLabelIDMap.get(this.data[i].type));

                // this.data 的数据结构如下所示
                // this.data:
                // [
                //     {
                //         type: "Token2",
                //         data: [
                //             {
                //                 type: "Team",
                //                 data: [
                //                     { time: 0, value: 60 },
                //                     { time: 1, value: 80 },
                //                     { time: 2, value: 90 },
                //                     { time: 3, value: 80 },
                //                     { time: 4, value: 90 },
                //                     { time: 5, value: 110 },
                //                     { time: 6, value: 120 },
                //                     { time: 7, value: 140 },
                //                 ]
                //             }, // 参与者 data 域
                //             {
                //                 type: "Community",
                //                 data: [
                //                     { time: 0, value: 50 },
                //                     { time: 1, value: 90 },
                //                     { time: 2, value: 40 },
                //                     { time: 3, value: 80 },
                //                     { time: 4, value: 30 },
                //                     { time: 5, value: 110 },
                //                     { time: 6, value: 170 },
                //                     { time: 7, value: 180 },
                //                 ]
                //             } // 参与者 data 域

                //         ]
                //     }, // 节点 data 域
                // ]
                // 对于每个节点，其节点的 data 域内会有不同的角色, 如 Team, Community 等; 但是节点 data 域是一个数组，由于将节点含有的角色数据插入 data 域数组的过程不是有序的所以不能直接根据下标就定位到某个角色，
                // 所以此处需要保存一个映射 roleIdxMap, key 为角色, value 为该角色在节点 data 域数组内的下标，方便后续操作指定节点的指定角色 data 域
                let roleIdxMap = new Map();
                
                // 根据节点 data 域中已包含的角色来初始化 roleIdxMap
                for (let j = 0; j < this.data[i].data.length; j++) {
                    roleIdxMap.set(this.data[i].data[j].type, j);
                }

                // TODO 目前对于 token 节点只支持将 freeMoney 数据可视化
                for (let item of tmpInstance.freeMoney) {
                    // 如果 roleIdxMap 中还没有包含某个角色（也意味着节点 data 域中还未包含某个角色），则在节点 data 域中为该角色插入记录，同时将 role -> idx 的映射关系保存起来
                    if (!roleIdxMap.has(item[0])) {
                        let len = this.data[i].data.push({type: item[0], data:[]});
                        roleIdxMap.set(item[0], len - 1);
                    }
                    // 往节点 data 域下的角色 data 域插入数据
                    this.data[i].data[roleIdxMap.get(item[0])].data.push({time: String(this.curDay), value: item[1]});
                }
            } 
            // 更新 stake 节点相关的 data，代码逻辑和实现与上面对 token 节点的处理相同
            else if (this.action.stakeLabelIDMap.has(this.data[i].type)) {
                let tmpInstance = this.nodesInstance.get(this.action.stakeLabelIDMap.get(this.data[i].type));
                let roleIdxMap = new Map();
                
                for (let j = 0; j < this.data[i].data.length; j++) {
                    roleIdxMap.set(this.data[i].data[j].type, j);
                }

                // TODO 目前对于 stake 节点只支持将 rewardAllocated 数据可视化
                for (let item of tmpInstance.rewardAllocated) {
                    if (!roleIdxMap.has(item[0])) {
                        let len = this.data[i].data.push({type: item[0], data:[]});
                        roleIdxMap.set(item[0], len - 1);
                    }
                    this.data[i].data[roleIdxMap.get(item[0])].data.push({time: String(this.curDay), value: item[1]});
                }
            } 
            
        }
    }

    // 为数据可视化功能服务，更新单次测算的总体数据，如 unstakeHistory, vestHistory 等
    updateOverallData() {
        for (let i = 0; i < this.data.length; i++) {
            // 更新 unstake 节点相关的 data，代码逻辑和实现与上面对 token 节点的处理大体相似，稍有不同
            if (this.action.unstakeLabelIDMap.has(this.data[i].type)) {
                let originalHistory = this.nodesInstance.get(this.action.unstakeLabelIDMap.get(this.data[i].type)).unstakeHistory;
                let orderedHistory = new Map();

                // 由于 unstakeHistory 的插入顺序可能不是按天的顺序插入，所以需要重新按天排序
                let keys = new Array();
                for (let item of originalHistory) {
                    keys.push(Number(item[0]));
                }
                keys.sort(function(a, b) {
                    return Number(a) - Number(b);
                });
                for(let i = 0; i < keys.length; i++) {
                    orderedHistory.set(Number(keys[i]), originalHistory.get(keys[i]));
                }

                let roleIdxMap = new Map();

                for (let j = 0; j < this.data[i].data.length; j++) {
                    roleIdxMap.set(this.data[i].data[j].type, j);
                    // roleTimedataIdxMap.set(this.data[i].data[j].type, new Map());
                }

                for (let item of orderedHistory) {
                    // item: {key: 时间, value: {key:"Team", value: 100}}
                    for (let item2 of item[1]) {
                        // item2: {key: "Team", value: 100}
                        if (!roleIdxMap.has(item2[0])) {
                            let len = this.data[i].data.push({type: item2[0], data:[]});
                            roleIdxMap.set(item2[0], len - 1);
                        }
                        this.data[i].data[roleIdxMap.get(item2[0])].data.push({time: String(item[0]), value: item2[1]});
                    }
                }

            }
            // 更新 vest 节点相关的 data, 代码逻辑和实现与上面对 token 节点的处理大体相似，稍有不同
            else if (this.action.vestLabelIDMap.has(this.data[i].type)) {
                let originalHistory = this.nodesInstance.get(this.action.vestLabelIDMap.get(this.data[i].type)).vestHistory;
                let orderedHistory = new Map();

                // 由于 vestHistory 的插入顺序不是按天的顺序插入，所以需要重新按天排序
                let keys = new Array();
                for (let item of originalHistory) {
                    keys.push(item[0]);
                }
                keys.sort(function(a, b) {
                    return a - b;
                });
                for(let i = 0; i < keys.length; i++) {
                    orderedHistory.set(keys[i], originalHistory.get(keys[i]));
                }

                let roleIdxMap = new Map();

                for (let j = 0; j < this.data[i].data.length; j++) {
                    roleIdxMap.set(this.data[i].data[j].type, j);
                }

                for (let item of orderedHistory) {
                    // item: {key: 时间, value: {key:"Team", value: 100}}
                    for (let item2 of item[1]) {
                        // item2: {key: "Team", value: 100}
                        if (!roleIdxMap.has(item2[0])) {
                            let len = this.data[i].data.push({type: item2[0], data:[]});
                            roleIdxMap.set(item2[0], len - 1);
                        }
                        this.data[i].data[roleIdxMap.get(item2[0])].data.push({time: String(item[0]), value: item2[1]});
                    }
                    
                }
            }
        }
    }

    // 当模型从暂停状态重新启动测算时，用户可能对参数进行了修改，新的参数需要更新到模型中
    selfUpdate(graph, endDay, slot) {
        // 确保 endDay 大于当前
        if (endDay < this.curDay) {
            console.log("end day is illegal!");
            return;
        }

        this.endDay = endDay;
        this.slot = slot;

        let nodes = graph.model.getNodes();
        nodes.forEach(element => {
            this.antvNodes.set(element.id, element);
        });

        // 更新 Token 节点对象
        for (let item of this.tokenLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.tokenData;
            console.log("update token data:", nodeData);
            this.nodesInstance.get(item[1]).selfUpdate(item[0], nodeData.totalSupply, nodeData.allocations, nodeData.community);
        }

        // 更新 stake 节点对象
        for (let item of this.action.stakeLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.stakeData;
            console.log("update stake data:", nodeData);
            let tokenInstance = this.nodesInstance.get(this.tokenLabelIDMap.get(nodeData.rewardPolicyFrom));
            console.log("update stake data rewardPolicyFrom:", nodeData.rewardPolicyFrom);
            let rewardPolicy = {
                // 此处 rewardTotal 指的是单个 stake 池子所能释放奖励的总量。其值取决于释放的 token 中设置的 Community Staking 总量除以可以释放该 token 的 stake 池总数  
                rewardTotal: StandardNum(tokenInstance.communityPolicy.allocations.get("Staking") * tokenInstance.allocationPercent.get("Community") * tokenInstance.totalSupply / tokenInstance.communityPolicy.stakingPool),
                rewardLifetime: tokenInstance.communityPolicy.stakingRewardLifetime,
                rewardRefreshPeriod: tokenInstance.communityPolicy.stakingRewardRefreshPeriod,
                rewardDefactor: tokenInstance.communityPolicy.stakingRewardDefactor,
            };
            this.nodesInstance.get(item[1]).selfUpdate(item[0], rewardPolicy, nodeData.stakeAmount);
        }

        // 更新 unstake 节点对象
        for (let item of this.action.unstakeLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.unstakeData;
            console.log("update unstake data:", nodeData);
            this.nodesInstance.get(item[1]).selfUpdate(item[0], nodeData.coolDownTime, nodeData.unstakeAmount);
        }

        // 更新 vest 节点对象
        for (let item of this.action.vestLabelIDMap) {
            let antvNode = this.antvNodes.get(item[1]);
            let nodeData = antvNode.getData().nodeData.vestData;
            console.log("update vest data:", nodeData);
            this.nodesInstance.get(item[1]).selfUpdate(item[0], nodeData.vestAmount);
        }
    }
}