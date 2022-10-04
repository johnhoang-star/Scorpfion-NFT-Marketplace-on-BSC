import React, { memo, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Clock from "../components/Clock";
import Footer from '../components/footer';
//import { createGlobalStyle } from 'styled-components';
import * as selectors from '../../store/selectors';
import { fetchNftDetail } from "../../store/actions/thunks";
/*import Checkout from "../components/Checkout";*/
import api from "../../core/api";
import moment from "moment";
import axios from "axios";
import { traits, rarity, lives } from '../components/constants/filters';
import {
    connectWallet,
    getCurrentWalletConnected,
    mintMarketItem,
    mintMarketItemToList,
    getPriceById,
    check_minted,
    gettokenURI,
    setApprovalForAll
} from "../../core/nft/interact";

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const ItemMintReduxGrey = ({ nftId }) => {

    const [openMenu0, setOpenMenu0] = React.useState(true);

    const handleBtnClick0 = () => {
        setOpenMenu0(!openMenu0);
         document.getElementById("Mainbtn0").classList.add("active");
    };

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [trx, setTx] = useState("")
    const [my_price, setPrice] = useState(0);
    const [listed_price, setPriceToList] = useState(0);

    const [isMinting, setisMinting] = useState(false);
    const [isMinted, setMinted] = useState(false);

    const [nft_data, setNFTData] = useState({});

    const getInfofromSubgraph = async () => {
        let query = {
            query: `{ nftitems( where:{id: "${nftId}"}) { id tokenId BaseUrl ImgUrl level price type status creator holder}}`
        }
        let result = await axios.post('https://api.thegraph.com/subgraphs/name/goldenstar111/marketplace',query)
        
        return result?.data?.data?.nftitems
    }

    useEffect(async () => {
      async function getExistingWallet() {
        const { address, status } = await getCurrentWalletConnected();
    
        setWallet(address);
        setStatus(status);
    
        addWalletListener();
      }

      getExistingWallet();
      let allInfo = await getInfofromSubgraph();
      setPrice(parseInt(allInfo[0]?.price)/1e18);
      allInfo[0]?.status == "notmint" ? setMinted(false) : setMinted(true);

      const _uri = await gettokenURI(nftId);
      setNFTData({
          "title" : _uri.title,
          "description" : _uri.description,
          "item_type" : _uri.type,
          "img_url" : 'https://scorpion-finance.mypinata.cloud/ipfs/'+(_uri.image).slice(7,),
          "cat_type" : _uri.attributes[0].value,
          "cat_rarity" : _uri.attributes[1].value,
          "cat_lives" : _uri.attributes[2].value,
      })
    //   console.log('uri',_uri);
    }, []);
  
    function addWalletListener() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWallet(accounts[0]);
            // setStatus("Please clieck mint button.");
          } else {
            setWallet("");
            setStatus("🦊 Connect to Metamask using the top right button.");
          }
        });
      } else {
        setStatus(
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        );
      }
    }
  
    const connectWalletPressed = async () => {
      const walletResponse = await connectWallet();
      setStatus(walletResponse.status);
      setWallet(walletResponse.address);
    };
  
    const onMintPressed = async () => {
      setisMinting(true);
      const { success, status, tx } = await mintMarketItem(nftId, my_price);
      setStatus(status);
      if (success) {
        setTx(tx)
      }else{
        setTx("")
      }
      setisMinting(false);
    //   setMinted(true)
    
        await setApprovalForAll();
        setTimeout(function(){ 
        window.location.reload(); 
        }, 10000);
    };

    const onMintPressedToList = async () => {
        setisMinting(true);
        const { success, status, tx } = await mintMarketItemToList(nftId, my_price, listed_price);
        setStatus(status);
        if (success) {
          setTx(tx)
        }else{
          setTx("")
        }
        setisMinting(false);
        // setMinted(true)
        await setApprovalForAll();
        setTimeout(function(){ window.location.reload(); }, 10000);
      };

    const getTraits = (category) => {
        var value;
        if(category == 'super_founder')
            value = traits[0]["label"]
        else if(category == 'founder')
            value = traits[1]["label"]
        else if(category == 'rare')
            value = traits[2]["label"]
        else if(category == 'limited_edition')
            value = traits[3]["label"]
        return value;
    }

    const getRarity = (category) => {
        var value;
        if(category == 'super_founder')
            value = rarity[0]["label"]
        else if(category == 'founder')
            value = rarity[1]["label"]
        else if(category == 'rare')
            value = rarity[2]["label"]
        else if(category == 'limited_edition')
            value = rarity[3]["label"]
        return value;
    }

    const getLives = (category) => {
        var value;
        if(category == 'super_founder')
            value = lives[0]["label"]
        else if(category == 'founder')
            value = lives[1]["label"]
        else if(category == 'rare')
            value = lives[2]["label"]
        else if(category == 'limited_edition')
            value = lives[3]["label"]
        return value;
    }

    const dispatch = useDispatch();
    const nftDetailState = useSelector(selectors.nftDetailState);
    const nft = nftDetailState.data ? nftDetailState.data : [];

    const [openCheckout, setOpenCheckout] = React.useState(false);
    const [openCheckoutbid, setOpenCheckoutbid] = React.useState(false);

    useEffect(() => {
        dispatch(fetchNftDetail(nftId));
    }, [dispatch, nftId]);

    return (
        <div className="greyscheme">
        <StyledHeader theme={theme} />
        <section className='jumbotron breadcumb no-bg'>
            <div className='mainbreadcumb'>
                <div className='container'>
                    <div className='row m-10-hor'>
                    <div className='col-12'>
                        <h1 className='text-center'>Mint Scorpion NFT Fighters</h1>
                    </div>
                    </div>
                </div>
            </div>
        </section>
            <section className='container'>
                <div className='row mt-md-1 pt-md-1'>
                    <div className="col-md-6 text-center">
                    {
                        // nft.img_url == null ? 
                        // <img src={ nft.preview_image && api.baseUrl + nft.preview_image.url} className="img-fluid img-rounded mb-sm-30" alt=""/>
                        // :(
                            // nft.item_type == "image" ?
                            nft_data?.item_type == "video" ?
                            <video className="lazy nft__item_preview nft__video_preview" controls autoPlay loop>
                                <source src={nft_data.img_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            :
                            <img src={ nft_data.img_url} className="img-fluid img-rounded mb-sm-30" alt="No Image"/>

                        // )
                    }
                    </div>
                    <div className="col-md-6">
                        <div className="item_info">
                            {
                                // nft.item_type === 'on_auction' &&
                                // <>
                                //     Auctions ends in 
                                //     <div className="de_countdown">
                                //         <Clock deadline={nft.deadline} />
                                //     </div>
                                // </>
                            }
                            <h2>{nft_data.title ? nft_data.title : 'Item Title'}</h2>
                            {/* <h2>{nft.title}</h2> */}
                            <div className="item_info_counts">
                                {/* <div className="item_info_type"><i className="fa fa-image"></i>{nft.category}</div>
                                <div className="item_info_views"><i className="fa fa-eye"></i>{nft.views}</div>
                                <div className="item_info_like"><i className="fa fa-heart"></i>{nft.likes}</div> */}
                                <div className="item_info_type"><i className="fa fa-image"></i>{nft_data.cat_type}</div>
                                <div className="item_info_views"><i className="fa fa-eye"></i>{nft.views}</div>
                                <div className="item_info_like"><i className="fa fa-heart"></i>{nft.likes}</div>
                            </div>
                            <p>{nft_data.description ? nft_data.description : 'Item Detail Information'}</p>
                            {/* <p>{nft.description}</p> */}

                            <div className="d-flex flex-row">
                                <div className="mr40">
                                    <h6>Collection</h6>
                                    <p>Scorpion NFT</p>
                                    {/* <p>{nft.collections}</p> */}
                                </div>
                                <div className="mr40" style={{paddingLeft: "15px" }}>
                                    <h6>Price</h6>
                                    <p>{my_price} BNB</p>
                                    {/* <p>{nft.price} BNB</p> */}
                                </div>
                            </div>
                            <h5>Listed Price</h5>
                            <input type="text" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item (BNB)" onChange={(ev)=> setPriceToList(ev.target.value)}/>
                            <div className="spacer-20"></div>

                            <div className="de_tab">

                            <ul className="de_nav">
                                <li id='Mainbtn0' className="active"><span onClick={ () => handleBtnClick0()}>Details</span></li>
                            </ul>
                                        
                            <div className="de_tab_content">
                                {openMenu0  && (  
                                <div className="tab-1 onStep fadeIn">
                                    <div className="d-block mb-3">
                                        <div className="row mt-5">
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Traits</h5>
                                                    <h4>{nft_data.cat_type}</h4>
                                                    {/* <h4>{getTraits(nft.category)}</h4> */}
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Rarity</h5>
                                                    <h4>{nft_data.cat_rarity}</h4>
                                                    {/* <h4>{getRarity(nft.category)}</h4> */}
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Lives</h5>
                                                    <h4>{nft_data.cat_lives}</h4>
                                                    {/* <h4>{getLives(nft.category)}</h4> */}
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Background</h5>
                                                    <h4>Yellowish Sky</h4>
                                                    <span>85% have this trait</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Eyes</h5>
                                                    <h4>Purple Eyes</h4>
                                                    <span>14% have this trait</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Nose</h5>
                                                    <h4>Small Nose</h4>
                                                    <span>45% have this trait</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Mouth</h5>
                                                    <h4>Smile Red Lip</h4>
                                                    <span>61% have this trait</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Neck</h5>
                                                    <h4>Pink Ribbon</h4>
                                                    <span>27% have this trait</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Hair</h5>
                                                    <h4>Pink Short</h4>
                                                    <span>35% have this trait</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Accessories</h5>
                                                    <h4>Heart Necklace</h4>
                                                    <span>33% have this trait</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Hat</h5>
                                                    <h4>Cute Panda</h4>
                                                    <span>62% have this trait</span>
                                                </div>
                                            </div>      
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                                <div className="nft_attr">
                                                    <h5>Clothes</h5>
                                                    <h4>Casual Purple</h4>
                                                    <span>78% have this trait</span>
                                                </div>
                                            </div>                                   
                                        </div>

                                    </div>
                                </div>
                                )}

                                {/* button for checkout */}
                                <div className="mt-5">
                                    {
                                        isMinted == true && (
                                            <>
                                                <p>This NFT is already minted</p>
                                                <button className="btn-main" onClick={()=> window.open("/ItemDetail/"+nftId, "_self")}>
                                                    Go to Detail Page
                                                </button>
                                            </>
                                        )
                                    }
                                    {walletAddress.length === 0 && isMinted == false && (
                                    <button id="walletButton" className="btn-main" onClick={ () => connectWalletPressed()}>
                                        Connect Metamask
                                    </button>
                                    )}
                                    {walletAddress.length > 0 && isMinted == false && (
                                    "Connected Account: " + walletAddress
                                    )}
                                    <br/><br/>
                                    {walletAddress.length === 0 && isMinted == false && (
                                    <p>
                                        connect to metamask to start minting
                                    </p>
                                    )}
                                    {isMinting  && isMinted == false ? (
                                    <h4>Minting in Process</h4>
                                    ) : (
                                    <div>
                                    {
                                        walletAddress.length > 0 && isMinted == false &&
                                        <>
                                            <button id="mintButton" className="btn-main" onClick={ () => onMintPressed()} 
                                            >
                                                Proceed to Mint
                                            </button>
                                            <button id="mintButton" className="btn-main" style={{marginTop: '25px' }} onClick={ () => onMintPressedToList()}>
                                                Proceed to Mint for list
                                            </button>
                                            <br />
                                            <p id="status">
                                                {status}
                                            </p>
                                            {
                                                trx == "" ? <></> : <a href={trx} target="_blank">{trx}</a>
                                            }
                                        </>
                                    }
                                    </div>
                                    )}
                                    {/* <button className='btn-main lead mb-5 mr15' onClick={() => setOpenCheckout(true)}>Mint Now</button> */}
                                </div>
                            </div>     
                        </div>          
                    </div>
                </div>
            </div>
        </section>
        <Footer /> 
        </div>
    );
}

export default memo(ItemMintReduxGrey);