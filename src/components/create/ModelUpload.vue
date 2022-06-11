<template >
  <div class="model-upload-dialog">
    <div class="model-input">
      <el-input
        type="textarea"
        placeholder="Please enter the model information of JSON type."
        v-model="modelUpload"
        rows="30"
      >
        >
      </el-input>
    </div>
    <el-button class="submit" @click="submit">Submit Model</el-button>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      modelUpload: "",
    };
  },
  methods: {
    ...mapMutations(["CLEAR_GRAPH", "MODIFY_GRAPH", "CLOSE_UPLOAD_DIALOG"]),
    submit() {
      if (this.modelUpload.length != 0) {
        let modelData = JSON.parse(this.modelUpload);

        const submitModelConfigData = modelData.model.configData;
        //后续需要对内容进行校验
        const submitModelGraph = modelData.model.graph;

        //清空画布
        this.CLEAR_GRAPH();
        this.MODIFY_GRAPH(submitModelGraph.cells);
        this.CLOSE_UPLOAD_DIALOG();
      } else {
        console.log("空内容");
      }
    },
  },
  computed: {
    ...mapState(["graph"]),
  },
};
</script>
<style lang="scss">
.model-upload-dialog {
  overflow: scroll;
  .submit {
    margin-top: 20px;
  }
}
</style>