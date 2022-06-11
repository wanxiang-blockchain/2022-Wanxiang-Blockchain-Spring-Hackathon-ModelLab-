<template >
  <div>
    <!-- graph container -->
    <Editor />
    <div class="rule-edit" v-if="ruleEditShow.show"><RuleEdit /></div>
  </div>
</template>
<script>
import Editor from "../components/create/Editor";
import RuleEdit from "../components/create/RuleEdit";
import { mapState } from "vuex";
export default {
  components: {
    Editor,
    RuleEdit,
  },
  computed: {
    ...mapState(["ruleEditShow"]),
  },
};
</script>
<style lang="scss" scoped>
.rule-edit {
  position: absolute;
  top: 20%;
  left: 40%;
}
</style>