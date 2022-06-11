<template >
  <div class="top-container">
    <div class="top">
      <!-- 工具栏 -->
      <div class="tool-bar">
        <el-tooltip
          class="tooltip"
          content="Enlarge"
          placement="bottom"
          effect="light"
        >
          <i @click="ZOOM_GRAPH('up')" class="el-icon-zoom-in"></i>
        </el-tooltip>
        <el-tooltip
          class="tooltip"
          content="Lessen"
          placement="bottom"
          effect="light"
        >
          <i @click="ZOOM_GRAPH('down')" class="el-icon-zoom-out"></i>
        </el-tooltip>
        <el-tooltip
          class="tooltip"
          content="Undo operation"
          placement="bottom"
          effect="light"
        >
          <i @click="UNDO_GRAPH()" class="el-icon-back"></i>
        </el-tooltip>
        <el-tooltip
          class="tooltip"
          content="Redo operation"
          placement="bottom"
          effect="light"
        >
          <i @click="REDO_GRAPH()" class="el-icon-right"></i>
        </el-tooltip>

        <el-tooltip
          class="tooltip"
          content="Start simulation"
          placement="bottom"
          effect="light"
          v-if="nowait"
        >
          <i @click="startSimulation()" class="el-icon-video-play"></i>
        </el-tooltip>
        <el-tooltip
          class="tooltip"
          content="Start simulation"
          placement="bottom"
          effect="light"
          v-else
        >
          <i class="el-icon-loading"></i>
        </el-tooltip>

        <el-tooltip
          class="tooltip"
          content="Pause simulation"
          placement="bottom"
          effect="light"
        >
          <i @click="pauseSimulation()" class="el-icon-video-pause"></i>
        </el-tooltip>
        <el-tooltip
          class="tooltip"
          content="End simulation"
          placement="bottom"
          effect="light"
        >
          <i @click="endSimulation()" class="el-icon-circle-close"></i>
        </el-tooltip>
        <!-- <el-tooltip
          class="tooltip"
          content="Upload existing models"
          placement="bottom"
          effect="light"
        >
          <i @click="uploadGraph()" class="el-icon-upload2"></i>
        </el-tooltip> -->
        <!-- <el-tooltip
          class="tooltip"
          content="Download model"
          placement="bottom"
          effect="light"
        >
          <i @click="downloadGraph()" class="el-icon-download"></i>
        </el-tooltip> -->
        <el-tooltip
          class="tooltip"
          content="Download model"
          placement="bottom"
          effect="light"
        >
          <i @click="saveGraphToPNG()" class="el-icon-camera-solid"></i>
        </el-tooltip>

        <el-tooltip
          class="tooltip"
          content="Remove cells "
          placement="bottom"
          effect="light"
        >
          <i @click="REMOVE_CELLS()" class="el-icon-delete"></i>
        </el-tooltip>

        <el-tooltip
          class="tooltip"
          content="Focus canvas "
          placement="bottom"
          effect="light"
        >
          <i @click="POSITIONING_GRAPH()" class="el-icon-full-screen"></i>
        </el-tooltip>
      </div>
      <!-- 系统参数栏 -->
      <div class="config-data-box">
        <!-- <span>Simulation Days</span> -->

        <!-- <el-input
          size="mini"
          class="config-data-input"
          v-model="currentSimulationDays"
          placeholder=""
          :disabled="modifyDisabled"
        ></el-input> -->

        <span class="config-data-input">Simulation Days</span>
        <el-slider
          v-model="configData.simulationDays"
          class="day-slider"
          :min="1"
          :max="5000"
          :step="1"
          :change="modifyConfigData()"
        ></el-slider>
        <span class="config-data-input">Simulation Slot</span>
        <el-slider
          v-model="configData.simulationSlot"
          class="day-slider"
          :min="1"
          :max="365"
          :step="1"
          :change="modifyConfigData()"
        ></el-slider>
        <span class="config-data-input">Current Day: </span>
        <span v-text="getModelTime()"></span>

        <!-- <div class="config-data-input">Current Day
          <div v-text="getModelTime()"></div>
        </div> -->
      </div>
      <!-- 系统参数修改按钮 -->
      <!-- <div class="config-button">
        <div class="setting">
          <i
            class="el-icon-setting"
            @click="modifyDisabled = !modifyDisabled"
            v-if="modifyDisabled"
          ></i>
          <i
            class="el-icon-success"
            @click="modifyConfigData()"
            v-if="!modifyDisabled"
          ></i>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { Model } from "../../graph/model";
