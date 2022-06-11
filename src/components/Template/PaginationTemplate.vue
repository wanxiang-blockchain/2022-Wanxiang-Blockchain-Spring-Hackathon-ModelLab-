<template >
  <div>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="12"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    >
    </el-pagination> -->
    <el-pagination
      class="page"
      @current-change="handleCurrentChange"
      :page-size="12"
      :pager-count="11"
      layout="prev, pager, next"
      :total="totalPage"
    >
    </el-pagination>
  </div>
</template>


<script>
export default {
  props: ["queryListDataByPage", "totalPage"],
  data() {
    return {
      currentPage: 1,
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryListDataByPage(val);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.el-pagination {
    text-align: center; 
}
</style>