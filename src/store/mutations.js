import {
    INIT_GRAPH, ZOOM_GRAPH, POSITIONING_GRAPH, UNDO_GRAPH, REDO_GRAPH, STORAGE_GRAPH, LOAD_GRAPH, MODIFY_CONFIGDATA,
    LOAD_CONFIGDATA, LOAD_HISTORY_SIMULATE_DATA, MODIFY_HISTORY_SIMULATE_DATA, SET_HISTORY_SIMULATE_DATA,
    APPEND_HISTORY_SIMULATE_DATA, SET_NONCE, MODIFY_GRAPH, CLEAR_GRAPH, SHOW_UPLOAD_DIALOG, CLOSE_UPLOAD_DIALOG,
    SET_MODEL, SET_EDIT_CELLS, REMOVE_CELLS, SET_WEB3_PROVIDER, SET_USER, SET_EDIT_RULE, SAVE_EDIT_RULE, LOAD_RULE_LISTS
} from '../store/mutation-types'
import { setStore, getStore } from '../utils/storage';
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default {

    //初始化画布
    [INIT_GRAPH](state, graph) {
        state.graph = graph;
    },

    // 画布缩放
    [ZOOM_GRAPH](state, type) {
        if (type == "down") {
            state.graph.zoom(-0.2);
        } else {
            state.graph.zoom(0.2);
        }
    },
    //定位画布
    [POSITIONING_GRAPH](state) {
        state.graph.centerContent();
    },
    // 撤销操作(向后)
    [UNDO_GRAPH](state) {
        state.graph.undo();
    },
    //返回操作（向前)
    [REDO_GRAPH](state) {
        state.graph.redo();
    },
    // 存储画布，目前通过local storage 存储
    [STORAGE_GRAPH](state) {
        setStore("graph", state.graph);
    },
    //加载已有的画布信息
    [LOAD_GRAPH](state) {

        if (getStore("graph")) {
            const cells = JSON.parse(getStore("graph")).cells;
            cells.forEach((item) => {
                if (item.shape != 'edge') {
                    state.graph.addNode(item);
                }
            });
            cells.forEach((item) => {
                if (item.shape == 'edge') {
                    state.graph.addEdge(item);
                }
            });
        }
    },

    /**
     * 获取到新的model时调用，先将已有画布的内容删除掉，在将新的节点添加
     * @param {*} state 
     * @param {*} newGraph 
     */
    [MODIFY_GRAPH](state, newGraph) {
        //
        newGraph.forEach((item) => {
            if (item.shape != 'edge') {
                state.graph.addNode(item);
            }
        });
        newGraph.forEach((item) => {
            if (item.shape == 'edge') {
                state.graph.addEdge(item);
            }
        });
        setStore("graph", state.graph);
    },
    /**
     * 清空画布
     * @param {*} state 
     */
    [CLEAR_GRAPH](state) {
        state.graph.clearCells();
        setStore("graph", state.graph);
    },


    //修改全局的配置项
    [MODIFY_CONFIGDATA](state, params) {
        state.configData.simulationDays = params[0];
        state.configData.simulationSlot = params[1];
        setStore("config_data", state.configData);
    },
    //导入已有的全局配置项
    [LOAD_CONFIGDATA](state) {
        if (getStore("config_data")) {
            state.configData = JSON.parse(getStore("config_data"));
        }
    },

    //加载历史测算数据
    [LOAD_HISTORY_SIMULATE_DATA](state) {
        if (getStore("history_simulate_data")) {
            state.historySimulateData = JSON.parse(getStore("history_simulate_data"));
        }
    },
    //存储历史测算数据(修改数据就调用该方法)
    [MODIFY_HISTORY_SIMULATE_DATA](state, newData) {
        state.historySimulateData = newData;
        setStore("history_simulate_data", newData);
    },
    //追加历史测算数据
    [APPEND_HISTORY_SIMULATE_DATA](state, data) {
        state.historySimulateData.push(data);
        // setStore("history_simulate_data", state.historySimulateData);
    },
    // 设置某次历史测算数据
    [SET_HISTORY_SIMULATE_DATA](state, index, data) {
        state.historySimulateData[index] = data;
    },
    //设置测算次数
    [SET_NONCE](state, data) {
        state.nonce = data;
    },

    //上传窗口，后期清除
    [SHOW_UPLOAD_DIALOG](state) {
        state.uploadDialog = true;
    },

    [CLOSE_UPLOAD_DIALOG](state) {
        state.uploadDialog = false;
    },

    // 设置测算模型
    [SET_MODEL](state, data) {
        state.model = data;
    },
    //删除选中的元素
    [REMOVE_CELLS](state) {
        const cells = state.graph.getSelectedCells();
        if (cells.length) {
            state.graph.removeCells(cells);
            setStore("graph", state.graph);
        }
    },
    //右键选中节点时调用该方法，editnode作为编辑栏中内容
    [SET_EDIT_CELLS](state, cell) {
        state.editNode = cell;
    },

    //web3相关
    [SET_WEB3_PROVIDER](state, provider) {
        state.web3Provider = provider
    },
    //设置账户并存储在localstorage中
    [SET_USER](state, user) {
        state.user = user
        setStore("user", user);
    },
    [SET_EDIT_RULE](state, item) {
        state.editRule = item
        setStore("ruleLists", state.ruleLists);
    },
    [SAVE_EDIT_RULE](state, item) {
        if (state.ruleEditShow.add) {
            state.ruleLists.push(item)
        } else {
            Vue.set(state.ruleLists, state.ruleEditShow.index, item)
        }
        setStore("rule_lists", state.ruleLists);
    },

    [LOAD_RULE_LISTS](state) {
        if (getStore("rule_lists")) {
            state.ruleLists = JSON.parse(getStore("rule_lists"));
        }
    }


}