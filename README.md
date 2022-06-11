# 2022-Wanxiang-Blockchain-Spring-Hackathon-ModelLab-BlockModel
**Tokenmics Made Easy. A web workspace and decentralized protocol for the design and optimization of Tokenmics.**   
Smart Contracts: https://github.com/Web3Models/Modelin-contract   
Demo Video: https://youtu.be/gtimnKbfId0   
## Inspiration
At the very begining of this project, we were aware of two typical and obvious phenomenon:
1. There are already thousands of finance products on blockchains, and we don't want to just make a new finance product doing same things as existed ones only with different UI / name / logo. We decided to create a brand-new, eye-catching dApp.
2. For past years, we have witnessed many dApps crashing down, because of theire unhealthy token-economy. What if there exist a user-friendly tool that can help web3 solo-developer / teams to design, test, learn and spread good token economy models?

## What it does
Our product —— BlockModel —— is built for lowering the entrance of building and spreading good token-economy.
### Build
We implement a token-economy simulator engine which can be used in a low-code way. Users only need to drag some components to build up their own economy model, and then set parameters of it. Just one click on "start", everything will be calculated automatically. Also, users can stop at anytime before simulation ended, and adjust parameters. At the end, we provide data visualization panel to show simulation data clearly. 
### Spread
Surprisingly, our token-economy model is able to be minted as NFT! In this way, token-economy knowledge could be spreaded all over the world without any permission. However, we also consider about ideas protection. On our marketplace, we have a encryption / decryption solution that could effectively protect valuable idea data during ownership transfer.

## How we built it
- Front End  
We implement ont only front pages, but also the entire token-economy simulator engine at front-end. Front pages include marketplace, create-canvas.
- Back End  
At back-end, we store NFT metedata synced from on-chain events, and buy-order / sell-order, in order to improve user experience.
- Smart Contract  
Since our main focus is around token economy simulator, we don't have enough time to design completed on-chain logics. Currently we have ERC721, vault, marketplace contracts.
- IPFS  
Although we already synced NFT metadata at back end, we don't want to keep NFT private data part at our back end. We put encrypted private data on IPFS so that creators on our dApp would not need to worry about their data privacy & security.

## Challenges we ran into 
- Provide a front UI to handily construct token-economy model.
- Design a proper engine for simulating token-economy model.
- Update access-control of private data when NFT ownership transferred.
- Encrypt / decrypt private data

## Accomplishments that we're proud of
- A easy-to-use and result-correct token economy simulator
- A marketplace with provided solution of protecting private data of NFT

## What we learned
- IPFS technology and application
- Lots of DeFi protocols designs and their token economy
- Main- stream NFT marketplace design
- Classical encrypt / decrypt solutions

## What's next for BlockModel
- Tool should be more generic to adapt kinds of existed token economy. For example, there should be more type of nodes, self-defined parameters and so on.
- Provide more real token economy model that is already used in popular dApp, as tutorials / use-cases.
- Design completed creator-economy and our own token-economy :)
- Become a mature Web3 knowledge community containing many more valuable knowledge!


## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
