import React, { memo } from 'react';
import styled from "styled-components";
import Clock from "./Clock";
import { navigate } from '@reach/router';
import api from '../../core/api';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

//react functional component
const NftVideoCard = ({ nft, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', clockTop = true, height, onImgLoad, key }) => {

    const navigateTo = (link) => {
        navigate(link);
    }

    const getname = (level, id) => {
        let _name;
        switch (level) {
            case 1:
                _name = 'Limited Edition #'
                break;
            case 2:
                _name = 'Rare #'
                break;
            case 3:
                _name = 'Founder #'
                break;
            default:
                _name = 'Super Founder #'
                break;
        }
        _name = _name + id
        return _name;
    }

    const prettyBalance = (price) => {
        let _price = parseInt(price);
        _price = _price/1e18;
        return _price;
    }
    
    return (
        <div className={className}>
            <div className="nft__item m-0">
                <div className='icontype'><i className="fa fa-shopping-basket"></i></div>
                <div className="author_list_pp">
                    <span>                                    
                        <img className="lazy" src="/img/avatar.png" alt=""/>
                        <i className="fa fa-check"></i>
                    </span>
                </div>
                <div className="nft__item_wrap" style={{height: `${height}px`, minHeight: '120px'}}>
                <Outer>
                    <span>
                    <video className="lazy nft__item_preview nft__video_preview" controls>
                    {/* <video className="lazy nft__item_preview nft__video_preview" controls autoPlay loop> */}
                        <source src={nft.ImgUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </span>
                </Outer>
                </div>
                <div className="nft__item_info">
                    <span>
                        <h4>{getname(nft.level, nft.id)}</h4>
                    </span>
                    <div className="nft__item_price">
                        {prettyBalance(nft.price)} BNB
                        {/* { nft.status === 'on_auction' && 
                            <span>{nft.bid}/{nft.max_bid}</span>
                        } */}
                    </div>
                    <div className="nft__item_action">
                        <span onClick={() => navigateTo(`/${nft.status === 'notmint' ? 'ItemMint' : 'ItemDetail'}/${nft.id}`)}>
                            { nft.status === 'notmint' ? 'Mint Now' : (nft.status === 'notlisted' ? 'View Item' : 'Buy Now') }
                        </span>
                    </div>
                    <div className="nft__item_like">
                        <i className="fa fa-heart"></i><span>{/*nft.likes*/}</span>
                    </div>                            
                </div> 
            </div>
        </div>             
    );
};

export default memo(NftVideoCard);