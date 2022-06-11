<template >
  <div>
    <div class="unstake-content">
      <div class="cool-down-time">
        <!-- Cool Down Time -->
        <span>Cool Down Time:</span
        ><el-input
          class="cool-down-time-input"
          v-model="unstakeData.coolDownTime"
          size="small"
          placeholder="Please enter inside"
        ></el-input>
      </div>
      <!-- unstake-amount -->
      <div class="unstake-amount">
        <el-collapse v-model="activeNames" class="el-collapse">
          <el-collapse-item
            title="Unstake Amount"
            name="1"
            class="el-collapse-item"
          >
            <div
              class="allocation-item"
              v-for="item in unstakeData.unstakeAmount"
              :key="item.name"
            >
              <p>{{ item.name }}</p>
              <el-slider 
                v-model="item.prop" 
                :class="item.class"
                show-input
                input-size="mini"
              ></el-slider>
              <span>{{ item.prop }}%</span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import { nodeMixin } from "../../mixin/";
import { mapMutations } from "vuex";
export default {
  props: ["nodeData"],
  mixins: [nodeMixin],
  data() {
    return {
      activeNames: ["1"],
    };
  },
  methods: {
    ...mapMutations(["STORAGE_GRAPH"]),
  },
  computed: {
    unstakeData() {
      return this.nodeData.unstakeData;
    },
  },
};
</script>
<style lang="scss" scoped >
.unstake-content {
  .cool-down-time {
    margin-top: 10px;
    padding: 10px 15px;
    span {
      font-size: 14px;
    }
    .cool-down-time-input {
      margin-left: 10px;
      width: 130px;
    }
  }
  .unstake-amount {
    /deep/ .el-collapse-item__header {
      padding-left: 15px;
      height: 35px;
      line-height: 35px;
      background-color: rgba(0, 0, 0, 0);
      color: #787878;
      font-size: 14px;
      font-family: "Times New Roman", Times, serif;
      font-weight: 600;
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 60px;
    }
    .allocation-item {
      margin-top: 15px;
      padding: 0px 15px;
      p {
        font-size: 13px;
      }
      .team-slider {
        float: left;
        margin-left: 15px;
        width: 190px;
        /deep/ .el-slider__bar {
          background-color: rgb(79, 127, 185);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(79, 127, 185);
          transition: 0s;
        }
      }

      .investor-slider {
        float: left;
        margin-left: 15px;
        width: 190px;
        /deep/ .el-slider__bar {
          background-color: rgb(111, 88, 194);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(111, 88, 194);
          transition: 0s;
        }
      }
      .advisor-slider {
        float: left;
        margin-left: 15px;
        width: 190px;
        /deep/ .el-slider__bar {
          background-color: rgb(147, 46, 167);
        }
        /deep/ .el-slider__button {
          transition: 0s;
          border: 2px solid rgb(147, 46, 167);
        }
      }
      .foundation-slider {
        float: left;
        margin-left: 15px;
        width: 190px;
        /deep/ .el-slider__bar {
          background-color: rgb(192, 65, 137);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(192, 65, 137);
          transition: 0s;
        }
      }

      .community-slider {
        float: left;
        margin-left: 15px;
        width: 190px;
        /deep/ .el-slider__bar {
          background-color: #f56c6c;
        }
        /deep/ .el-slider__button {
          border: 2px solid #f56c6c;
          transition: 0s;
        }
      }
      /* .team-slider {
        float: left;
        margin-left: 15px;
        width: 200px;
        /deep/ .el-slider__bar {
          background-color: orange;
        }
        /deep/ .el-slider__button {
          border: 2px solid orange;
          transition: 0s;
        }
      }

      .investor-slider {
        float: left;
        margin-left: 15px;
        width: 200px;
        /deep/ .el-slider__bar {
          background-color: green;
        }
        /deep/ .el-slider__button {
          border: 2px solid green;
          transition: 0s;
        }
      }
      .advisor-slider {
        float: left;
        margin-left: 15px;
        width: 200px;
        /deep/ .el-slider__button {
          transition: 0s;
        }
      }
      .foundation-slider {
        float: left;
        margin-left: 15px;
        width: 200px;
        /deep/ .el-slider__bar {
          background-color: rgb(223, 219, 17);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(223, 219, 17);
          transition: 0s;
        }
      }

      .community-slider {
        float: left;
        margin-left: 15px;
        width: 200px;
        /deep/ .el-slider__bar {
          background-color: #f56c6c;
        }
        /deep/ .el-slider__button {
          border: 2px solid #f56c6c;
          transition: 0s;
        }
      } */
      span {
        margin-left: 10px;
        font-size: 14px;
        line-height: 38px;
      }
    }
  }
}
</style>