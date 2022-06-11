<template >
  <div class="content">
    <el-table :data="offersData" style="width: 100%" max-height="250"
      >>
      <el-table-column prop="paymentId" label="ID" width="180">
        <template slot-scope="scope">
          <span class="item">{{ scope.row.paymentId }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="price" label="Unit Price" width="180">
        <template slot-scope="scope">
          <span class="item">{{ scope.row.price }} ETH</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="" label="Quantity" width="180">
        <template slot-scope="scope">
          <span class="item">{{ scope.row.quantity }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="buyer" label="From">
        <template slot-scope="scope">
          <span class="item"
            >{{ scope.row.buyer.substr(0, 5) }}...{{
              scope.row.buyer.substr(38)
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="enckey" label="EncKey" width="180">
        <template slot-scope="scope">
          <span class="item">{{ scope.row.enckey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" width="150"
        ><template slot-scope="scope">
          <el-button
            @click="confirmSell(scope.row)"
            type="text"
            size="small"
            class="accept"
            >Accept</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState} from "vuex";

import { approveNFT, registerNFTSale, confirmTrade, subscribe} from "../../api/web3/contracts";
import { updateowner, querymetadata} from "../../api/index";
import { decryptDataEOA, encryptDataEOA} from "../../utils/cryptoUtil";

export default {
  props: ["offers"],
  data() {
    return {
      offersData: [],
    };
  },
  mounted() {
    this.offersData = this.offers;
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async confirmSell(row) {
      let metadata = await querymetadata(row.nftId);
      if (metadata.message_code == "500") {
        
        console.log("SUCCESS query metadata from database: ", metadata.data);

        let decryptedKey = await decryptDataEOA(metadata.data.enckey, this.user);
        let encryptedKey = encryptDataEOA(row.enckey, decryptedKey);
        metadata.data.enckey = encryptedKey;

      } else {
        console.error("FAIL query metadata from database");
        return;
      }

      // TODO (Xufei) approveNFT 应该不需要，需要专门测试一下
      registerNFTSale(row.nftId).then((chainRes2) => {
        if (chainRes2.status == "success") {
          this.$notify.success({
            title: "Success",
            message: "Register NFT Subscription successful !",
            position: "bottom-right",
          });
          console.log("tx response:", chainRes2.response);

          confirmTrade(row.nftId, row.paymentId).then((chainRes4) => {
            if (chainRes4.status == "success") {
              this.$notify.success({
                title: "Success",
                message: "Admit of subscription success!",
                position: "bottom-right",
              });
              console.log("tx response:", chainRes4.response);

              let params = {
                "newOwner": row.buyer,
                "nftId": row.nftId,
                "encKey": metadata.data.enckey
              };

              updateowner(params).then((res) => {
                if (res.message_code == 500) {
                  console.log("SUCCESS sync owner transfer to database");
                } else {
                  console.error("FAIL sync owner transfer to database");
                }
              });

            } else {
              this.$notify.error({
                title: "Error",
                message: "Admit error !",
                position: "bottom-right",
              });
            }
          })

        } else {
          this.$notify.error({
            title: "Error",
            message: "Register NFT subscription error !",
            position: "bottom-right",
          });
        }
      })

      
    },
    async confirmSubscribe(row) {
      let metadata = await querymetadata(row.nftId);
      let encryptedKey = null;
      if (metadata.message_code == "500") {
        
        console.log("SUCCESS query metadata from database: ", metadata.data);

        let decryptedKey = await decryptDataEOA(metadata.data.enckey, this.user);
        console.log("1");
        encryptedKey = encryptDataEOA(row.enckey, decryptedKey);
        console.log("2");
      } else {
        console.error("FAIL query metadata from database");
        return;
      }

      subscribe(row.nftId, encryptedKey).then((chainRes) => {
        if (chainRes.status == "success") {
          this.$notify.success({
            title: "Success",
            message: "Approve NFT successful !",
            position: "bottom-right",
          });
          console.log("tx response:", chainRes.response);
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.content {
  //   border: 1px solid rgb(228, 228, 228);
  border-radius: 10px;
  .el-table {
    border-radius: 10px;
  }
  .accept {
    font-size: 16px;
    font-weight: 600;
    padding: 10px;
    // border: 1px solid #409eff;
    border-top-color: rgb(255, 230, 0);
    border-left: 1px double rgb(76, 209, 250);
    border-right: 1px double rgb(255, 169, 248);
    border-bottom: 1px double rgb(207, 94, 252);
    border-radius: 15px;
  }
  .item {
    font-weight: 600;
    color: rgb(113, 113, 113);
  }
}
</style>