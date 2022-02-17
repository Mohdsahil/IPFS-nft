require("dotenv").config()
const _ = require('underscore');
const fs = require('fs');
const Nft = require("../models/nft")
const ItemTransaction = require("../models/itemTransaction")
const { handleException } = require('../helpers/exception');
const Response = require('../helpers/response');
const Constant = require('../helpers/constant');
const { create } = require("ipfs-http-client")
const {API_URI, PUBLIC_KEY, PRIVATE_KEY, CONTRACT_ADDRESS, IPFS_BASE_URL } = process.env
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URI)
const contract = require("../contracts/NFT.json")
const contractAddress = CONTRACT_ADDRESS
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)


const uploadImage = async (req, res) => {
    const { logger } = req;
    try {
        console.log(req.files['myImage'])
        const { mimetype, md5, data } = req.files['myImage'];

        let ipfs = await ipfsClient();

        let result = await ipfs.add(data);
        console.log(result);

        console.log("ipfs upload images here")
        const obj = {
            res,
            status: 201,
            msg: "file uploaded successfully.",
            data: result
        };
          return Response.success(obj);
    } catch(error) {
        return handleException(logger, res, error)
    }
}

const createNftRequest = async (req, res) => {
  const { logger } = req
  try {
    const { mimetype, md5, data } = req.files['myImage'];
        let {
            name,
            description,
            account
        } = req.body
        let ipfs = await ipfsClient();
        // console.log(req.body)
        // console.log(req.files )
        let result = await ipfs.add(data);
        // console.log(result);
        let nftImg = `${IPFS_BASE_URL}/${result.path}`
        let nftMetadata = {
            "attributes": [
                {
                    "color": "brown",
                    "value": "ABC"
                }
            ],
            "description": description,
            "image": nftImg,
            "name": name
        }
        fs.writeFileSync('nft-metaData.json', JSON.stringify(nftMetadata));
        let nftMetaData = fs.readFileSync('nft-metaData.json')
        let nftResult = await ipfs.add(nftMetaData);
       
        let tokenURI = `${IPFS_BASE_URL}/${nftResult.path}`
        const gasFee = await nftContract.methods
        .mintNFT(account, tokenURI)
        .estimateGas({ from: account });
      const obj = {
          res,
          status: 201,
          msg: "file uploaded successfully.",
          data: gasFee
      };
      return Response.success(obj);

  } catch (error) {
    return handleException(logger, res, error)
  }
}

const createNFT = async (req, res) => {
    const { logger } = req
    try {
        const { mimetype, md5, data } = req.files['myImage'];
        let {
            name,
            description,
            account
        } = req.body
        let ipfs = await ipfsClient();
        // console.log(req.body)
        // console.log(req.files )
        let result = await ipfs.add(data);
        // console.log(result);
        let nftImg = `${IPFS_BASE_URL}/${result.path}`
        let nftMetadata = {
            "attributes": [
                {
                    "color": "brown",
                    "value": "ABC"
                }
            ],
            "description": description,
            "image": nftImg,
            "name": name
        }
        fs.writeFileSync('nft-metaData.json', JSON.stringify(nftMetadata));
        let nftMetaData = fs.readFileSync('nft-metaData.json')
        let nftResult = await ipfs.add(nftMetaData);
       
        let tokenURI = `${IPFS_BASE_URL}/${nftResult.path}`
        let resp = {
            nftImg,
            tokenURI
        }
        // const obj = {
        //     res,
        //     status: 201,
        //     msg: "file uploaded successfully.",
        //     data: resp
        // };
        // return Response.success(obj);
       
        const gasFee = await nftContract.methods
        .mintNFT(account, tokenURI)
        .estimateGas({ from: account });
       

        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
        const tx = {
            from : PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: gasFee,
            data: nftContract.methods.mintNFT(account, tokenURI).encodeABI()
        }
    
        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
        signPromise
          .then((signedTx) => {
            web3.eth.sendSignedTransaction(
              signedTx.rawTransaction,
              async function (err, hash) {
                if (!err) {
                  console.log(
                    "The hash of your transaction is: ",
                    hash,
                    "\nCheck Alchemy's Mempool to view the status of your transaction!"
                  );
                   await Nft.create({
                    account,
                    nftLink: nftImg,
                    nftMetaData: tokenURI
                  })
                   await ItemTransaction.create({
                      account,
                      txHash: hash
                  })
                  const obj = {
                    res,
                    status: Constant.STATUS_CODE.CREATED,
                    msg: "NFT Created successfully",
                    data: hash
                  }
                  return Response.success(obj)
                } else {
                  console.log(
                    "Something went wrong when submitting your transaction:",
                    err
                  );
                  const obj = {
                    res,
                    status: Constant.STATUS_CODE.BAD_REQUEST,
                    msg: Constant.ERROR_MSGS.INTERNAL_SERVER_ERROR,
                    data: result
                  }
                  return Response.error(obj)
                }
              }
            );
          })
          .catch((err) => {
            console.log(" Promise failed:-", err);
            const obj = {
                res,
                status: Constant.STATUS_CODE.BAD_REQUEST,
                msg: Constant.ERROR_MSGS.INTERNAL_SERVER_ERROR,
                data: result
              }
              return Response.error(obj)
          }); 
        
    } catch (error) {
        return handleException(logger, res, error)
    }
}

const getNftByAccount = async (req, res) => {
  const { logger } = req
  try {
    const { account } = req.params
    const nfts = await Nft.aggregate([
      {
        $match: {
          account: account
        }
      }
    ]) 
    if (_.isEmpty(nfts)) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        data: []
      }
      return Response.success(obj)
    }
    const obj = {
      res,
      status: Constant.STATUS_CODE.OK,
      data: nfts
    }
    return Response.success(obj)
  } catch (error) {
    return handleException(logger, res, error)
  }
}

async function mintNFT(tokenURI) {
    const gasFee = await nftContract.methods
    .mintNFT(account, tokenURI)
    .estimateGas({ from: PUBLIC_KEY });

    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
    const tx = {
        from : PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: gasFee,
        data: nftContract.methods.mintNFT(account, tokenURI).encodeABI()
    }

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
              );
              return hash
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              );
              
              return Response.error(obj)
            }
          }
        );
      })
      .catch((err) => {
        console.log(" Promise failed:-", err);
      });  
}

async function ipfsClient() {
    try {
        const ipfs = await create(
            {
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
            }
        );
        return ipfs;
    } catch (error) {
        console.error(error)
    }
}


module.exports = { 
    uploadImage,  
    createNFT, 
    getNftByAccount,
    createNftRequest 
}