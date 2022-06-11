const ipfsAPI = require("ipfs-api");
let ipfs = null;
const ipfsServerIP = "127.0.0.1";
const ipfsServerPort = "5001";

export async function setupIPFS() {
    try {
        if (ipfs == null) {
            ipfs = ipfsAPI({host: ipfsServerIP, port: ipfsServerPort, protocol: "http"});
            const id = await ipfs.id();
            console.log("IPFS instance id", id.id);
        }
    } catch (err) {
      console.error(err);
    }
}

export async function uploadToIPFS(data) {
    try {
        let res = await ipfs.add(Buffer.from(data));
        console.log("upload to ipfs res:", res[0].hash);
        return res[0].hash;
    } catch (err) {
        console.error(err);
        return "-1";
    }
}

export async function downloadFromIPFS(cid) {
    try {
        let res = await ipfs.cat(cid);
        res = new TextDecoder().decode(res);
        console.log("download from ipfs:", res);
        return res;
    } catch (err) {
        console.error(err);
        return "-1";
    }
}