import { DataUri } from "@antv/x6";
import { setStore } from "../../utils/storage";
import { PropertyVisitor } from "../../graph/propertyVisitor";

const antlr4 = require("antlr4");
const InputStream = antlr4.InputStream;
const CommonTokenStream = antlr4.CommonTokenStream;
const GrammarParser = require("../../parser/PropertyParser").PropertyParser;
const GrammarLexer = require("../../parser/PropertyLexer").PropertyLexer;

export default {
  data() {
    return {
      currentSimulationDays: null,
      currentSimulationSlot: null,
      modifyDisabled: true,
      dialogLogInVisible: false,
      nowait: true,
    };
  },
  components: {},
  methods: {
    ...mapMutations([
      "ZOOM_GRAPH",
      "POSITIONING_GRAPH",
      "UNDO_GRAPH",
      "REDO_GRAPH",
      "MODIFY_CONFIGDATA",
      "LOAD_CONFIGDATA",
      "SHOW_UPLOAD_DIALOG",
      "SET_MODEL",
      "REMOVE_CELLS",
      "APPEND_HISTORY_SIMULATE_DATA",
      "SET_HISTORY_SIMULATE_DATA",
      "SET_NONCE",
    ]),
    formatTooltip(val) {
      return val / 100;
    },
    /**
    修改全局配置信息
     */
    modifyConfigData() {
      setStore("config_data", this.configData);
    },

    /**
    下载当前模型为json文件
     */
    downloadGraph() {
      //获取时间戳
      var timestamp = new Date().valueOf();
      //将全局配置信息和画布数据封装成对象
      let modelData = {
        model: { configData: this.configData, graph: this.graph },
      };
      const filename = "Model" + timestamp + ".json";
      const data = JSON.stringify(modelData, undefined, 4);
      let blob = new Blob([data], { type: "text/json" }),
        a = document.createElement("a");
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      // 标签 data- 嵌入自定义属性  屏蔽后也可正常下载
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      // 添加鼠标事件
      let event = new MouseEvent("click", {});
      // 向一个指定的事件目标派发一个事件
      a.dispatchEvent(event);
    },
    /**
    上传已有的模型，json文件
     */
    uploadGraph() {
      this.SHOW_UPLOAD_DIALOG();
    },
    /*
    开始测算
    */
    async startSimulation() {
      // 测算开始，开启 loading 图标
      this.nowait = false;

      // 模型初次测算时
      if (this.model == null) {
        console.log(
          "starting simulation...",
          this.configData.simulationDays,
          "days",
          " with control slot:",
          this.configData.simulationSlot,
          "days"
        );
        var model = new Model(
          this.graph,
          this.configData.simulationDays,
          this.configData.simulationSlot
        );

        this.SET_MODEL(model);

        this.APPEND_HISTORY_SIMULATE_DATA({
          type: this.nonce,
          data: this.model.data,
        });
      } else {
        // TODO [Done] 模型已经存在时，其相关参数需要根据画布上的最新状态来更新
        this.model.selfUpdate(
          this.graph,
          this.configData.simulationDays,
          this.configData.simulationSlot
        );
      }
      // 设置 model 的状态为 1 - 正在测算中
      this.model.status = 1;
      await this.model.start();

      // 测算终止（正常终止 / 暂停终止）时更新测算历史数据
      this.SET_HISTORY_SIMULATE_DATA(this.nocne, this.model.data);

      if (this.model.status != 2) {
        // 当模型处于非 Pause 状态时
        console.log("the simulation is ended");
      }

      //  测算终止（正常终止 / 暂停终止），关闭 loading 图标
      this.nowait = true;

      this.checkProperty();
    },
    /*
    暂停测算
    */
    pauseSimulation() {
      // TODO 处于暂停状态中，画布上的某些不可改的参数应该置为灰色或不可选(不可新建、删除节点；不可更改的参数如)

      // 测算暂停，关闭 loading 图标
      this.nowait = true;

      console.log("pausing simulation...");
      if (this.model == null) {
        console.log("there's no model running!");
      } else {
        // 修改模型的状态为 2 - 暂停
        this.model.status = 2;
        console.log(
          "The model is paused. ",
          "You can only adjust params on existing model. ",
          "If you need to adjust the architecture of model, please END current simulation first"
        );
      }
    },
    /*
    结束当前测算
    */
    endSimulation() {
      // 测算暂停，关闭 loading 图标
      this.nowait = true;
      console.log("ending simulation...");
      // 修改模型的状态为 0 - 停止
      this.model.status = 0;
      // 将当前模型置为 null
      this.SET_MODEL(null);
      console.log("the simulation is ended");
      // 当前测算结束后，将记录历史数据次数的 nonce 值增加 1
      this.SET_NONCE(this.nonce + 1);
    },
    /**
     * 下载模型图片
     */
    saveGraphToPNG() {
      this.graph.toPNG(
        (dataUri) => {
          // 下载
          DataUri.downloadDataUri(dataUri, "chart.png");
        },
        {
          padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          },
        }
      );
    },
    /**
     * 获取模型测算进行中的时间
     */
    getModelTime() {
      if (this.model == null) return 0;
      return this.model.curDay;
    },
    /**
     * 检查 Property 列表中的所有 Property
     */
    checkProperty() {
      for (let i = 0; i < this.ruleLists.length; i++) {
        const inputStream = new InputStream(this.ruleLists[i].content);
        const lexer = new GrammarLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new GrammarParser(tokenStream);
        parser.removeErrorListeners();
        parser.addErrorListener({
          syntaxError: (recognizer, offendingSymbol, line, column, msg, err) => {
            console.error(`${offendingSymbol} line ${line}, col ${column}: ${msg}`);
            throw err;
          }
        });
        const tree = parser.check();
        // parser.getInvokingContext()
        let visitor = new PropertyVisitor(this.model.curDay, this.historySimulateData[this.historySimulateData.length - 1].data, this.graph.model.getNodes());
        tree.accept(visitor);
        if (visitor.state >= 4) {
          this.ruleLists[i].status = true;
        }
      }
      
    }

  },
  computed: {
    ...mapState(["configData", "graph", "model", "nonce", "ruleLists", "historySimulateData"]),
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.el-dropdown-menu {
  .el-dropdown-menu__item {
    .el-button {
      color: #555555;
      font-size: 15px;
    }
    &:hover {
      color: #555555;
      background-color: #ecebeb;
    }
  }
}
.top-container {
  height: 50px;
}
.top {
  position: fixed;
  //z-index: 2000;
  bottom: 80px;
  left: 18%;
  right: 22%;
  // overflow-x: scroll;
  line-height: 50px;
  height: 50px;
  width: 78%;

  font-family: "Times New Roman", Georgia, Serif;
  font-size: 14px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 0 2px rgba(180, 180, 180, 0.8);

  .tool-bar {
    float: left;
    margin-left: 15px;
    width: 380px;
    border-radius: 20px;
    // box-shadow: 0 0 2px rgba(180, 180, 180, 0.8);

    i {
      margin: 0px 10px;
      font-size: 18px;
      color: #555555;
      font-weight: bold;
      cursor: pointer;
      &:hover {
        // color: #9a9a9c;
        color: #409eff;
      }
    }
  }
  .config-data-box {
    float: left;
    text-align: center;
    span {
      margin-left: 2px;
    }
    .config-data-input {
      float: left;
      width: 100px;
      margin-left: 20px;
    }
    .divider {
      margin-left: 25px;
    }
    .day-slider {
      float: left;
      margin: 7px 0px 0px 15px;
      width: 280px;
      /deep/ .el-slider__bar {
          background-color: rgb(94, 91, 91);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(94, 91, 91);
          transition: 0s;
        }
    }
    .timer {
      float: left;

      // margin: 7px 0px 0px 15px;

      width: 20px;
    }
  }
  .config-button {
    float: right;
    margin-right: 60px;
    .log-in {
      float: left;
      margin-right: 10px;
      .dropdown-icon {
        cursor: pointer;
        font-size: 25px;
        float: left;
        color: rgb(99, 99, 99);
        &:hover {
          color: #a3a3a3;
        }
      }
    }
    .setting {
      font-size: 25px;
      float: right;
      margin-right: 200px;
      color: rgb(99, 99, 99);
      &:hover {
        color: #a3a3a3;
      }
    }
  }
}
</style>