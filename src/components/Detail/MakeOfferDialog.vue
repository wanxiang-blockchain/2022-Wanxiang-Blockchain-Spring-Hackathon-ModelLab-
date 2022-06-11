<template >
  <div class="content">
    <div class="item">
      <p class="item-title">Price</p>
      <div class="item-content">
        <span class="coin-name"> WETH </span>
        <el-input
          class="price-input"
          v-model="price"
          placeholder="Amount"
        ></el-input>
      </div>
    </div>
    <el-button class="make-offer-button" type="primary" @click="subscribe()">Collect</el-button>
  </div>
</template>
<script>
import { mapState } from "vuex";

import { getEOAPubkey } from "../../utils/cryptoUtil";
import { saveoffer } from "../../api/index";
import { makeOfferWithETH } from "../../api/web3/contracts";

export default {
  computed: {
    ...mapState([
      "user",
    ]),
  },
  props: ["nftId", "closeMakeOffer"],
  data() {
    return {
      price: 0,
    };
  },
  methods: {
    async subscribe() {
      let pub = await getEOAPubkey(this.user);

      makeOfferWithETH(this.nftId, this.price).then((chainRes) => {
        if (chainRes.status == "success") {
          this.$notify.success({
            title: "Success",
            message: "Subscribe successful!",
            position: "bottom-right",
          });
          console.log("tx response:", chainRes.response);

          // TODO (Xufei) 暂时将 address 替换为 paymentID, 以后需要考虑是否需要在合约端保存 paymentID
          console.log("this.user:", this.user);
          let params = {
            "nftId": this.nftId,
            "address": this.user,
            "price": this.price,
            "key": pub,
            "paymentId": chainRes.response.paymentId.toString(),
          };

          saveoffer(params).then((res) => {
            if (res.message_code == 500) {
              console.log("SUCCESS sync offer data to database");
            } else {
              console.error("FAIL sync offer data to database");
            }
          });

        } else {
          this.$notify.error({
            title: "Error",
            message: "Subscribe error!",
            position: "bottom-right",
          });
        }
      })

      this.closeMakeOffer();
    } 
  },
  mounted() {
    console.log(this.nftId);
  },
};
</script>
<style lang="scss" scoped>
.item {
  .item-title {
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    padding: 10px 0px;
  }
  .item-content {
    border-radius: 5px;
    border: solid 1px rgb(202, 201, 201);
    .coin-name {
      display: inline-block;
      font-weight: 600;
      padding: 5px 20px;
    }
    .price-input {
      width: 80%;
      border-left: 1px solid rgb(206, 206, 206);
      /deep/ .el-input__inner {
        border: none;
        font-weight: 600;
      }
    }
  }
}
.make-offer-button {
  margin: 30px 39%;
  font-weight: 600;
}
</style>