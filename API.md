# Must Have
1. 创造经济模型并测试，包括暂停调试，提前终止等，还需明确显示当前测算的时间进程
2. Mint 经济模型 NFT（不含报告）
3. 在市场上查看别人的经济模型（metadata）
4. 打开自己持有的经济模型（secret data）

# API 定义: 前端 链端 后端  
以下 API 不完全，只是部分必要的  
## 前端
1. 铸造 NFT
```javascript
// metadata: {
//     name: "nft",
//     pic: "base64string",
//     desc: "aaaaa",
//     property: ["after ...", "after ..."],
// },
// secretdata: {
//     modeldata: [],
//     params: "",
//     results: "",

// }
async function Mint(metadata, secretdata) {
    ...

    // nftId: -1: mint 失败
    return nftId;
}
```

2. 生成 NFT key
```javascript
function GenerateKey(seed) {
    ...
    // key: 对称密钥
    return key;
}
```

3. 加密 NFT key
```javascript
// pub: address 对应的公钥
function EncKey(pub, key) {
    ...
    // encKey: NFT key 经过公钥加密后的结果
    return encKey
}
```

4. 加密 secret data
```javascript
// key: NFT key
// data: 模型的 secret data 部分
function EncPrivacyData(key, data) {
    ...
    // encData: 模型的 secret data 被 key 加密后的结果
    return encData;
}
```

5. 调用 IPFS 存储数据
```javascript
// data: 任意数据
function SaveOnIPFS(data) {
    ...
    // cid: IPFS 数据存储后的索引
    return cid;
}
```

6. 获取模型的隐私数据
```javascript
// nftId: NFT ID
async function QueryPrivData(nftId) {
    ...
    // secretdata : {
    //   modeldata: [],
    //   params: "",
    //   results: ""
    // }
    return secretdata;
}
```

7. 解密 NFT key
```javascript
// encKey: 加密的 NFT key
function DecKey (encKey) {
    ...
    return decKey;
}
```

8. 解密 secret data 
```javascript
// key: 解密后的 NFT key
// encData: 加密的 secret data
function DecPrivacyData (key, encData) {
    ...
    return data;
}
```

9. 调用 IPFS 获取数据
```javascript
// url: 数据在 IPFS 上的 cid
function ReadFromIPFS (url) {
    ...
    return data;
}
```

10. 从后端查询指定 NFT 详情
```javascript
function getNFTMetadata(nftId) {
    ...
    // metadata: {
    //     name: "",
    //     picURL: "",
    //     desc: "",
    //     property: [""],
    //     key: "",
    //     privURL: ""
    // }
    return metadata;
}
```

11. 从后端查询 address 下的所有 NFT
```javascript
function getAllNFT(address) {

}
```

12. 上架 NFT 
```javascript
async function List(address, nftId, price) {
    ...
    // listId: 当前卖单的标识 Id
    return listId;
}
```

13. 购买 NFT
```javascript
async function MakeOffer(listId) {
    ...
    // offerId: offer 的标识 id
    return offerId;
}
```

14. 确认出售 NFT
```javascript
async function Sell (offerId) {
    ...
    return 0 or 1;
}
```

## 后端
1. 获取模型 NFT 的结构 JSON 数据
```java
// return: JSON-string nftId对应模型结构的 JSON 数据 
public String getModel(String nftId) {}
```

2. 获取模型 NFT 的测算参数
```java
// return: JSON-string nftId对应模型的输入参数
public String getModelParams(String nftId) {}
```

3. 获取模型 NFT 的测算历史数据
```java
// return: JSON-string nftId对应模型的测算历史数据
public String getModelresultData(String nftId) {}
```

4. 保存模型 NFT 的隐私数据
```java
// return: bool
public boolean saveModel(String nftId, String architectureString, String paramString, String resultDataString) {}
```

5. 保存模型 NFT 的 metadata
```java
// return: bool
public boolean saveModelMetadata(String nftId, Metadata data) {}
```

6. 获取指定模型 NFT 的 metadata
```java
// return: name,
//         picURL,
//         desc,
//         property,
//         key,
//         privURL
public Metadata getNftMetadata(String nftId) {}
```

7. 查询指定 address 下的所有 NFT
```java
// return: [nftId] 包含 address 下所有 NFT ID 的数组
public String[] getAllNFT(String address) {}
```

8. 保存卖单数据
```java
// return: listId
public String saveList(String owner, String nftId, String price) {}
```

9. 保存买单数据
```java
// return: offerId
public String saveOffer(String buyer, String nftId, String price) {}
```

10. 读取卖单数据
```java
public ListData readList(String listId) {}
```

11. 读取买单数据
```java
public OfferData readOffer(String offerId) {}
```

## 链端
1. ERC721 - Mint
```solidity
// picURL: NFT 图片的 IPFS cid
// key: 加密后的 NFT key
// privURL: NFT 隐私数据的 IPFS cid
function Mint (string memory name, string memory picURL, string memory desc, 
               string[] memory property, string memory key, string memory privURL) 
               public
               returns (uint256) {
    ...
    // id: NFT id
    return id;
}
```

2. ERC721 - getMetadata
```solidity
// id: NFT ID
function getMetadata (id)
         external
         view
         returns (string memory name,
                  string memory picURL,
                  string memory dec,
                  string[] memory property,
                  string memory key,
                  string memory privURL) {
    ...
    return ( name,
             picURL,
             desc,
             property,
             key,
             privURL
    );
}
```

3. ERC721 - updateKey
```solidity
// key: 更新了的加密 key
function updateMetadataKey(string memory key)
         external {

}
```

5. Vault - Trade
```solifity
function Trade (address memory buyer, address memory seller, uint256 price, uint256 nftId) 
         public {}
```