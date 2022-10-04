import React, { memo, useEffect } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { carouselCollectionSingle } from './constants';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../store/selectors';
import { fetchNftShowcase } from "../../store/actions/thunks";
import { navigate } from "@reach/router";
import api from "../../core/api";

const SliderCarouselSingleRedux = () => {

  const dispatch = useDispatch();
  const nftsState = useSelector(selectors.nftShowcaseState);
  const nfts = nftsState.data ? nftsState.data : [];
  
  useEffect(() => {
      dispatch(fetchNftShowcase());
  }, [dispatch]);

  const navigateTo = (link) => {
      navigate(link);
  }

  const demo_data = [
    {"title" : "Blue Dragon", "author": "Lori Hart", "img_url" : "/img/carousel/1.png"},
    {"title" : "Agility Spider", "author": "Elizabeth S. Justus", "img_url" : "/img/carousel/2.webp"},
    {"title" : "Golden Spider", "author": "Marie J. Kurtz", "img_url" : "/img/carousel/3.png"},
    {"title" : "Golden Dragon", "author": "Mary M. Hires", "img_url" : "/img/carousel/4.webp"},
    {"title" : "Utopia Island", "author": "Shannon C. Perez", "img_url" : "/img/carousel/5.webp"}
  ]

  return (
      <div className='nft-big'>
        <Slider {...carouselCollectionSingle}>
          {demo_data && demo_data.map( (nft, index) => (
          // {nfts && nfts.map( (nft, index) => (
            <div className='itm' index={index+1} key={index}>
            {/* <div onClick={() => navigateTo('/ItemDetail/' + nft?.id)} className='itm' index={index+1} key={index}> */}
              <div className="nft_pic">                            
                  <span>
                      <span className="nft_pic_info">
                          <span className="nft_pic_title">{nft?.title}</span>
                          <span className="nft_pic_by">{nft?.author}</span>
                          {/* <span className="nft_pic_by">{nft?.author?.username}</span> */}
                      </span>
                  </span>
                  <div className="nft_pic_wrap">
                    { 
                      // nft.img_url == null ?
                      // <img src={api.baseUrl + nft?.preview_image?.url} className="lazy img-fluid" alt=""/>
                      // :
                      <img src={nft.img_url} className="lazy img-fluid" alt=""/>
                    }
                  </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
  );
}

export default memo(SliderCarouselSingleRedux);
