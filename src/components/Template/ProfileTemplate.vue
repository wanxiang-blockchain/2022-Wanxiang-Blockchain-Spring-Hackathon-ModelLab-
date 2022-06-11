<template>
  <div class="items-outside">
    <div class="search-box div-inline">
      <el-input
        v-model="searchContent"
        placeholder="Search items"
        class="serch-input"
        suffix-icon="el-icon-search search-icon"
      ></el-input>
    </div>

    <div class="select-box div-inline">
      <el-select
        v-model="PriceValue"
        clearable
        placeholder="Price"
        class="select-one"
        @click="handleClickPrice"
      >
        <el-option
          v-for="item in priceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="ShowValue"
        clearable
        placeholder="Show"
        class="select-two"
        @click="handleClickShow"
      >
        <el-option
          v-for="item in showOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="show-box div-inline">
      <div class="el-icon-menu"></div>
      <div class="el-icon-s-grid"></div>
    </div>

    <div class="show-items">
      <div class="item" v-for="index in dataList" :key="index.id">
        <div @click="gotoDetailPage(index)">
          <ExploreTemplate :modelData="index" />
        </div>
      </div>

      <div class="block">
        <PaginationTemplate />
      </div>
    </div>
  </div>
</template>

<script>
import ExploreTemplate from "./ExploreTemplate";
import PaginationTemplate from ".//PaginationTemplate";
import { mapState } from "vuex";

import { getnfts } from "../../api/index";
export default {
  data() {
    return {
      pageSize: 12,
      dataList: [],
      imageUrl: "",
      searchContent: "",
      priceOptions: [
        {
          value: "Price 1",
          label: "Price: Default",
        },
        {
          value: "Price 2",
          label: "Price: Low to Hight",
        },
        {
          value: "Price 3",
          label: "Price: Hight to Low",
        },
      ],
      showOptions: [
        {
          value: "Show 1",
          label: "Show: Recently Sold",
        },
        {
          value: "Show 2",
          label: "Show: Recently Created",
        },
        {
          value: "Show 3",
          label: "Show: Oldest",
        },
      ],
      PriceValue: "",
      ShowValue: "",
    };
  },
  methods: {
    gotoDetailPage(item) {
      this.$router.push({
        path: "/details",
        query: {
          modelData: JSON.stringify(item),
        },
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleClickPrice() {
      alert("button click");
    },
    handleClickShow() {
      alert("button click");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传的图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    queryList(accountAddr, begin, end) {
      const req = {
        address: accountAddr,
        begin: begin,
        end: end,
      };
      getnfts(req).then((res) => {
        if (res.message_code == this.statusCode.SUCCESSED) {
          const data = JSON.parse(res.data);
          this.totalPage = Number(data.totalNum);
          this.dataList = data.metadata;
        } else {
          console.log(res);
        }
      });
    },
  },
  components: {
    ExploreTemplate,
    PaginationTemplate,
  },
  computed: {
    ...mapState(["user", "statusCode"]),
  },
  mounted() {
    this.queryList(this.user, 1, this.pageSize);
  },
};
</script>
<style lang="scss" scoped>
.items-outside {
  width: 100%;
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .div-inline {
    display: inline;
  }
  .search-box {
    width: 40%;
    .serch-input {
      margin-left: 27%;
      width: 65%;
      float: left;
      /deep/ .el-input__inner {
        border: solid 1px rgb(229, 232, 235);
        border-radius: 10px;
      }
    }
    .search-icon {
      float: left;
      margin-left: 1%;
      font-size: 25px;
      font-weight: 600;
      line-height: 40px;
      cursor: wait;
      color: #e3e5e6;
    }
    .search-icon:hover {
      color: #ccc9cc;
    }
  }
  .select-box {
    width: 35%;
    margin-left: 5%;
    .select-one {
      margin-left: 1%;
      width: 35%;
    }
    .select-two {
      margin-left: 2%;
      width: 35%;
    }
  }
  .show-box {
    color: #bbb;
    font-size: 25px;
    width: 15%;
    margin-left: 3%;
    margin-right: 1%;

    .el-icon-menu {
      margin-left: 3%;
      font-weight: 300;
      line-height: 40px;
      color: #ccc9cc;
    }
    .el-icon-s-grid {
      margin-left: 3%;
      font-weight: 400;
      line-height: 40px;
      color: #e3e5e6;
    }
  }
  .show-items {
    width: 80%;
    margin: 0px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .item {
      background: -webkit-linear-gradient(40deg, #37e2f5, #f574f5);
      width: 300px;
      position: relative;
      border-radius: 10px 10px 10px 10px;
      margin: 20px 20px;
      a {
        text-decoration: none;
        color: black;
      }
      /*     .image-box {
                    height: 170px;
                    background-image: url("https://lh3.googleusercontent.com/4mZN8XfWnchD1Q3HH3hKHUwZPbwHfS2sOjFk2jfdx_T4oWcpQtcUDB2AclymwViSFn4phjzGlXh7KVNMzB-VqjbQ_BEXCTgcdfThpg=h200");
                    background-repeat: no-repeat;
                    border-radius: 10px 10px 0px 0px;
                }
                .user-avatar {
                    height: 50px;
                    width: 50px;
                    position: absolute;
                    top: 145px;
                    right: 125px;
                    background-image: url("https://lh3.googleusercontent.com/GEjntWar2XSZwRU3TSuza3nUjBXv51ddDaVY62kyInwE5YAdt42jBN1bX8bNr0a25BpoV587Pu8J2U_6_glehfE8mp2t5PaqhHaB-A=s100");
                    background-position: center;
                    border-radius: 100%;
                    background-size: 100%;
                }
                .item-context {
                    text-align: center;
                    border: 1px solid #bbb;
                    border-top: none;
                    border-bottom-right-radius: 10px;
                    border-bottom-left-radius: 10px;
                    width: 298px;
                    .author {
                    padding-top: 40px;
                    }
                    .describe {
                    padding-top: 10px;
                    }
                    p {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    padding: 10%;
                    }
                } */
      &:hover {
        box-shadow: 0 0 6px rgba(129, 129, 129, 0.8);
        border-radius: 10px;
      }
    }
    .block {
      width: 100%;
      margin-top: 2%;
      margin-bottom: 2%;
      display: table-cell;
      text-align: center;
    }
  }
}
</style>