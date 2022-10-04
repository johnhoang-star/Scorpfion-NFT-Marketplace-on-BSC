import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions/thunks';
import { createGlobalStyle } from 'styled-components';
import NftCard from './NftCard';
import NftVideoCard from './NftVideoCard';
import NftImgCard from './NftImgCard';

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


const ColumnAuction = () => {

    const dispatch = useDispatch();
    const nfts = useSelector(selectors.auctionedNfts);

    const [height, setHeight] = useState(0);
    const [myWallet, setmyWallet] = useState("");

    const [all_NFTs, setAllNFTs] = useState([]);

    const [loaded, setLoaded] = useState(false);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
        setLoaded(true)
    }
    
    const getAllInfo = async (hexdata) => {
        var cnt = parseInt(hexdata.slice(66,130));
        console.log('total cnt', cnt);
        var fulldata = [];
        for (let index = 0; index < cnt; index++) {
            var _id, _price, _listed, _level;
            _id = parseInt(hexdata.slice(130+index*64*9,130+64+index*64*9));
            _price = parseInt(hexdata.slice(130+64*5+index*64*9,130+64*6+index*64*9), 16)/10**18;
            // console.log("price", _price);
            _listed = parseInt(hexdata.slice(130+64*6+index*64*9,130+64*7+index*64*9))
            _level = parseInt(hexdata.slice(130+64*8+index*64*9,130+64*9+index*64*9))
            const _uri = await gettokenURI(_id);
            // setNFTData({
            //     "title" : _uri.title,
            //     "description" : _uri.description,
            //     "item_type" : _uri.type,
            //     "img_url" : 'https://ipfs.io/ipfs/'+(_uri.image).slice(7,),
            //     "cat_type" : _uri.attributes[0].value,
            //     "cat_rarity" : _uri.attributes[1].value,
            //     "cat_lives" : _uri.attributes[2].value,
            // })
            var tmp_level = _level == 4 ? "Super Founder": ((_level == 3) ? "Founder" : ( _level == 2 ? "Rare": "Limited Edition"));
            var _img_type = (_uri.image).slice(-3,) == 'png' ? 'image' : 'video';
            var _status = _listed == 0? 'minted' : 'listed';

            var _data = {
                "id": _id,
                "price": _price,
                "listed": _listed == 0? false : true,
                "level": tmp_level,
                "img_url" : 'https://scorpion-finance.mypinata.cloud/ipfs/'+(_uri.image).slice(7,),
                "title" : tmp_level + ' #' + (_id - 1),
                "status" : _status,
                "item_type" : _img_type,
            }
            
            fulldata.push(_data);
        }
        return fulldata;
    }

    useEffect( async () => {
        const { address, status } = await getCurrentWalletConnected();
        setmyWallet(address);
        // console.log('my wallet', address);
        var myNFTs = await fetchMyNFTs(address);
        // console.log('all Data', myNFTs);
        var _allInfo = await getAllInfo(myNFTs);
        setAllNFTs(_allInfo);

        console.log(_allInfo);
        // dispatch(actions.fetchNftsBreakdown());
    }, [dispatch]);

    // const loadMore = () => {
    //     dispatch(actions.fetchNftsBreakdown());
    // }
    
  return (
    <div className='row'>
        <GlobalStyles />
        {/* {
            nfts && nfts.map( (nft, index) => (
            <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} clockTop={false} />)
            )
        } */}
        {
            all_NFTs && all_NFTs.map( (nft, index) => (
                nft.item_type == "image" ?
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

export default memo(ColumnAuction)