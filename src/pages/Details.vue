<template >
  <div class="root" v-if="loaded">
    <div class="top-context">
      <div class="NFTInfor-box">
        <div class="logoAndLike-box">
          <i class="el-icon-d-caret"></i>
          <!-- <i class="el-icon-star-off"
            ><span id="like"><strong>123</strong></span></i
          > -->
          <svg class="icon el-icon-star-off" aria-hidden="true" style="font-size: 15px">
            <use xlink:href="#icon-like"></use>
          </svg>
        </div>
        <div class="picture-box" ref="bc"></div>

        <div class="desc-box">
          <div class="desc-logo-box">
            <i class="el-icon-view"><span id="like"> Description</span></i>
          </div>
          <div class="desc-context-box">
            <div class="desc-context-owner">
              <span><strong>Created by </strong></span>
              <span id="creator">{{ modelData.address }}</span>
            </div>
            <div class="desc-context">
              <p>
                {{ modelData.desc }}
              </p>
            </div>
            <div class="desc-context-copyright">
              <span>@ </span><span class="copyright">Collection</span>
            </div>
          </div>

          <!--  -->

          <div class="moreInfor-box">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item>
                <template slot="title">
                  <i class="el-icon-coin"><span> Properties</span></i>
                </template>
                <div prop-box>
                  <!-- TODO -->
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="item.content"
                    placement="bottom"
                    v-for="item in properties"
                    :key="item.id"
                  >
                    <div class="property-item">{{ item.label }}</div>
                  </el-tooltip>
                </div>
              </el-collapse-item>

              <el-collapse-item>
                <template slot="title">
                  <i class="el-icon-link"><span> Details</span></i>
                </template>
                <div details-box>
                  <!-- TODO -->
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>

      <div class="SaleInfor">
        <div class="title-box">
          <div class="copyRight-link">
            <span class="copyRight">Collection</span>
          </div>

          <div class="icon-box">
            <i class="el-icon-refresh-right"></i>
            <i class="el-icon-edit-outline"></i>
            <i class="el-icon-share"></i>
          </div>
        </div>

        <div class="infor-box">
          <h3 class="nft-name">{{ modelData.name }}</h3>
          <span>Owned by </span>
          <span class="current-owner">{{ modelData.address }}</span>
        </div>

        <div class="sale-box">
          <div class="end-time-box">
            <i class="el-icon-time">
              Sale ends
              <span class="sale-end-time">May 12,2022 at 17:02pm CST</span></i
            >
          </div>

          <div class="current-price-box">
            <h4>Current Price</h4>
            <i class="el-icon-d-caret">
              <span class="current-price"><strong> 0.22 </strong></span>
              <span class="dollar-price"> ($675.37) </span>
            </i>
            <div class="btn-box">
              <!-- <el-button class="details-btn" v-if="!show">Buy Now</el-button> -->
              <el-button
                class="details-btn details-btn-2"
                v-if="!show"
                @click="makeOfferDialog = true"
                >Collect</el-button
              >
              <el-dialog
                title="Make an offer"
                :visible.sync="makeOfferDialog"
                width="30%"
                center
              >
                <make-offer-dialog :nftId="modelData.nftId" :closeMakeOffer="closeMakeOffer" />
              </el-dialog>

              <!-- <el-button class="details-btn" v-if="show">
                <router-link to="/sell">Sell</router-link>
              </el-button> -->
              <!-- 
              <el-button type="primary" v-if="show"> -->
              <el-button
                @click="getModelSecretData()"
                class="details-btn details-btn-2"
                v-if="show"
              >
                Open Model
              </el-button>

              <!-- <el-button
                class="details-btn details-btn-3"
                v-if="show"
                @click="offersDialog = true"
              >
                Offers
              </el-button>

              <el-dialog
                title="Offers"
                :visible.sync="offersDialog"
                width="40%"
                center
              >
                
              </el-dialog> -->
            </div>
          </div>

          <div class="price-history-box">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item>
                <template slot="title">
                  <i class="el-icon-data-analysis"
                    ><span> Price History</span></i
                  >
                </template>
                <div price-history>
                  <!-- TODO -->
                </div>
              </el-collapse-item>

              <el-collapse-item>
                <template slot="title">
                  <i class="el-icon-price-tag"><span> Listings</span></i>
                </template>
                <div details-box>
                  <!-- TODO -->
                </div>
              </el-collapse-item>

              <el-collapse-item>
                <template slot="title">
                  <i class="el-icon-thumb"><span> Offers</span></i>
                </template>
                <div details-box>
                  <offers-dialog :offers="offers" />
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-context">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item>
          <template slot="title">
            <i class="el-icon-date"><span> Item Activity</span></i>
          </template>
        </el-collapse-item>

        <el-collapse-item>
          <template slot="title">
            <i class="el-icon-attract"
              ><span> More From This Collection</span></i
            >
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { querymodel, queryoffer } from "../api/index";
import { mapState } from "vuex";
import MakeOfferDialog from "../components/Detail/MakeOfferDialog.vue";
import OffersDialog from "../components/Detail/OffersDialog.vue";
import { downloadFromIPFS } from "../utils/ipfsUtil";
export default {
  components: { MakeOfferDialog, OffersDialog },
  props: {
    metadataHash: {
      type: String,
    },
  },
  data() {
    return {
      loaded: false,
      activeNames: ["1"],
      show: false,
      modelMetaData: null,
      metadata: null,
      modelData: null,
      makeOfferDialog: false,
      offersDialog: false,
      properties: [],
      offers: [],
      // TODO:用户登陆 + 用户拥有该 NFT，show = false
    };
  },
  computed: {
    ...mapState(["statusCode", "user", "detailModelData"]),
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    getModelMetaData() {
      //页面跳转时会通过props传过来metadatahash,accountAddr则直接从store里取user
      const req = {
        accountAddr: this.user,
        metadataHash: this.metadataHash,
      };
      querymodel(req).then((res) => {
        if (res.message_code == this.statusCode.SUCCESSED) {
          this.modelMetaData = res.data;
        }
      });
    },
    initData() {
      this.modelData = JSON.parse(this.$route.query.modelData);
      this.loaded = true;
      downloadFromIPFS(this.modelData.picUrl).then((res) => {
        this.$nextTick(function () {
          this.$refs.bc.style.backgroundImage = "url(" + res + ")";
        });
      });
      this.properties = JSON.parse(this.modelData.property);

      // 对 button 的显示进行控制
      if (this.modelData.address.toUpperCase() == this.user.toUpperCase()) {
        this.show = true;
      }

      queryoffer(this.modelData.nftId).then((res) => {
        if (res.message_code == "500") {
          this.offers.push({
            buyer: res.data.buyer,
            price: res.data.price,
            status: res.data.status,
            nftId: res.data.nftId,
            paymentId: res.data.paymentId,
            enckey: res.data.enckey,
          });
        }
      });
    },
    getModelSecretData() {
      this.$router.push({
        path: "/create",
        query: {
          nftId: this.modelData.nftId,
        },
      });
    },
    closeMakeOffer() {
      this.makeOfferDialog = false;
    }
  },
  mounted() {
    this.initData();
  },
};
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}
.root {
  margin-top: 2%;
  margin-left: 20%;
  margin-right: 20%;

  .top-context {
    width: 100%;
    height: 750px;

    .NFTInfor-box {
      width: 35%;
      float: left;
      //background: -webkit-linear-gradient(40deg, #37e2f5, #f574f5);

      .logoAndLike-box {
        height: 25px;
        width: 100%;
        //background: -webkit-linear-gradient(40deg, #9df2fc, #fc9afc);
        //opacity: 0.7;
        //border: 1px dashed rgb(76, 209, 250);
        border: 1px inset rgb(233, 175, 245);
        //border-bottom: 1px double rgb(255, 169, 248);
        border-bottom: none;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        .el-icon-d-caret {
          float: left;
          margin: 1%;
          color: rgb(29, 148, 156);
        }
        .el-icon-star-off {
          float: right;
          margin: 1%;
          color: black;
          span {
            //color: rgb(250, 2, 85);
            font-weight: 1000;
          }
        }
      }
      .picture-box {
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        height: 380px;
        width: 100%;
        border: 1px double #bbb;
        border-top: none;
        border: 1px inset rgb(162, 139, 245);
        border-left: 1px double rgb(76, 209, 250);
        border-right: 1px double rgb(255, 169, 248);
        border-bottom: 1px double rgb(207, 94, 252);
        //border-top: 1.5px dashed rgb(80, 84, 146);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // background-image: url("https://lh3.googleusercontent.com/UMOy3Fzgia8dTXu85F8wha1b7JJO_cZcAG_TWUj_LfHfIAcKJwijZU_VPlu5Rx7nU3f-fOarY8VVSP2YQyVWyHOR3SHKckymhQgU=w600");
      }
      .desc-box {
        margin-top: 5%;
        width: 100%;
        .desc-logo-box {
          background: -webkit-linear-gradient(40deg, #49e4f5, #d849f5);
          //background: -webkit-linear-gradient(40deg, #9df2fc, #fc9afc);
          border: 0px solid #bbb;
          border-bottom: none;
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
          height: 25px;
          width: 100.4%;
          color: black;
          .el-icon-view {
            float: left;
            margin: 1%;
          }
        }
        .desc-context-box {
          height: 150px;
          width: 94%;
          overflow: auto;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          //border: 1px solid #bbb;
          border-top: none;
          border-left: 0.1px double rgb(76, 209, 250);
          border-right: 0.1px double rgb(255, 169, 248);
          border-bottom: 0.1px double rgb(207, 94, 252);
          padding: 3%;
          .desc-context-owner {
            margin-top: 4%;
          }
          .desc-context {
            margin-top: 4%;
          }
          .desc-context-copyright {
            margin-top: 4%;
          }
        }
      }
    }

    .SaleInfor {
      width: 60%;
      float: right;
      .title-box {
        width: 100%;
        height: 30px;
        .copyRight-link {
          float: left;
          margin: 2%;
        }
        .icon-box {
          background: -webkit-linear-gradient(40deg, #49e4f5, #d849f5);
          float: right;
          height: 80%;
          width: 100px;
          text-align: center;
          //vertical-align: bottom;
          border: 0px solid #bbb;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          // overflow: auto;
          .el-icon-refresh-right {
            border-right: none;
            font-size: 22px;
            padding: 2%;
            border-right: 1px solid white;
            margin-bottom: 2%;
            color: white;
          }
          .el-icon-edit-outline {
            margin-left: 6%;
            margin-right: 6%;
            font-size: 22px;
            padding: 2%;
            color: white;
          }
          .el-icon-share {
            //border: 1px solid #bbb;
            border-left: 1px solid white;
            font-size: 22px;
            padding: 2%;
            color: white;
          }
        }
      }
      .infor-box {
        width: 100%;
        margin: 2%;
      }
      .sale-box {
        width: 100%;
        .end-time-box {
          background: -webkit-linear-gradient(40deg, #49e4f5, #d849f5);
          border: 0px solid #bbb;
          border-bottom: none;
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
          height: 40px;
          .el-icon-time {
            margin: 2%;
            color: black;
          }
        }
        .current-price-box {
          border: 1px solid #bbb;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          //border-top: 0px double rgb(76, 209, 250);
          border-left: 1px double rgb(76, 209, 250);
          border-right: 1px double rgb(255, 169, 248);
          border-bottom: 1px double rgb(207, 94, 252);
          h4 {
            margin: 2%;
          }
          .el-icon-d-caret {
            margin: 2%;
          }
          .btn-box {
            margin: 2%;
            width: 100%;
            a {
              text-decoration: none;
              color: white;
            }

            .details-btn {
              color: white;
              background: -webkit-linear-gradient(40deg, #49e4f5, #9166f5);
              cursor: pointer;
            }
            .details-btn-2 {
              color: white;
              background: -webkit-linear-gradient(40deg, #9878f9, #d849f5);
              cursor: pointer;
            }
            .details-btn-3 {
              color: white;
              background: -webkit-linear-gradient(40deg, #d849f5, #a518c1);
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .bottom-context {
    width: 100%;
    height: 100px;
    margin-top: 2%;
    margin-bottom: 10%;
  }
  /deep/ .el-dialog__title {
    font-weight: 600;
  }
  .el-dialog {
    border-radius: 10px;
  }
  .item {
    margin: 4px;
    float: left;
    height: 16px;
  }
  .property-item {
    background: #fff;
    padding: 3px 10px;
    border-radius: 8px;
    line-height: 16px;
    color: rgb(102, 101, 101);
    font-weight: 400;
    border-left: 1px double rgb(76, 209, 250);
    border-right: 1px double rgb(255, 169, 248);
    border-bottom: 1px double rgb(207, 94, 252);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
}
</style>