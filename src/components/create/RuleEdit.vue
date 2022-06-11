<template >
  <div>
    <div class="rule-edit-container" v-if="loaded">
      <el-dialog
        title="Property Edit"
        :visible.sync="ruleEditShow.show"
        width="30%"
      >
        <div class="name">
          <span>Property Name:</span
          ><el-input
            class="name-input"
            v-model="newRule.label"
            placeholder=""
          ></el-input>
        </div>

        <div class="content">
          <span>Property Content:</span>
          <el-input
            class="content-input"
            v-model="newRule.content"
            placeholder=""
          ></el-input>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="ruleEditShow.show = false">Cancel</el-button>
          <el-button type="primary" @click="edit()">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

const antlr4 = require("antlr4");
const InputStream = antlr4.InputStream;
const CommonTokenStream = antlr4.CommonTokenStream;
const GrammarParser = require("../../parser/PropertyParser").PropertyParser;
const GrammarLexer = require("../../parser/PropertyLexer").PropertyLexer;

export default {
  data() {
    return {
      newRule: null,
      loaded: false,
    };
  },
  methods: {
    ...mapMutations(["SAVE_EDIT_RULE"]),
    edit() {
      // 每次编辑完 / 修改完 property 之后，property 的 status 应重置为 false
      this.newRule.status = false;
      try {
        // 对于用户输入的 property 进行语法检查
        const inputStream = new InputStream(this.newRule.content);
        const lexer = new GrammarLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new GrammarParser(tokenStream);
        parser.removeErrorListeners();
        parser.addErrorListener({
          syntaxError: (recognizer, offendingSymbol, line, column, msg, err) => {
            console.error(`${offendingSymbol} line ${line}, col ${column}: ${msg}`);
            throw err;
          }
        });
        const tree = parser.check();

        // 语法检查通过后，保存 property
        this.SAVE_EDIT_RULE(this.newRule);
        this.ruleEditShow.show = false;
      } catch {
        alert("Wrong Grammar!");
      }
      
    },
  },
  computed: {
    ...mapState(["ruleEditShow", "editRule", "ruleLists"]),
  },
  mounted() {
    if (!this.ruleEditShow.add) {
      this.newRule = Object.assign({}, this.editRule);
    } else {
      let newId = 0;
      if (this.ruleLists.length == 0) {
      } else {
        newId = this.ruleLists[this.ruleLists.length - 1].id + 1;
      }

      this.newRule = { id: newId, label: "", content: "", status: false };
    }
    this.loaded = true;
  },
};
</script>
<style lang="scss">
.rule-edit-container {
  width: 400px;
  .el-dialog {
    border-radius: 20px;
  }
  .name {
    .name-input {
      margin-left: 20px;
      width: 300px;
    }
  }
  .content {
    margin-top: 20px;
    .content-input {
      margin-left: 10px;
      width: 300px;
    }
  }
}
</style>