<template>
  <div class="models">
    <div class="draw">
      <!-- 左侧控件 -->
      <div class="left-container">
        <div class="left" id="left"></div>

        <!-- Mint 按钮 -->
        <el-button
          type="text"
          class="mint-btn"
          @click="centerDialogVisible = true"
        >
          Mint
        </el-button>
        <el-dialog
          title="Mint New Model"
          :visible.sync="centerDialogVisible"
          width="30%"
          center
        >
          <MintForm :close="closeMintEdit" />
          <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">Confirm</el-button>
          </span> -->
        </el-dialog>
        <div class="rule-list">
          <RuleList />
        </div>
      </div>
      <div class="draw-main-box">
        <!-- 面板中心区域 -->
        <div class="editor-section">
          <div id="canvas-main" class="canvas-main"></div>
        </div>
      </div>
      <!-- 工具导航栏 -->
      <!-- <div class="tools-navbar">
        <div class="tools-navbar" id="tools-navbar">
          <ToolsNavbar />
        </div>
      </div> -->
      <!-- 右侧控件 -->
      <div class="right-default">
        <ToolsNavbar />
      </div>
      <transition name="el-fade-in-linear">
        <div class="right-container" v-bind:class="{ show: nodeEditShow }">
          <NodeEdit :closeNodeEdit="closeNodeEdit" />
        </div>
      </transition>
    </div>
    <!-- 数据可视化面板 -->
    <div class="data-visual-panel">
      <el-button class="visual-button" @click="visualPanelVisible = true">
        Data Visualization
      </el-button>
    </div>
    <el-dialog
      title="Modeling data visualization"
      :visible.sync="visualPanelVisible"
      class="data-dialog"
      width="1200px"
    >
      <VisualPanel />
    </el-dialog>
  </div>
</template>

<script>
import VisualPanel from "./VisualPanel";
import ModelUpload from "./ModelUpload";
import NodeEdit from "./NodeEdit";
import ToolsNavbar from "./RightToolsNavbar";
import MintForm from "../Template/MintForm";
import RuleList from "../create/RuleList";
import { Addon, Graph, Shape } from "@antv/x6";
const { Stencil } = Addon;
const { Rect, Circle } = Shape;
// 导入链接桩配置
import { PortsConfig } from "../../graph/portsConfig";
import { mapState, mapMutations } from "vuex";
import { querymodel } from "../../api/index";
import { setStore } from "../../utils/storage";
import { connectMetamask } from "../../api/web3/contracts";
import { downloadFromIPFS } from "../../utils/ipfsUtil";
import { querymetadata } from "../../api/index";
import { decryptDataEOA, decryptDataNormal } from "../../utils/cryptoUtil";

