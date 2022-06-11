import http from './public'
/**
 * 此处前端会发送给其同名的代理服务器，与当前端口相同，随后会由代理服务器与真实ip和端口交互
 * 故此处请求无需写前缀服务器信息
 */
const baseUrl = "/api"
/**
 * 查询nft信息
 * @param {accountAddr,metadataHash} params 
 * @returns {data:{metadataHash,modelData,params},error_info,message_code}
 */
export const querymodel = (params) => {
    console.log(params);
    return http.fetchPost(baseUrl + '/messages/getmodel', params)
}


/**
 * 生成nft，向后端获取hash
 * @param {"accountAddr":"0x123",
 * "metaData": 
 * {"name":"Apex","desc":"the measure model of Apex",
 * "displayUrl":"http://example.com",
 * "metadataHash":""
 * },
 * "secretData":
 * {"modelData":"token-A,token-B","params":"param-1,param-2"}
 * }' params 
 * @returns 
 */
export const mintnft = (params) => {
    return http.fetchPost(baseUrl + '/messages/mintnft', params)
}

/**
 * querymetadata请求中accountAddr非必填，
 * 为空则按分页返回所有NFT的metadata，
 * 不为空则按分页返回指定用户的NFT metadata
 * @param {accountAddr,begin,end} params  
 * @returns 
 */
export const getnfts = (params) => {
    return http.fetchPost(baseUrl + '/messages/getnfts', params)
}

/**
 * savemetadata 参数示例:
 * params: {
 *  "nftId": "12",
 *  "address": "0xowner",
 *  "metadata" : {
 *      "name": "test",
 *      "desc": "desc",
 *      "picUrl": "IPFS cid",
 *      "property": ["property1"],
 *      "key": "AES key",
 *      "privUrl": "IPFS cid"
 *  }
 * }
 */
export const savemetadata = (params) => {
    return http.fetchPost(baseUrl + '/messages/savemeta', params)
}

/**
 * savemetadata 参数示例:
 * params: "nftId"
 */
export const querymetadata = (params) => {
    return http.fetchPost(baseUrl + '/messages/getmeta?nftId=' + params)
}


/**
 * saveoffer 参数示例:
 * params: {
 *  "nftId": "12",
 *  "address": "0xowner",
 *  "price": "100"
 * }
 */
export const saveoffer = (params) => {
    return http.fetchPost(baseUrl + '/messages/saveoffer', params);
}

/**
 * queryoffer 参数示例:
 * params: {
 *  "nftId": "12"
 * }
 */
 export const queryoffer = (params) => {
    return http.fetchPost(baseUrl + '/messages/readoffer?nftId=' + params);
}

/**
 * updateowner 参数示例:
 * params: {
 *  "nftId": "12",
 *  "newOwner": "0xnewowner"
 * }
 */
 export const updateowner = (params) => {
    return http.fetchPost(baseUrl + '/messages/updateowner', params);
}