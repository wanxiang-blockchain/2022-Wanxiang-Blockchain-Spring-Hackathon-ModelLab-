<template>
  <div>
    <div class="token-content">
      <div class="total-supply">
        <!-- Total Supply -->
        <span>Total Supply:</span
        ><el-input
          class="total-supply-input"
          v-model="tokenData.totalSupply"
          size="small"
          placeholder="Please enter inside"
        ></el-input>
      </div>
      <!-- allocations -->
      <div class="allocation">
        <el-collapse v-model="activeNames" class="el-collapse">
          <el-collapse-item
            title="Allocation"
            name="1"
            class="el-collapse-item"
          >
            <div
              class="allocation-item"
              v-for="item in tokenData.allocations"
              :key="item.name"
            >
              <p>{{ item.name }}</p>
              <el-slider
                v-model="item.prop"
                show-input
                input-size="mini"
                :class="item.class"
                @change="propChange(item, tokenData.allocations)"
              ></el-slider>
              
              <span></span>
              <span>{{ item.prop }}%</span>
            </div>

            <!-- Community -->
            <el-collapse
              v-model="activeNames"
              class="el-collapse el-community-collapse"
            >
              <el-collapse-item
                title="Community"
                name="2"
                class="el-collapse-item"
              >
                <div
                  class="community-item"
                  v-for="item in tokenData.community.allocations"
                  :key="item.name"
                >
                  <p>{{ item.name }}</p>
                  <el-slider
                    v-model="item.prop"
                    :class="item.class"
                    @change="propChange(item, tokenData.community.allocations)"
                  ></el-slider>
                  <span>{{ item.prop }}%</span>
                </div>

                <div class="staking-lifetime">
                  <!-- Staking Lifetime -->
                  <span>Staking Lifetime :</span
                  ><el-input
                    class="staking-lifetime-input"
                    v-model="tokenData.community.stakingLifetime"
                    size="small"
                    placeholder="Please enter inside"
                  ></el-input>
                  <span>Days</span>
                </div>
                <div class="staking-reward-refresh">
                  <!-- Staking Reward Refresh -->
                  <span>Staking Reward Refresh :</span
                  ><el-input
                    class="staking-reward-refresh-input"
                    v-model="tokenData.community.stakingRewardRefresh"
                    size="small"
                    placeholder="Please enter inside"
                  ></el-input>
                  <span>Days</span>
                </div>
                <div class="community-item">
                  <p>Staking Reward Decrease Factor</p>
                  <el-slider
                    v-model="tokenData.community.stakingRewardDecreaseFactor"
                    :max="100"
                    class="community-item-slider"
                  ></el-slider>
                  <span
                    >{{
                      tokenData.community.stakingRewardDecreaseFactor
                    }}%</span
                  >
                </div>
              </el-collapse-item>
            </el-collapse>
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
      activeNames: ["1","2"],
    };
  },
  methods: {
    ...mapMutations(["STORAGE_GRAPH"]),
  },
  computed: {
    /**
     * 计算属性，将节点中的业务数据转换为当前页面字段类型
     */
    tokenData() {
      return this.nodeData.tokenData;
    },
  },
};
</script>
<style lang="scss" scoped>
.token-content {
  .total-supply {
    margin-top: 10px;
    padding: 10px 15px;
    span {
      font-size: 14px;
    }
    .total-supply-input {
      margin-left: 20px;
      width: 150px;
    }
  }
  .allocation {
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
      padding-bottom: 20px;
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
        /* /deep/ .el-slider__input {
          width: 90px;
          float: left;
          margin-left: 50px;
          //margin-right: 0px;
        } */
      }

      span {
        margin-left: 10px;
        font-size: 14px;
        line-height: 38px;
      }
    }
    .community-item {
      margin-top: 5px;
      padding: 15px;
      .airdrop-turntable {
        float: left;
        margin-left: 15px;
        width: 190px;
        /deep/ .el-slider__button {
          transition: 0s;
        }
      }
      /* Staking */
      .staking-turntable {
        float: left;
        margin-left: 15px;
        width: 190px;
        /deep/ .el-slider__bar {
          background-color: rgb(73, 154, 160);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(73, 154, 160);
          transition: 0s;
        }
      }
      /* Staking Reward Decrease Factor*/
      .community-item-slider {
        float: left;
        width: 190px;
        margin-left: 15px;
        /deep/ .el-slider__bar {
          background-color: rgb(51, 122, 128);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(51, 122, 128);
          transition: 0s;
        }
      }
      span {
        margin-left: 10px;
        font-size: 14px;
        line-height: 38px;
      }
    }

    .staking-lifetime {
      margin-top: 10px;
      padding: 5px;
      span {
        font-size: 14px;
        margin-left: 10px;
      }
      .staking-lifetime-input {
        margin-left: 10px;
        width: 100px;
      }
    }
    .staking-reward-refresh {
      margin-top: 10px;
      padding: 5px;
      span {
        font-size: 14px;
        margin-left: 10px;
      }
      .staking-reward-refresh-input {
        margin-left: 10px;
        width: 60px;
      }
    }
    /* Air drop */
    .el-community-collapse {
      /deep/ .el-collapse-item__wrap {
        background-color: #fff;
      }
      /deep/ .el-slider__bar {
          background-color: rgb(79, 178, 185);
        }
        /deep/ .el-slider__button {
          border: 2px solid rgb(79, 178, 185);
          transition: 0s;
        }
    }
  }
}
</style>