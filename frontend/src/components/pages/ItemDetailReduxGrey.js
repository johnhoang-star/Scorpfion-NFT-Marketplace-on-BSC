import React, { memo, useEffect, useState } from "react";
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

import {
    connectWallet,
    getCurrentWalletConnected,
    getPriceById,
    check_minted,
    check_listedAll,
    updatePriceById,
    dropNFTById,
    purchaseItem,
    gettokenURI,
    setApprovalForAll,
} from "../../core/nft/interact";

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const ItemDetailRedux = ({ nftId }) => {

    const [openMenu0, setOpenMenu0] = React.useState(true);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [openMenu1, setOpenMenu1] = React.useState(false);

    const handleBtnClick0 = () => {
        setOpenMenu0(!openMenu0);
        setOpenMenu(false);
        setOpenMenu1(false);
         document.getElementById("Mainbtn0").classList.add("active");
        // document.getElementById("Mainbtn").classList.remove("active");
        // document.getElementById("Mainbtn1").classList.remove("active");
    };

    const [walletAddress, setWallet] = useState("");
    const [creatorAddr, setCreator] = useState("");
    const [holderAddr, setHolder] = useState("");

    const [status, setStatus] = useState("");
    const [trx, setTx] = useState("");

    const [my_price, setPrice] = useState(0);
    const [listed_price, setPriceToList] = useState(0);

    const [isProgressing, setisProgressing] = useState(false);
    const [isMinted, setMinted] = useState(false);
    const [isListed, setListed] = useState(false);

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
    setCreator(allInfo[0]?.creator)
    setHolder(allInfo[0]?.holder)
    setPrice(parseInt(allInfo[0]?.price)/1e18)
    allInfo[0]?.status == "notmint" ? setMinted(false) : setMinted(true);
    
    allInfo[0]?.status == "listed" ? setListed(true) : setListed(false);

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

    }, []);

    const addWalletListener = () => {
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
  
    const onUpdateItem = async () => {
      setisProgressing(true);
      const { success, status, tx } = await updatePriceById(nftId, listed_price);
      setStatus(status);
      if (success) {
        setTx(tx)
      }else{
        setTx("")
      }
    //   setListed(true);
    //   setPrice(listed_price);
        setisProgressing(false);
        setMinted(true)
        setTimeout(function(){ 
        window.location.reload(); 
        }, 10000);
    };

    const onDropItem = async () => {
        setisProgressing(true);
        const { success, status, tx } = await dropNFTById(nftId);
        setStatus(status);
        if (success) {
          setTx(tx)
        }else{
          setTx("")
        }
        // setListed(false);
        setisProgressing(false);
        setMinted(true)
        setTimeout(function(){ 
            window.location.reload(); 
        }, 10000);
    };

    const onPurchaseItem = async () => {
        setisProgressing(true);
        const { success, status, tx } = await purchaseItem(nftId, my_price);
        setStatus(status);
        if (success) {
          setTx(tx)
        }else{
          setTx("")
        }
        setHolder(walletAddress);
        setListed(false);
        setisProgressing(false);
        setMinted(true)
        
        await setApprovalForAll();
        setTimeout(function(){ 
            window.location.reload(); 
        }, 10000);
    };

    const dispatch = useDispatch();
    const nftDetailState = useSelector(selectors.nftDetailState);
    const nft = nftDetailState.data ? nftDetailState.data : [];

    const [openCheckout, setOpenCheckout] = React.useState(false);
    const [openCheckoutbid, setOpenCheckoutbid] = React.useState(false);

    useEffect(() => {
        // dispatch(fetchNftDetail(nftId));
    }, [dispatch, nftId]);

    return (
        <div className="greyscheme">
        <StyledHeader theme={theme} />
            <section className='container'>
                <div className='row mt-md-5 pt-md-4'>
                    <div className="col-md-6 text-center">
                    {
                        // nft.img_url == null ? 
                        // <img src={ nft.preview_image && api.baseUrl + nft.preview_image.url} className="img-fluid img-rounded mb-sm-30" alt=""/>
                        // :(
                            nft.item_type == "video" ?
                            <video className="lazy nft__item_preview nft__video_preview" controls autoPlay loop>
                                <source src={nft_data.img_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            :
                            <img src={ nft_data.img_url} className="img-fluid img-rounded mb-sm-30" alt=""/>
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
                            <h2>{nft_data?.title ? nft_data.title : "Item Title"}</h2>
                            <div className="item_info_counts">
                                <div className="item_info_type"><i className="fa fa-image"></i>{nft.category}</div>
                                <div className="item_info_views"><i className="fa fa-eye"></i>{nft.views}</div>
                                <div className="item_info_like"><i className="fa fa-heart"></i>{nft.likes}</div>
                            </div>
                            <p>{nft_data?.description ? nft_data.description : "Item Detail Information"}</p>

                            <div className="d-flex flex-row">
                            </div>
                            {
                                isMinted && (<>
                                <h5>Creator : <p>{creatorAddr}</p></h5>
                                <h5>Owner : <p>{holderAddr}</p></h5>
                                <h5>Price : <span>{my_price} BNB</span></h5>
                                <h5>Status : <span>{isListed? <>Listed</>:<>Not Listed</>}</span></h5>
                                <div className="spacer-20"></div>
                                {
                                    (walletAddress == holderAddr) &&
                                    <>
                                        <h5>Listed Price</h5>
                                        <input type="text" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item (BNB)" onChange={(ev)=> setPriceToList(ev.target.value)}/>
                                    </>
                                }
                                </>)
                            }
                            <div className="spacer-20"></div>

                            <div className="de_tab">

                            <ul className="de_nav">
                                <li id='Mainbtn0' className="active"><span onClick={handleBtnClick0}>Details</span></li>
                                {/* <li id='Mainbtn' ><span onClick={handleBtnClick}>Bids</span></li> */}
                                {/* <li id='Mainbtn1' className=''><span onClick={handleBtnClick1}>History</span></li> */}
                            </ul>
                                        
                            <div className="de_tab_content">
                                {openMenu0  && (  
                                <div className="tab-1 onStep fadeIn">
                                    <div className="d-block mb-3">
                                        {/* <div className="mr40">
                                            <h6>Owner</h6>
                                            <div className="item_author">                                    
                                                <div className="author_list_pp">
                                                    <span>
                                                        <img className="lazy" src={nft.author && api.baseUrl + nft.author.avatar.url} alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>                                    
                                                <div className="author_list_info">
                                                    <span>{nft.author && nft.author.username}</span>
                                                </div>
                                            </div>
                                        </div> */}

                                        <div className="row mt-5">
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

                                {openMenu  && (  
                                <div className="tab-1 onStep fadeIn">
                                    {nft.bids && nft.bids.map((bid, index) => (
                                        <div className="p_list" key={index}>
                                            <div className="p_list_pp">
                                                <span>
                                                    <img className="lazy" src={api.baseUrl + bid.author.avatar.url} alt=""/>
                                                    <i className="fa fa-check"></i>
                                                </span>
                                            </div>                                    
                                            <div className="p_list_info">
                                                Bid {bid.author.id === nft.author.id && 'accepted'} <b>{bid.value} ETH</b>
                                                <span>by <b>{bid.author.username}</b> at {moment(bid.created_at).format('L, LT')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                )}

                                {openMenu1 && ( 
                                <div className="tab-2 onStep fadeIn">
                                    {nft.history && nft.history.map((bid, index) => (
                                        <div className="p_list" key={index}>
                                            <div className="p_list_pp">
                                                <span>
                                                    <img className="lazy" src={api.baseUrl + bid.author.avatar.url} alt=""/>
                                                    <i className="fa fa-check"></i>
                                                </span>
                                            </div>                                    
                                            <div className="p_list_info">
                                                Bid {bid.author.id === nft.author.id && 'accepted'} <b>{bid.value} ETH</b>
                                                <span>by <b>{bid.author.username}</b> at {moment(bid.created_at).format('L, LT')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                )}


                                {/* button for checkout */}
                                <div className="flex-row mt-5">
                                    {
                                        !isMinted && 
                                        <>
                                            <p>This Item is not minted yet</p>
                                            <button className="btn-main" onClick={()=> window.open("/ItemMint/"+nftId, "_self")}>
                                                Go to Mint Page
                                            </button>
                                        </>
                                    }
                                    {
                                        isMinted && (
                                            walletAddress == holderAddr ? (
                                                isListed ? 
                                                <>
                                                    <button className='btn-main lead mb-5 mr15' onClick={() => onUpdateItem()}>Update Price</button>
                                                    <button className='btn-main btn2 lead mb-5' onClick={() => onDropItem()}>Drop Item From List</button>
                                                </>
                                                 : 
                                                <>
                                                    <button className='btn-main lead mb-5 mr15' onClick={() => onUpdateItem()}>List Item</button>
                                                </>
                                            )
                                            : 
                                            (
                                                isListed && 
                                                <>
                                                    <button className='btn-main lead mb-5 mr15' onClick={() => onPurchaseItem()}>Purchase Item</button>
                                                </>
                                            )
                                        )
                                    }
                                </div>
                            </div>     
                        </div>          
                    </div>
                </div>
            </div>
        </section>
        <Footer /> 
        { openCheckout &&
            <div className='checkout'>
            <div className='maincheckout'>
            <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                <div className='heading'>
                    <h3>Checkout</h3>
                </div>
              <p>You are about to purchase a <span className="bold">AnimeSailorClub #304</span> 
              <span className="bold">from Monica Lucas</span></p>
                <div className='detailcheckout mt-4'>
                    <div className='listcheckout'>
                  <h6>
                    Enter quantity. 
                    <span className="color">10 available</span>
                  </h6>
                  <input type="text" name="buy_now_qty" id="buy_now_qty" className="form-control"/>
                    </div>

                </div>
                <div className='heading mt-3'>
                    <p>Your balance</p>
                    <div className='subtotal'>
                    10.67856 ETH
                    </div>
                </div>
              <div className='heading'>
                <p>Service fee 2.5%</p>
                <div className='subtotal'>
                0.00325 ETH
                </div>
              </div>
              <div className='heading'>
                <p>You will pay</p>
                <div className='subtotal'>
                0.013325 ETH
                </div>
              </div>
                <button className='btn-main lead mb-5'>Checkout</button>
            </div>
            </div>
        }
        { openCheckoutbid &&
            <div className='checkout'>
            <div className='maincheckout'>
            <button className='btn-close' onClick={() => setOpenCheckoutbid(false)}>x</button>
                <div className='heading'>
                    <h3>Place a Bid</h3>
                </div>
              <p>You are about to purchase a <span className="bold">AnimeSailorClub #304</span> 
              <span className="bold">from Monica Lucas</span></p>
                <div className='detailcheckout mt-4'>
                    <div className='listcheckout'>
                        <h6>
                         Your bid (ETH)
                        </h6>
                        <input type="text" className="form-control"/>
                    </div>
                </div>
                <div className='detailcheckout mt-3'>
                    <div className='listcheckout'>
                        <h6>
                         Enter quantity. 
                        <span className="color">10 available</span>
                        </h6>
                        <input type="text" name="buy_now_qty" id="buy_now_qty" className="form-control"/>
                    </div>
                </div>
                <div className='heading mt-3'>
                    <p>Your balance</p>
                    <div className='subtotal'>
                    10.67856 ETH
                    </div>
                </div>
              <div className='heading'>
                <p>Service fee 2.5%</p>
                <div className='subtotal'>
                0.00325 ETH
                </div>
              </div>
              <div className='heading'>
                <p>You will pay</p>
                <div className='subtotal'>
                0.013325 ETH
                </div>
              </div>
                <button className='btn-main lead mb-5'>Checkout</button>
            </div>
            </div>
        }

        </div>
    );
}

export default memo(ItemDetailRedux);