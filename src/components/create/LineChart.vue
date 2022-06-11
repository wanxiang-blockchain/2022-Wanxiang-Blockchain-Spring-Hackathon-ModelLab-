<template>
  <div class="box">
    <div v-bind:class="{ show: chartShow }">
      <div class="attr-select">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ this.selectToken }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in tokenType"
              :key="item"
              :command="item"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div id="lineChart" ref="lineChart" class="lineChart"></div>
    </div>
    <!-- 空状态时显示 -->
    <el-empty
      description="Please select data first!"
      class="empty-box"
      v-bind:class="{ show: !chartShow }"
    ></el-empty>
  </div>
</template>
 
<script>
import { Line, Pie } from "@antv/g2plot";
import { last } from '@antv/util';
export default {
  name: "lineChart",
  props: {
    linedata: {
      type: Array,
      default() {
        return [];
      },
    },
    Height: {
      type: Number,
      default: 500,
    },
    Width: {
      type: Number,
      default: 700,
    },
    xField: {
      type: String,
      default: "time",
    },
    yField: {
      type: String,
      default: "value",
    },
    category: {
      type: String,
      default: "category",
    },
  },
  data() {
    return {
      alreadyRender: false,
      LinePlot: null,
      tokenType: [],
      selectToken: null,
      chartShow: true,
    };
  },
  mounted() {
    this.initG2Plot();
  },
  methods: {
    handleCommand(command) {
      let selectData = [];
      this.selectToken = command;
      //如果未选数据则渲染为空
      if (this.linedata.length == 0) {
        this.LinePlot.changeData([]);
      } else {
        //根据所选择的token类别便利对应的历史数据
        this.linedata.forEach((item) => {
          item.data.forEach((element) => {
            if (element.type == command) {
              element.data.forEach((metaData) => {
                metaData.data.forEach((row) => {
                  selectData.push({
                    category: item.category + "-" + metaData.type,
                    time: row.time,
                    value: row.value,
                  });
                });
              });
            }
          });
        });
      }
      //如果从未渲染过则渲染
      if (!this.alreadyRender) {
        this.LinePlot.render();
      }
      //否则直接更新数据
      this.LinePlot.changeData(selectData);
    },

    /**
     * chart图表初始化
     * 需要根据后期的数据动态修改其中的x，y字段
     */
    initG2Plot() {
      this.LinePlot = new Line(this.$refs.lineChart, {
        data: this.linedata,
        height: this.Height,
        width: this.Width,
        xField: this.xField,
        yField: this.yField,
        seriesField: this.category,
        smooth: true,

        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
          grid: {
            line: {
              style: {
                stroke: "black",
                lineWidth: 0.2,
                lineDash: [4, 5],
                strokeOpacity: 0.7,
                shadowColor: "black",
                shadowBlur: 10,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                cursor: "pointer",
              },
            },
          },
        },
        slider:{
          start:0,
          end:1
        }
        /* 
        需求：在折线图中标记 Property 是否满足
        方案：关键数据点横坐标/横、纵坐标传到下述代码能够解决

        1. type:'region'
          start && end 的第一个参数是横坐标 它俩分别选定横坐标起点和终点
          选定区间范围内背景色改变

        2. type:'dataMarker'
          position 接收关键数据点的 横、纵坐标 并在折线图中标记
          text 中 content 接收显示在标记旁边的文本信息
          注意：关键数据点可不在折线图上

        代码功能：更换折线图指定区间背景颜色 && 标记折线图上指定点

        Reference Link :https://g2plot.antv.vision/zh/examples/component/annotation#region-and-data-marker
        */
        /* ,
        annotations:[
          {
            type:'region',
            start: ['1','min'],
            end: ['100','max']
          },
          {
            type:'dataMarker',
            position: [50,10000000],
            text: {
              content: 'test',
              style: {
                textAlign: 'left',
              },
            }
          },
          {
            type:'dataMarker',
            position: [150,10000000],
            text: {
              content: 'test',
              style: {
                textAlign: 'left',
              },
            }
          },
        ], */
      });
      if (this.linedata.length != 0) {
        this.LinePlot.render();
      }
    },
  },
  watch: {
    /**
     * 监听对应数据字段，当数据发生变化时重新渲染
     */
    linedata: {
      handler() {
        this.tokenType = [];
        if (this.linedata.length != 0) {
          this.chartShow = false;
          this.linedata[0].data.forEach((element) => {
            this.tokenType.push(element.type);
          });
          //当被选择数据不为空时，且曾经未选择过，直接使用第一个token字段作为展示
          if (this.selectToken == null) {
            this.handleCommand(this.tokenType[0]);
            this.selectToken = this.tokenType[0];
          } else {
            this.handleCommand(this.selectToken);
          }
        } else {
          this.chartShow = true;
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.box {
  padding: 5px;
  .attr-select {
    span {
      margin-right: 5px;
      font-size: 14px;
      font-weight: 600;
    }
  }
  .lineChart {
    margin-top: 30px;
  }
  .empty-box {
    height: 546px;
  }
}
.show {
  display: none !important;
}
</style>