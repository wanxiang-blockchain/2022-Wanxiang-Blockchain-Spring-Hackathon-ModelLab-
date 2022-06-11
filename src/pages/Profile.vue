<template >
  <div>
    <div class="content">
      <div class="items">
        <div class="item0">
          <el-upload
            class="el-icon-edit avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          </el-upload>
        </div>
        <div class="item1">
          <div class="user-avatar" ref="avatar"></div>
          <div class="user-address-box">
            <p class="user-address">{{ shortUserId }}</p>
          </div>
        </div>

        <div class="item2">
          <el-tabs
            type="border-card"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane label="Collected" name="one">
              <ProfileTemplate />
            </el-tab-pane>

            <el-tab-pane label="Created" name="two">
              <ProfileTemplate />
            </el-tab-pane>

            <el-tab-pane label="Favoried" name="three">
              <ProfileTemplate />
            </el-tab-pane>

            <el-tab-pane label="Hidden" name="four">
              <ProfileTemplate />
            </el-tab-pane>

            <el-tab-pane label="Activity" name="five">
              <ProfileTemplate />
            </el-tab-pane>

            <el-tab-pane label="Offers" name="six">
              <ProfileTemplate />
            </el-tab-pane>

            <el-tab-pane label="Listings" name="seven">
              <ProfileTemplate />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ProfileTemplate from "../components/Template/ProfileTemplate";
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeName: "one",
      imageUrl: "",
      searchContent: "",
      options: [
        {
          value: "Select 1",
          label: "Select 1",
        },
        {
          value: "Select 2",
          label: "Select 2",
        },
      ],
      value: "",
    };
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
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
    initData() {
      this.$nextTick(function () {
        this.$refs.avatar.style.background =
          "linear-gradient(to right, #" +
          this.user.substring(2, 8) +
          ", #" +
          this.user.substring(8, 14) +
          ", #" +
          this.user.substring(14, 20) +
          ")";
      });
    },
  },
  components: {
    ProfileTemplate,
  },
  computed: {
    ...mapState(["user"]),
    shortUserId() {
      return (
        this.user.substring(0, 5) +
        "..." +
        this.user.substring(this.user.length - 4)
      );
    },
  },
  mounted() {
    this.initData();
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
    }
  }
  .items {
    width: 100%;
    margin: 0px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .item0 {
      width: 100%;
      //height: 20px;
      //position: relative;
      //border-radius: 10px 10px 10px 10px;
      //margin: 20px 20px;
      //background-color: rgb(199, 198, 198);
      .avatar-uploader {
        width: 100%;
        height: 150px;
        text-align: center;
        line-height: 150px;
        border: 1px solid #bbb;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background-color: rgb(255, 255, 255);
        color: rgb(134, 133, 133);
      }
      .avatar-uploader:hover {
        box-shadow: 0 0 6px rgba(129, 129, 129, 0.8);
        border-radius: 10px 10px;
      }
    }
    .item1 {
      width: 100%;
      margin-top: -30px;
      border-radius: 10px 10px 10px 10px;
      text-align: center;
      z-index: 10;

      .user-avatar {
        height: 50px;
        width: 50px;
        margin-right: auto;
        margin-left: auto;
        top: 230px;
        background-color: coral;
        //background-image: url("https://lh3.googleusercontent.com/GEjntWar2XSZwRU3TSuza3nUjBXv51ddDaVY62kyInwE5YAdt42jBN1bX8bNr0a25BpoV587Pu8J2U_6_glehfE8mp2t5PaqhHaB-A=s100");
        background-position: center;
        border: 2px solid rgb(255, 239, 12);
        border-radius: 100%;
        background-size: 100%;
      }
      .user-address-box {
        text-align: center;
        margin-right: auto;
        margin-left: auto;
        margin-top: 10px;
        margin-bottom: 10px;
        box-shadow: 0 0 6px rgba(129, 129, 129, 0.8);
        border-radius: 10px 10px;
        width: 100px;
        .user-address {
          color: #bbb;
        }
      }
    }
    .item2 {
      width: 99%;
      top: 280px;
      position: absolute;
      margin: 20px 20px;

      .div-inline {
        display: inline;
      }
      .search-box {
        width: 900px;
        .serch-input {
          width: 850px;
          float: left;
          /deep/ .el-input__inner {
            border: solid 1px rgb(229, 232, 235);
            border-radius: 10px;
          }
        }
        .search-icon {
          float: left;
          margin-left: 10px;
          font-size: 25px;
          font-weight: 600;
          line-height: 40px;
          cursor: pointer;
        }
      }
      .select-box {
        width: auto;
        .select-one {
          margin-left: 100px;
        }
        .select-two {
          margin-left: 30px;
        }
      }
      .show-box {
        color: #bbb;
        font-size: 25px;

        .el-icon-menu {
          margin-left: 20px;
          font-weight: 300;
          line-height: 40px;
        }
        .el-icon-s-grid {
          margin-left: 20px;
          font-weight: 400;
          line-height: 40px;
        }
      }
      .show-items {
        width: 80%;
        margin: 0px auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .item {
          width: 300px;
          position: relative;
          border-radius: 10px 10px 0px 0px;
          margin: 20px 20px;
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
      }
    }
  }
}
</style>