export class Scheduler {

    constructor(graph, antvNodes) {
        this.graph = graph;
      
        // counteri && counterj 用于调度器在遍历 metaPath 二维数组时使用
        this.counteri = 0;
        this.counterj = 0;
        this.metaPath = [];
        this.antvNodes = antvNodes;

        this.setupMetaPath();
    }

    // 从 graph 中获取数据，建立 meta path
    setupMetaPath() {
        var tmpThis = this;
        let tokenNodes = new Set();

        this.antvNodes.forEach(function(value, key){
            // TODO [Done] Filter out leaf nodes
            if (value.getData().type == "Token" && !tmpThis.graph.isLeafNode(key)) {
                tokenNodes.add(key);
            }
        });

        tokenNodes.forEach(nodeID => {
            tmpThis.getRelatedMetaPath(tmpThis.antvNodes.get(nodeID), [], new Set());
        });

        console.log("traversal result:");
        console.log(this.metaPath);
        
    } 


    // 获取以一个 Token 节点为起始点的所有元路径
    getRelatedMetaPath(node, cur, visited) {
        if (node.getData().type != "Token" && visited.has(node.id)) {
          return ;
        }
  
        if (node.getData().type == "Token" && cur.length > 0) {
          cur.push(node.id);
        
          let tmpRes = [];
          cur.forEach(element => {
            tmpRes.push(element);
          });
          this.metaPath.push(tmpRes);

          cur.pop();
          return ;
        }
  
        if (this.graph.isLeafNode(node)) {
          // TODO print out warning messgae
          return ;
        }
      
        let edges = this.graph.model.getOutgoingEdges(node);
        
        cur.push(node.id);
        visited.add(node.id);
        
        for (let i = 0; i < edges.length; i++) {
          let nextNode = edges[i].getTargetNode();
          this.getRelatedMetaPath(nextNode, cur, visited);
        }
  
        cur.pop();
    }

    // 依照 metaPath 的拓扑结构进行调度
    // Parameter:   day
    // Return:      [preNode, curNode, endFlag] 
    //              endFlag == true 表示所有 meta path 都已经遍历过了
    schedule() {
        if (this.counteri >= this.metaPath.length ) {
          var res = {
            preNode: null,
            curNode: null,
            endFlag: true
          };

          this.counteri = 0;
          this.counterj = 0;

          return res;
        }

        var res = {
            preNode: this.counterj - 1 >= 0 ? this.metaPath[this.counteri][this.counterj - 1] : null,
            curNode: this.metaPath[this.counteri][this.counterj],
            endFlag: false
        };

        if (this.counterj + 1 >= this.metaPath[this.counteri].length) {
          this.counteri++;
          this.counterj = 0;
        } else {
          this.counterj++;
        }

        return res;
    }
}