export default {
  data() {
    return {
      loaded: false,
      nodeEditShow: true,
      visualPanelVisible: false,
      // uploadShow: false,
      centerDialogVisible: false,
    };
  },
  components: {
    VisualPanel,
    ModelUpload,
    NodeEdit,
    ToolsNavbar,
    MintForm,
    RuleList,
  },
  methods: {
    ...mapMutations([
      "STORAGE_GRAPH",
      "LOAD_GRAPH",
      "POSITIONING_GRAPH",
      "INIT_GRAPH",
      "CLOSE_UPLOAD_DIALOG",
      "SET_EDIT_CELLS",
      "MODIFY_HISTORY_SIMULATE_DATA",
      "MODIFY_CONFIGDATA",
      "SET_USER",
      "LOAD_RULE_LISTS",
    ]),

    // 画布初始化
    initGrapg() {
      let cur_graph = new Graph({
        container: document.getElementById("canvas-main"),
        selecting: true,
        autoResize: true,
        history: true,
        background: {
          color: "#fff",
        },
        grid: {
          size: 30,
          visible: true,
        },
        snapline: {
          enabled: true,
          sharp: true,
        },
        scroller: {
          enabled: true,
          pageVisible: false,
          pageBreak: false,
          pannable: true,
          modifiers: ["shift"],
        },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: ["ctrl", "meta"],
          minScale: 0.5,
          maxScale: 3,
        },
        connecting: {
          router: {
            name: "manhattan",
            args: {
              padding: 1,
            },
          },
          connector: {
            name: "rounded",
            args: {
              radius: 8,
            },
          },
          anchor: "center",
          connectionPoint: "anchor",
          allowBlank: false,
          snap: {
            radius: 20,
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  // stroke: {
                  //   type: "linearGradient",
                  //   stops: [
                  //     { offset: "0%", color: "#ccc" },
                  //     { offset: "50%", color: "#73d13d" },
                  //     { offset: "100%", color: "#ccc" },
                  //   ],
                  // },
                  stroke: "#b3b3b3",
                  strokeWidth: 2,
                  targetMarker: {
                    name: "block",
                    width: 6,
                    height: 8,
                    // fill: "#ccc", // 使用自定义填充色
                    stroke: "#b3b3b3", // 使用自定义边框色
                  },
                },
              },

              data: {
                type: "Edge",
                inside: 0.5,
                outside: 0.5,
              },
              zIndex: 0,
            });
          },
          validateConnection({ targetMagnet }) {
            return !!targetMagnet;
          },
        },
        highlighting: {
          magnetAdsorbed: {
            name: "stroke",
            args: {
              attrs: {
                fill: "#5F95FF",
                stroke: "#5F95FF",
              },
            },
          },
        },
        resizing: {
          enabled: true,
        },
        selecting: {
          enabled: true,
          rubberband: true,
          showNodeSelectionBox: true,
        },

        keyboard: true,
        clipboard: true,
      });
      this.INIT_GRAPH(cur_graph);
    },

    // 初始化画布侧边栏
    initStencil() {
      this.stencil = new Stencil({
        title: "Components",
        target: this.graph,

        //collapsable: true,
        stencilGraphWidth: 200,
        stencilGraphHeight: 180,
        groups: [
          {
            name: "Components",
          },
        ],
      });

      document.getElementById("left").appendChild(this.stencil.container);
      const stake = new Rect({
        width: 70,
        height: 40,
        data: {
          //业务数据
          nodeData: {
            stakeData: {
              rewardPolicyFrom: "",
              stakeAmount: [
                { name: "Team", prop: 0, class: "team-slider" },
                { name: "Investor", prop: 0, class: "investor-slider" },
                { name: "Advisor", prop: 0, class: "advisor-slider" },
                { name: "Foundation", prop: 0, class: "foundation-slider" },
                { name: "Community", prop: 0, class: "community-slider" },
              ],
            },
          },
          type: "Stake",
        },
        attrs: {
          rect: {
            fill: "rgb(156,192,2327)",
            stroke: "#E6A23C",
            strokeWidth: 0,
          },
          body: {
            rx: 15,
            ry: 15,
          },
          text: { text: "Stake", fill: "#fff" },
        },
        ports: PortsConfig,
      });

      const unStake = new Rect({
        width: 70,
        height: 40,
        data: {
          //业务数据
          nodeData: {
            unstakeData: {
              coolDownTime: 0,
              unstakeAmount: [
                { name: "Team", prop: 0, class: "team-slider" },
                { name: "Investor", prop: 0, class: "investor-slider" },
                { name: "Advisor", prop: 0, class: "advisor-slider" },
                { name: "Foundation", prop: 0, class: "foundation-slider" },
                { name: "Community", prop: 0, class: "community-slider" },
              ],
            },
          },
          type: "Unstake",
        },
        attrs: {
          rect: { fill: "rgb(164,205,231)", stroke: "#67C23A", strokeWidth: 0 },
          text: { text: "Unstake", fill: "#fff" },
          body: {
            rx: 15,
            ry: 15,
          },
        },
        ports: PortsConfig,
      });

      const token = new Circle({
        width: 60,
        height: 60,
        data: {
          //业务数据
          nodeData: {
            tokenData: {
              totalSupply: 0,
              allocations: [
                { name: "Team", prop: 0, class: "team-slider" },
                { name: "Investor", prop: 0, class: "investor-slider" },
                { name: "Advisor", prop: 0, class: "advisor-slider" },
                { name: "Foundation", prop: 0, class: "foundation-slider" },
                { name: "Community", prop: 0, class: "community-slider" },
              ],
              community: {
                allocations: [
                  { name: "Airdrop", prop: 0, class: "airdrop-turntable" },
                  { name: "Staking", prop: 0, class: "staking-turntable" },
                ],
                stakingLifetime: 0,
                stakingRewardRefresh: 0,
                stakingRewardDecreaseFactor: 0,
              },
            },
          },
          type: "Token",
        },
        attrs: {
          circle: {
            fill: "rgb(183,192,228)",
            strokeWidth: 0,
            stroke: "#409EFF",
          },
          text: { text: "Token", fill: "#fff" },
        },
        ports: PortsConfig,
      });

      const vest = new Rect({
        width: 70,
        height: 40,
        data: {
          //业务数据
          nodeData: {
            vestData: {
              vestAmount: [
                {
                  name: "Team",
                  prop: 0,
                  class: "team-slider",
                  lockUpTime: 0,
                  releasePeriod: 0,
                  cliff: 0,
                },
                {
                  name: "Investor",
                  prop: 0,
                  class: "investor-slider",
                  lockUpTime: 0,
                  releasePeriod: 0,
                  cliff: 0,
                },
                {
                  name: "Advisor",
                  prop: 0,
                  class: "advisor-slider",
                  lockUpTime: 0,
                  releasePeriod: 0,
                  cliff: 0,
                },
                {
                  name: "Foundation",
                  prop: 0,
                  class: "foundation-slider",
                  lockUpTime: 0,
                  releasePeriod: 0,
                  cliff: 0,
                },
                {
                  name: "Community",
                  prop: 0,
                  class: "community-slider",
                  lockUpTime: 0,
                  releasePeriod: 0,
                  cliff: 0,
                },
              ],
            },
          },
          type: "Vest",
        },
        attrs: {
          body: {
            rx: 15,
            ry: 15,
          },
          rect: {
            fill: "rgb(205,149,187)",
            stroke: "#F56C6C",
            // stroke: {
            //   type: "linearGradient",
            //   stops: [
            //     { offset: "0%", color: "#ccc" },
            //     { offset: "50%", color: "#73d13d" },
            //     { offset: "100%", color: "#ccc" },
            //   ],
            // },
            strokeWidth: 0,
          },
          text: { text: "Vest", fill: "#fff" },
        },
        ports: PortsConfig,
      });

      this.stencil.load(
        [token.clone(), vest.clone(), stake.clone(), unStake.clone()],
        "Components"
      );
    },
    //初始化快捷键
    initShortcutkey() {
      //快捷事件
      this.graph.bindKey(["meta+c", "ctrl+c"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.copy(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+x", "ctrl+x"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.cut(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+v", "ctrl+v"], () => {
        if (!this.graph.isClipboardEmpty()) {
          const cells = this.graph.paste({ offset: 32 });
          this.graph.cleanSelection();
          this.graph.select(cells);
        }
        return false;
      });
      //undo redo
      this.graph.bindKey(["meta+z", "ctrl+z"], () => {
        if (this.graph.history.canUndo()) {
          this.graph.history.undo();
        }
        return false;
      });
      this.graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
        if (this.graph.history.canRedo()) {
          this.graph.history.redo();
        }
        return false;
      });

      // select all
      this.graph.bindKey(["meta+a", "ctrl+a"], () => {
        const nodes = this.graph.getNodes();
        if (nodes) {
          this.graph.select(nodes);
        }
      });

      // zoom
      this.graph.bindKey(["ctrl+1", "meta+1"], () => {
        const zoom = this.graph.zoom();
        if (zoom < 1.5) {
          this.graph.zoom(0.1);
        }
      });
      this.graph.bindKey(["ctrl+2", "meta+2"], () => {
        const zoom = this.graph.zoom();
        if (zoom > 0.5) {
          this.graph.zoom(-0.1);
        }
      });
    },
    initWatchEvent() {
      // 节点编辑
      this.graph.on("cell:contextmenu", ({ e, x, y, cell, view }) => {
        // TODO (Xufei) 需要重新设计 Token 不能被编辑的逻辑 Token.type == 2 的不能被编辑？
        // if (
        //   cell.getData().type == "Token" &&
        //   this.graph.getPredecessors(cell).length != 0
        // ) {
        //   this.$message({
        //     showClose: true,
        //     message: "The current node cannot be edited!",
        //     type: "warning",
        //   });
        //   return;
        // }
        this.nodeEditShow = false;
        this.SET_EDIT_CELLS(cell);
      });
      // 注册监听事件，当新增节点或边调用，实时存储
      this.graph.on("node:added", ({ cell, options }) => {
        this.STORAGE_GRAPH();
      });

      this.graph.on("cell:added", ({ cell, options }) => {
        this.STORAGE_GRAPH();
      });
      this.graph.on("cell:changed", ({ cell, options }) => {
        this.STORAGE_GRAPH();
      });
      this.graph.on("cell:removed", ({ cell, options }) => {
        this.STORAGE_GRAPH();
      });
      // 控制连接桩显示/隐藏
      const showPorts = (ports, show) => {
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
          ports[i].style.visibility = show ? "visible" : "hidden";
        }
      };
      this.graph.on("node:mouseenter", () => {
        const container = document.getElementById("canvas-main");
        const ports = container.querySelectorAll(".x6-port-body");
        showPorts(ports, true);
      });
      this.graph.on("node:mouseleave", () => {
        const container = document.getElementById("canvas-main");
        const ports = container.querySelectorAll(".x6-port-body");
        showPorts(ports, false);
      });
      this.graph.on("cell:dblclick", ({ cell, e }) => {
        const name = cell.isEdge() ? "edge-editor" : "node-editor";
        cell.removeTool(name);
        cell.addTools([
          {
            name,
            args: {
              event: e,
            },
          },
        ]);
      });
    },
    // 节点编辑面板
    closeNodeEdit() {
      this.nodeEditShow = true;
    },
    closeMintEdit() {
      this.centerDialogVisible = false;
    },
    loadGraphFromBack() {
      if (this.$route.query.nftId == null) {
        //导入已有节点信息
        this.LOAD_GRAPH();
        //进行一次聚焦
        this.POSITIONING_GRAPH();
        return;
      }

      connectMetamask(this.web3Provider).then((response) => {
        if (response.status) {
          this.SET_USER(response.account[0]);

          querymetadata(this.$route.query.nftId).then((metadata) => {
            if (metadata.message_code == this.statusCode.SUCCESSED) {
              decryptDataEOA(metadata.data.enckey, this.user).then((decryptKey) => {
              console.log("decrypted key:", decryptKey);
              console.log("privURL:",metadata.data.privUrl);
              downloadFromIPFS(metadata.data.privUrl).then((secretData) => {
                console.log("private data:", secretData);
                let decrypted = decryptDataNormal(secretData, decryptKey);
                let subSecretData = decrypted.split(",,,");

                let params = subSecretData[1];
                let result = subSecretData[2];

                setStore("graph", subSecretData[0]);
                params = JSON.parse(params);
                this.MODIFY_CONFIGDATA([
                  params.configData.simulationDays,
                  params.configData.simulationSlot,
                ]);
                this.MODIFY_HISTORY_SIMULATE_DATA(JSON.parse(result));
                  
                //导入已有节点信息
                this.LOAD_GRAPH();
                //进行一次聚焦
                this.POSITIONING_GRAPH();
              });

              });

            } else {
              console.error("FAIL sync mint data to database");
            }
          });
        } else {
          this.$notify.error({
            title: "Error",
            message: "Identity verification failed!",
            position: "bottom-right",
          });
          this.$router.push({
            path: "/create",
          });
        }
      });
    },
  },

  mounted() {
    // 初始化面板
    this.initGrapg();
    // 初始化面板相关快捷键
    this.initShortcutkey();
    // 初始化左侧控件
    this.initStencil();

    //判断是否是由详情页跳转过来的
    this.loadGraphFromBack();
    //初始化相关监听事件
    this.initWatchEvent();
    this.LOAD_RULE_LISTS();
  },
  computed: {
    ...mapState([
      "graph",
      "uploadDialog",
      "editNode",
      "statusCode",
      "user",
      "historySimulateData",
    ]),
  },
  watch: {
    // uploadDialog(val) {
    //   this.uploadShow = val;
    // },
    // uploadShow(val) {
    //   if (!val) {
    //     this.CLOSE_UPLOAD_DIALOG();
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.models {
  .draw {
    .left-container {
      width: 200px;
      height: 100%;
      .left {
        position: fixed;
        top: 120px;
        width: 200px;
        height: 220px;
        left: 60px;
        box-shadow: 0 0 6px rgba(180, 180, 180, 0.8);
        border-radius: 20px;
        // border: #e9e9e9 1px solid;

        /deep/ .x6-widget-stencil-content {
          background-color: #fff;
        }
        /deep/ .x6-widget-stencil-group-title {
          background-color: #fff;
        }
        /deep/ .x6-widget-stencil-content {
          border-radius: inherit;
        }
        /deep/.x6-widget-stencil-title {
          border-radius: 20px;
        }
        /deep/ .x6-widget-stencil {
          border-radius: 20px;
        }
      }

      .mint-btn {
        background-color: #fff !important;
        border: #858585 !important;
        color: #616060 !important;
        position: fixed;
        top: 450px;
        width: 200px;
        height: 40px;
        left: 60px;
        box-shadow: 0 0 6px rgba(180, 180, 180, 0.8) !important;
        border-radius: 20px;
      }

      .rule-list {
        position: fixed;
        top: 520px;
        left: 60px;
        border-radius: 20px;
        box-shadow: 0 0 6px rgba(180, 180, 180, 0.8);
        height: calc(100% - 580px);
      }
    }

    .draw-main-box {
      position: fixed;
      left: 250px;
      // overflow: scroll;
      width: calc(100% - 250px);
      height: 100%;
      //background: url("../../assets/bg.png");

      .editor-section {
        display: flex;
        // overflow: scroll;
        margin-top: 40px;
        margin-left: 60px;
        //width: 70%;
        left: 250px;
        width: calc(100% - 480px);
        height: calc(100% - 180px);
        // border: solid 2px #f4f4f4;
        box-shadow: 0 0 6px rgba(180, 180, 180, 0.8);
        border-radius: 30px;

        /deep/ .x6-graph-scroller {
          border-radius: 30px;
        }

        /deep/ .x6-graph-scroller-pannable {
          border-radius: 30px;
        }

        .canvas-main {
          flex: 1;
        }
      }
    }
    .right-default {
      /* position: fixed;
      height: calc(100% - 180px);
      width: 280px;
      top: 120px;
      right: 3%;
      background-color: #ffffff;
      overflow: scroll;
      border-radius: 30px;
      border: 1px solid rgb(232, 231, 231);
      box-shadow: 0 0 3px rgba(180, 180, 180, 0.8);  */

      .config-data-input {
        width: 200px;
        margin-left: 15px;
        margin-top: 20px;
      }
      .day-slider {
        margin-left: 15px;
        margin-bottom: 20px;
        width: 250px;
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
    .right-container {
      width: 300px;
      position: fixed;
      top: 50px;
      right: 0px;
      height: 82.5%;
    }
  }
  .data-visual-panel {
    position: fixed;
    bottom: 20px;
    left: 20px;
    .visual-button {
      // display: flex;
      // width: 100%;
      // &:hover {
      //   cursor: pointer;
      // }
      // span {
      //   margin: auto;
      //   padding: 0.3em 1em 0.5em;
      //   background: #409eff;
      //   color: white;

      //   border-radius: 3px;
      //   box-shadow: 0 0 0.5em #858585;
      //   // animation: shake 2s ease 0s infinite;
      //   // animation-play-state: paused;

      //   // &:hover {
      //   //   animation-play-state: running;
      //   // }
      // }

      background-color: #fff !important;
      border: #858585 !important;
      color: #616060 !important;
      position: fixed;
      top: 380px;
      width: 200px;
      height: 40px;
      left: 60px;
      box-shadow: 0 0 6px rgba(180, 180, 180, 0.8) !important;
      border-radius: 20px;
    }
  }
  .data-dialog {
    position: relative;
    top: -130px;
  }
  .show {
    visibility: hidden;
  }
  .visual-dialog {
    font-size: 20px;
  }
  @keyframes shake {
    from {
      transform: rotate(0deg);
    }
    4% {
      transform: rotate(5deg);
    }
    12.5% {
      transform: rotate(-5deg);
    }
    21% {
      transform: rotate(5deg);
    }
    29% {
      transform: rotate(-5deg);
    }
    37.5% {
      transform: rotate(5deg);
    }
    46% {
      transform: rotate(-5deg);
    }
    50%,
    to {
      transform: rotate(0deg);
    }
  }
}
</style>