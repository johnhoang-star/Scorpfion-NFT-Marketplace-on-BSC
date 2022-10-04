import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("./contract-abi.json");
const MarketABI = require("./market-abi.json");
const NFTABI = require("./nft-abi.json");
const contractAddress = "0x92d474d216ce429c1efc7f48d7ff66bae5d070cd";
const Market_Addr = "0x43519CF5E922cE3C61B48Da16004C01f9Cc1Cab1";
const NFT_Addr = "0xF70765DB23A53aB65053BF47B1062b61cf6aa9eD";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const connectWallet = async () => {
  if (window.ethereum) {
    if(window.ethereum.chainId != 0x38){
      alert('Please switch network to bsc mainnet')
      return {
        address : "",
        status: "Wrong Network"
      }
    }
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Metamask successfuly connected.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Please check information and mint.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async (url, name, description) => {
  if (url.trim() === "" || name.trim() === "" || description.trim() === "") {
    return {
      success: false,
      status: "Please make sure all fields are completed before minting.",
    };
  }

  //make metadata
  const metadata = {};
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};

export const getPriceById = async (_id) => {
  const tmp_id = parseInt(_id);
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .getPriceById(tmp_id)
      .encodeABI(),
  };

  try {
    var price = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    price = parseInt(price) / 10**18;
    return price;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
}

export const gettokenURI = async (_id) => {
  var id = parseInt(_id) - 1
  var _uri = 'https://scorpion-finance.mypinata.cloud/ipfs/QmWPP3ZSPcaFCuG7on8YHrEbRa3QdjRgB4j9UYvpqdWJ3E/' + id + '.json'
  var data = await fetch(_uri, {method: 'get'} ).then(response => response.json())
  return data;
  // .then(data => {
  //     // console.log('data', data);
  //     return data;
  // }).catch(err=>{
  //     console.log(err);
  // });
  /*const tmp_id = parseInt(_id);
  window.nft = await new web3.eth.Contract(NFTABI, NFT_Addr);
  console.log('window.nft', window.nft)
  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.nft.methods
      .tokenURI(tmp_id)
      .encodeABI(),
  };

  try {
    var _uri = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    return _uri;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
  */
}

export const check_minted = async (_id) => {
  const tmp_id = parseInt(_id);
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .check_minted(tmp_id)
      .encodeABI(),
  };

  try {
    var _minted = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    return _minted;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
}

export const check_listedAll = async (_id) => {
  const tmp_id = parseInt(_id);
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .marketItembyId(tmp_id)
      .encodeABI(),
  };

  try {
    var _item = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    return _item;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
}

export const owner = async () => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .owner()
      .encodeABI(),
  };

  try {
    var owneraddr = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    return owneraddr;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
}

export const ownerOf = async (_id) => {
  const tmp_id = parseInt(_id);
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .ownerOf(tmp_id)
      .encodeABI(),
  };

  try {
    var _owner = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    return _owner;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
}

export const balanceOf = async (addr) => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .balanceOf(addr)
      .encodeABI(),
  };

  try {
    var cnt = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    return cnt;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
}

export const fetchMyNFTs = async (addr) => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .fetchMyNFTs(addr)
      .encodeABI(),
  };

  try {
    var my_nfts = await window.ethereum.request({
      method: "eth_call",
      params: [transactionParameters],
    });
    return my_nfts;
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
}

export const mintMarketItem = async (id, price) => {
  // if (id < 0) {
  //   return {
  //     success: false,
  //     status: "Please make sure all fields are completed before minting.",
  //   };
  // }

  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);
  const hex_price = web3.utils.toHex(web3.utils.toWei(price.toString(), 'ether'))

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: hex_price, // Only required to send ether to the recipient from the initiating external account.
    data: window.market.methods
      .mintNFT(id)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};

export const mintMarketItemToList = async (id, price, new_price) => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);
  var hex_price = web3.utils.toHex(web3.utils.toWei(price.toString(), 'ether'))
  var hex_newprice = web3.utils.toHex(web3.utils.toWei(new_price.toString(), 'ether'))

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: hex_price, // Only required to send ether to the recipient from the initiating external account.
    data: window.market.methods
      .mintNFTforList(id, hex_newprice)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};

export const claim = async (addr) => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .claim(addr)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};

export const Init = async () => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .init(1,1)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};


export const dropNFTById = async (_id) => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .dropNFTById(parseInt(_id))
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};


export const purchaseItem = async (id, price) => {
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);
  const hex_price = web3.utils.toHex(web3.utils.toWei(price.toString(), 'ether'))

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: hex_price, // Only required to send ether to the recipient from the initiating external account.
    data: window.market.methods
      .purchaseItem(parseInt(id))
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};


export const updatePriceById = async (id, price) => {
  var tmpId = parseInt(id);
  window.market = await new web3.eth.Contract(MarketABI, Market_Addr);
  const hex_price = web3.utils.toHex(web3.utils.toWei(price.toString(), 'ether'))

  const transactionParameters = {
    to: Market_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.market.methods
      .updatePriceById(tmpId, hex_price)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};

export const setApprovalForAll = async () => {
  window.nft = await new web3.eth.Contract(NFTABI, NFT_Addr);

  const transactionParameters = {
    to: NFT_Addr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.nft.methods
      .setApprovalForAll(Market_Addr, true)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "Check out your transaction on Etherscan: ",
      tx: "https://kovan.etherscan.io/tx/" + txHash,
      // tx: "https://testnet.bscscan.com/tx/" + txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};