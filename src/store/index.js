import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)
const state = {
    //全局画布
    graph: null,
    // 测算引擎
    model: null,
    editNode: null,
    //系统参数
    configData: {
        simulationDays: 0,
        simulationSlot: 0,
        disabled: true,

    },
    //测算次数
    nonce: 0,
    //历史测算数据
    historySimulateData: [],

    uploadDialog: false,
    //web3用户登陆相关
    web3Provider: null,
    user: null,

    //后端响应状态码
    statusCode: {
        SUCCESSED: '500'
    },

    //详情页数据
    detailModelData: null,

    //rule列表
    ruleLists: [],

    editRule: null,
    ruleEditShow: { show: false, add: false, index: 0 }




}

export default new Vuex.Store({
    state,
    actions,
    mutations,
})