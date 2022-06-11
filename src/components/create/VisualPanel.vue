<template >
  <el-collapse-transition>
    <div class="visual-panel">
      <span class="help"
        ><i class="el-icon-question" @click="helpShow = !helpShow"></i>
      </span>

      <div class="charts-container">
        <!-- 调用作图组件，传入对应的数据包含折线图数据、x轴字段名、y、分类字段名 -->
        <LineChart :linedata="lineData" />
      </div>
      <!-- 历史数据选择 -->
      <div class="data-selected-container">
        <span class="select-title">Data Selection</span>
        <div class="select-table">
          <el-table
            ref="multipleTable"
            :data="historyData"
            height="450"
            tooltip-effect="dark"
            style="width: 100%"
            class="history-table"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45"> </el-table-column>
            >
            <el-table-column prop="type" label="ID" width="80">
            </el-table-column>
            <el-table-column fixed="right" label="Operation" width="100">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, historyData)"
                  type="text"
                  size="small"
                >
                  <i
                    class="el-icon-remove-outline"
                    style="font-size: 18px; color: red"
                  ></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="help-container" :class="{ helpShow: helpShow }">
        <span
          ><i class="el-icon-warning" style="color: red"></i>For different types of nodes selected in visual panel, visual data has different meanings: 
          <div
            >Token: data shows the token amount of a participant holds that he can use immediately</div
          >
          <div
            >Stake: data shows the accumulated reward amount of a participant in this staking pool</div
          >
          <div
            >Unstake: data shows the daily unstaked token amount from corresponding staking pool</div
          >
          <div
            >Vest: data shows the daily vested token amount for a participant, following the vest policy</div
          ></span
        >
      </div>
    </div>
  </el-collapse-transition>
</template>
<script>
import LineChart from "./LineChart";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      helpShow: false,
      //被选中的历史数据项
      multipleSelection: null,
      //折线图数据
      lineData: [],
      //历史测算数据
      historyData: [],
    };
  },
  components: {
    LineChart,
  },
  methods: {
    ...mapMutations([
      "LOAD_HISTORY_SIMULATE_DATA",
      "MODIFY_HISTORY_SIMULATE_DATA",
    ]),
    deleteRow(index, rows) {
      rows.splice(index, 1);
      this.MODIFY_HISTORY_SIMULATE_DATA(rows);
    },
    /**
     * TODO
     * 根据测算得到的数据修改该方法
     * 将被选中的数据根据类别type进行标注，并push到折线图数据中
     */
    handleSelectionChange(val) {
      this.lineData = [];
      this.multipleSelection = val;

      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.lineData.push({
          category: this.multipleSelection[i].type,
          data: this.multipleSelection[i].data,
        });
      }
    },
  },
  computed: {
    ...mapState(["historySimulateData"]),
  },
  mounted() {
    // this.LOAD_HISTORY_SIMULATE_DATA();
    this.historyData = this.historySimulateData;
  },
};
</script>
<style lang="scss">
.visual-panel {
  text-align: center;
  overflow: scroll;
  background-color: #f5f5f5;
  .help {
    position: absolute;
    top: 20px;
    left: 230px;
    font-size: 20px;
    cursor: pointer;
  }
  .help-container {
    float: left;
    padding: 0px 20px 0px 20px;
    margin-left: 15px;
    margin-bottom: 5px;
    width: 94%;
    height: 40px;
    background-color: rgba(255, 255, 255, 0);
    text-align: left;
    span {
      padding-left: 10px;
      .el-icon-warning {
        font-size: 20px;
      }
    }
    div {
      padding-left: 30px;
      font-size: 10px;
    }
  }
  .charts-container {
    float: left;
    padding: 0px 20px 0px 20px;
    margin-left: 15px;
    margin-top: 10px;
    width: 68%;
    height: 60%;

    background-color: #fff;
    border: 1px solid rgb(228, 228, 228);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  .data-selected-container {
    float: left;
    margin-top: 30px;
    margin-left: 30px;
    width: 22%;
    height: 70%;

    .select-title {
      display: block;
      margin: 0px auto;

      width: 180px;
      height: 30px;
      line-height: 30px;
      background-color: rgb(58, 58, 58);
      color: rgb(250, 250, 250);
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
    }
    .select-table {
      margin-top: 20px;

      height: 500px;
    }
    .history-table {
      border-radius: 10px;
    }
  }
  .helpShow {
    display: none;
  }
}
</style>