import { SET_PROVIDER } from "./mutation-types"

export default {
    // 初始化画布
    init_graph(context, graph) {
        context.commit('INIT_GRAPH', graph)
    },

    // 画布缩放
    zoom_graph(context, type) {
        context.commit('ZOOM_GRAPH', type)
    },
    //定位画布
    positioning_graph(context) {
        context.commit('POSITIONING_GRAPH')
    },
    // 撤销操作(向后)
    undo_graph(context) {
        context.commit('UNDO_GRAPH')
    },
    //返回操作（向前)
    redo_graph(context) {
        context.commit('REDO_GRAPH')
    },
    // 存储画布，目前通过local storage 存储
    storage_graph(context) {
        context.commit('STORAGE_GRAPH')
    },
    //加载已有的画布信息
    load_graph(context) {

        context.commit('LOAD_GRAPH')
    },
    //修改全局的配置项
    modify_configdata(context, params) {
        context.commit('MODIFY_CONFIGDATA', params)
    },
    //导入已有的全局配置项
    load_configdata(context) {
        context.commit('LOAD_CONFIGDATA')
    },

    set_web3_provider(context, provider) {
        context.commit('SET_WEB3_PROVIDER', provider)
    }
}
