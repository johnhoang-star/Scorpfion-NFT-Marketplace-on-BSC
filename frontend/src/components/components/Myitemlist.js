import React, { memo, useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import NftCard from './NftCard';
import NftVideoCard from './NftVideoCard';
import NftImgCard from './NftImgCard';
import axios from "axios";

import {
    getCurrentWalletConnected,
    // getPriceById,
    // check_minted,
    check_listedAll,
    gettokenURI,
    fetchMyNFTs
} from "../../core/nft/interact";

const GlobalStyles = createGlobalStyle`
    .de_countdown{
        position: relative;
        box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.3);
        top: 0;
        left: 0;
        margin-bottom: 20px;
        div{
            display: flex;
            justify-content: center;
        }
        .Clock-days, .Clock-hours, .Clock-minutes{
            margin-right: 10px;
        }
    }
`;


const Myitemlist = () => {
    const [nfts, setnfts] = useState(null)

    const [height, setHeight] = useState(0);
    const [myWallet, setmyWallet] = useState("");

    const [loaded, setLoaded] = useState(false);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
        setLoaded(true)
    }
    
    const getmyitems = async (myaccount) => {
        let query = {
            query: `{ nftitems( where:{holder: "${myaccount}"}) { id tokenId BaseUrl ImgUrl level price type status}}`
        }
        let result = await axios.post('https://api.thegraph.com/subgraphs/name/goldenstar111/marketplace',query)
        
        return result?.data?.data?.nftitems
    }

    useEffect( async () => {
        const { address, status } = await getCurrentWalletConnected();
        setmyWallet(address);
        let _nfts = await getmyitems(address);
        setnfts(_nfts);
    }, []);

    
  return (
    <div className='row'>
        <GlobalStyles />
        {/* {
            nfts && nfts.map( (nft, index) => (
            <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} clockTop={false} />)
            )
        } */}
        {
            nfts && nfts.map( (nft, index) => (
                nft.type == "image" ?
                            <NftImgCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} loaded={loaded}/>
                            :
                            <NftVideoCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
                )
            )
        }
        { 
            // nfts.length <= 20 &&
            // <div className='col-lg-12'>
            //     <div className="spacer-single"></div>
            //     <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
            // </div>
        }
    </div>              
    );
}

export default Myitemlist