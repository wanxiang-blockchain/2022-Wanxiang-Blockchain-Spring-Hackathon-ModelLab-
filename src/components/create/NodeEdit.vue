<template >
  <div class="container">
    <p class="container-title">
      Element Attribute Editing
      <span class="node-edit-close-icon"
        ><i class="el-icon-circle-close" @click="close()"></i
      ></span>
    </p>
    <Token v-if="nodeType == 'Token'" :nodeData="nodeData" />
    <Stake v-else-if="nodeType == 'Stake'" :nodeData="nodeData" />
    <Unstake v-else-if="nodeType == 'Unstake'" :nodeData="nodeData" />
    <Vest v-else-if="nodeType == 'Vest'" :nodeData="nodeData" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import Token from "../node/Token";
import Stake from "../node/Stake";
import Unstake from "../node/Unstake";
import Vest from "../node/Vest";
export default {
  props: ["closeNodeEdit"],
  data() {
    return {
      nodeType: "",
      nodeData: null,
    };
  },
  methods: {
    close() {
      this.closeNodeEdit();
    },
  },
  components: {
    Token,
    Stake,
    Unstake,
    Vest,
  },
  computed: {
    ...mapState(["editNode"]),
  },
  watch: {
    editNode(val) {
      this.nodeType = val.getData().type;
      this.nodeData = val.getData().nodeData;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: fixed;
  height: calc(100% - 180px);
  width: 300px;
  right: calc(100% - (100% - 250px) - 195px);
  background-color: #ffffff;
  overflow: scroll;
  margin-top: 70px;
  border-radius: 30px;
  border: 2.5px solid rgb(232, 231, 231);
  box-shadow: 0 0 1px rgba(219, 218, 218, 0.8);
  .container-title {
    margin: 2%;
    background-color: #fff;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    font-weight: 700;
    padding-left: 10px;
    color: #666;
    .node-edit-close-icon {
      float: right;
      margin-right: 10px;
      font-size: 20px;
      cursor: pointer;
      &:hover {
        color: #a09e9e;
      }
    }
  }
}
</style>