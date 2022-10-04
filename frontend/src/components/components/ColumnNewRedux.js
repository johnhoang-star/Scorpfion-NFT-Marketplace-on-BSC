import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../store/selectors';
import * as actions from '../../store/actions/thunks';
import { clearNfts, clearFilter } from '../../store/actions';
import NftCard from './NftCard';
import NftMusicCard from './NftMusicCard';
import NftImgCard from './NftImgCard';
import NftVideoCard from './NftVideoCard';
import { shuffleArray } from '../../store/utils';

//react functional component
const ColumnNewRedux = ({ showLoadMore = true, shuffle = false, authorId = null }) => {

    const dispatch = useDispatch();
    const nftItems = useSelector(selectors.nftItems);
    const nfts = nftItems ? shuffle ? shuffleArray(nftItems) : nftItems : [];
    const [height, setHeight] = useState(0);
    const [curPage, setcurPage] = useState(1);
    const OnePage = 8;

    const [loaded, setLoaded] = useState(false);

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
        setLoaded(true)
    }
    
    useEffect(() => {
        dispatch(actions.fetchNftsBreakdown(authorId));
        setcurPage(1)
    }, [dispatch, authorId]);

    //will run when component unmounted
    useEffect(() => {
        return () => {
            dispatch(clearFilter());
            dispatch(clearNfts());
        }
    },[dispatch]);

    const loadMore = () => {
        // dispatch(actions.fetchNftsBreakdown(authorId));
        var allpage;
        if(OnePage * curPage < nfts.length){
            allpage = curPage + 1;
            setcurPage(allpage);
        }
    }

    return (
        <div>
            <div className='row' style={{ padding: '20px' }}>NFTs : {OnePage*curPage < nfts.length ? OnePage*curPage : nfts.length } / {nfts.length}</div>
            <div className='row'>
                {nfts && nfts.map( (nft, index) => (
                    index < OnePage * curPage ? 
                    (
                        nft.img_url == null ?
                        // <NftCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
                        <></>
                        : (
                            nft.item_type == "image" ?
                            <NftImgCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} loaded={loaded}/>
                            :
                            <NftVideoCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
                        )
                    ) 
                    :
                    <></>
                ))}
                { showLoadMore && 
                // { showLoadMore && nfts.length <= 20 &&
                    <div className='col-lg-12'>
                        <div className="spacer-single"></div>
                        <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                    </div>
                }
            </div>
        </div>              
    );
};

export default memo(ColumnNewRedux);