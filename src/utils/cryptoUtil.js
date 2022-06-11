const crypto = require("crypto");

// 使用指定的加密器对指定数据进行加密
export function encryptDataNormal(cipher, data) {
    if (data == null || cipher == null)
      return "NULL";
    // 使用加密器加密 secret data
    let crypted = cipher.update(data, "utf8", "hex");
    crypted += cipher.final("hex");

    return crypted;
}

// 使用指定的 key 创建 AES 加密器并解密数据
export function decryptDataNormal(encrypted, key) {
    const decipher = crypto.createDecipheriv("aes256", key, Buffer.alloc(16, 0));
    var decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// 获取 EOA 对应的加密公钥
export async function getEOAPubkey(address) {
    let res = await window.ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [address], // you must have access to the specified account
    });

    return res;
}

// EOA 加密数据
export function encryptDataEOA(pub, data) {
    let encryptedMessage = "";
    
    const ethUtil = require('ethereumjs-util');
    const sigUtil = require('@metamask/eth-sig-util');

    encryptedMessage = ethUtil.bufferToHex(
        Buffer.from(
            JSON.stringify(
                sigUtil.encrypt({
                    publicKey: pub,
                    data: data,
                    version: 'x25519-xsalsa20-poly1305',
                })
            ),
            'utf8'
        )
    );
    return encryptedMessage;
}

// EOA 解密数据
export async function decryptDataEOA(data, address) {
    console.log("data:", data, "address:", address);
    let res = await window.ethereum.request({
          method: 'eth_decrypt',
          params: [data, address],});
    console.log("decrypt data:", res);

    return res;
    //   })
    //   .then((decryptedMessage) =>
    //       console.log('The decrypted key is:', decryptedMessage)
    //   )
    //   .catch((error) => console.log(error.message));
}
