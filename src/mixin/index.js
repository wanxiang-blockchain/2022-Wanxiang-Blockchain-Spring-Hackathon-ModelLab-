export let nodeMixin = {
    methods: {
        /**
         * 用于判断slider是否符合要求，各个总和相加需<=100
         * @param {int} val 
         * @param {[]} data 
         */
        propChange(val, data) {
            let already = 0;
            data.forEach((item) => {
                if (item.name != val.name) {
                    already += item.prop;
                }
            });
            val.prop = val.prop < 100 - already ? val.prop : 100 - already;
        },
    },

    watch: {
        /**
     * 用于监控节点内容编辑，并调用mutations函数存储
     */
        nodeData: {
            handler(val) {
                this.STORAGE_GRAPH();
            },
            deep: true,
        },
    },

}