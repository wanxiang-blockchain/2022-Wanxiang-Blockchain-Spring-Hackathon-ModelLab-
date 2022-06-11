<template >
  <div>
    <div class="content">
      <div class="title"><span>Explore Models</span></div>
      <!-- <el-divider class="title-divider"></el-divider> -->

      <div class="items">
        <div class="item" v-for="item in dataList" :key="item.id">
          <div @click="gotoDetailPage(item)">
            <ExploreTemplate :modelData="item" />
            <!-- <router-link to="/details"
                  ><ExploreTemplate :modelData="item"
                /></router-link> -->
          </div>

          <!-- <router-link to="/details">
                <div class="image-box"></div>
              </router-link>
              <router-link to="/details"
                ><ExploreTemplate :modelData="item"
              /></router-link> -->
        </div>

        <div class="block">
          <PaginationTemplate
            :queryListDataByPage="queryListDataByPage"
            :totalPage="totalPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PaginationTemplate from "../components/Template/PaginationTemplate";
import ExploreTemplate from "../components/Template/ExploreTemplate";
import { getnfts } from "../api/index";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      pageSize: 12,
      currentPage: 4,
      totalPage: 0,
    };
  },
  methods: {
    ...mapMutations(["SET_DETAIL_MODEL_DATA"]),
    queryList(accountAddr, begin, end) {
      const req = {
        address: accountAddr,
        begin: begin,
        end: end,
      };
      getnfts(req).then((res) => {
        console.log(res);
        if (res.message_code == this.statusCode.SUCCESSED) {
          const data = JSON.parse(res.data);
          this.totalPage = Number(data.totalNum);
          // // console.log(this.totalPage);
          this.dataList = data.metadata;
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    queryListDataByPage(val) {
      this.queryList("", (val - 1) * this.pageSize + 1, val * this.pageSize);
    },
    gotoDetailPage(item) {
      this.$router.push({
        path: "/details",
        query: {
          modelData: JSON.stringify(item),
        },
      });
    },
  },
  mounted() {
    this.queryList("", 1, this.pageSize);
  },
  computed: {
    ...mapState(["statusCode"]),
  },
  components: {
    ExploreTemplate,
    PaginationTemplate,
  },
};
</script>
<style lang="scss" scoped>
.content {
  .title {
    text-align: center;
    padding: 60px;
    span {
      font-size: 40px;
      font-weight: 600;
      background-image: linear-gradient(to bottom, #4bf8ef, #f879e3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .title-divider {
    //background-color: #c0e1f8;
    background-image: linear-gradient(to right, #4bf8ef, #f879e3);
  }
  .items {
    padding-left: 8%;
    //width: 100%;
    //margin-left: 5%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .item {
      width: calc((100%-160px) / 5);
      position: relative;
      border-radius: 10px 10px 10px 10px;
      margin-right: 40px;
      margin-bottom: 40px;
      background: -webkit-linear-gradient(40deg, #37e2f5, #f574f5);
      border-radius: 10px;

      a {
        text-decoration: none;
        color: black;
      }

      .image-box {
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
      }
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