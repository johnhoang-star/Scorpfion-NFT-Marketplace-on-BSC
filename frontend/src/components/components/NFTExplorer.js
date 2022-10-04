import React, { memo, useEffect, useState } from 'react';
import NftImgCard from './NftImgCard';
import NftVideoCard from './NftVideoCard';
import axios from "axios";
import { TokenStandardVersion } from 'opensea-js/lib/types';
import price from '../pages/price';
import Select from 'react-select';
import { categories, status, itemsType } from './constants/filters';

//react functional component
const NFTExplorer = ({ filter }) => {
    const [nfts,setnfts] = useState(null);
    const [height, setHeight] = useState(0);
    const [curPage, setcurPage] = useState(1);
    const OnePage = 8;
    const [loaded, setLoaded] = useState(false);
    const [allloaded, setallloaded] = useState(false);

    const [ft_name, setft_name] = useState('')
    const [ft_level, setft_level] = useState(0)
    const [ft_status, setft_status] = useState('')
    const [ft_type, setft_type] = useState('')

    const defaultValue = {
        value: null,
        label: 'Select Filter'
    };
    
    const customStyles = {
        option: (base, state) => ({
            ...base,
            background: "#fff",
            color: "#333",
            borderRadius: state.isFocused ? "0" : 0,
            "&:hover": {
                background: "#eee",
            }
        }),
        menu: base => ({
            ...base,
            borderRadius: 0,
            marginTop: 0
        }),
        menuList: base => ({
            ...base,
            padding: 0
        }),
        control: (base, state) => ({
            ...base,
            padding: 2
        })
    };

    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
        setLoaded(true)
    }
    
    //will run when component unmounted
    useEffect( async () => {
        let data = await getNFTdata(0,OnePage, ft_name, ft_level, ft_status, ft_type);
        setnfts(data);
    },[ft_name, ft_level, ft_status, ft_type]);

    const getNFTdata = async (_skip = 0, _limit = OnePage, _name='', _level=0, _status='', _type='') => {
        let query = {
            query: `{ nftitems(orderBy: tokenId, skip:${_skip} , first: ${_limit}, 
                where:{${_name ? 'id:'+_name: ''}  ${_level==0 ? '': 'level:'+_level}  ${_status ? 'status:"'+_status+'"' : ''} 
                ${_type ? 'type:"'+_type+'"': ''} }) 
                { id tokenId BaseUrl ImgUrl level price type status}}`
        }
        let result = await axios.post('https://api.thegraph.com/subgraphs/name/goldenstar111/marketplace',query)
        
        return result?.data?.data?.nftitems
    }

    const loadMore = async () => {
        let data = await getNFTdata(nfts.length, OnePage, ft_name, ft_level, ft_status, ft_type)
        let newdata = nfts.concat(data)
        setnfts(newdata);
        if(newdata.length >= 373){
            setallloaded(true);
        }
    }
    
    const namefilter = async (value) => {
        console.log('name', value);
        setft_name(value);
    }
    
    const levelfilter = async (value) => {
        console.log('level', value);
        setft_level(value.value ? value.value: '');
    }
    
    const statusfilter = async (value) => {
        console.log('status', value);
        setft_status(value.value ? value.value: '')
    }
    
    const typefilter = async (value) => {
        console.log('type', value);
        setft_type(value.value ? value.value: '');
    }

    return (
        <div>
            {
                filter && 
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className="items_filter">
                            <form className="row form-dark" id="form_quick_search" name="form_quick_search">
                                <div className="col">
                                    <input 
                                        className="form-control" 
                                        id="name_1" 
                                        name="name_1" 
                                        placeholder="search item id here..." 
                                        type="text"
                                        onChange={(ev) => namefilter(ev.target.value)}
                                    /> 
                                    <button id="btn-submit">
                                        <i className="fa fa-search bg-color-secondary"></i>
                                    </button>
                                    <div className="clearfix"></div>
                                </div>
                            </form>
                            <div className='dropdownSelect one'>
                                <Select 
                                    styles={customStyles} 
                                    menuContainerStyle={{'zIndex': 999}}
                                    options={[defaultValue, ...categories]}
                                    onChange={(ev) => levelfilter(ev)}
                                />
                            </div>
                            <div className='dropdownSelect two'>
                                <Select 
                                    styles={customStyles} 
                                    options={[defaultValue,...status]}
                                    onChange={(ev) => statusfilter(ev)}
                                />
                            </div>
                            <div className='dropdownSelect three'>
                                <Select 
                                    styles={customStyles}
                                    options={[defaultValue, ...itemsType]}
                                    onChange={(ev) => typefilter(ev)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className='row' style={{ padding: '20px' }}>NFTs : {nfts?.length} / 373</div>
            <div className='row'>
                { nfts?.map( (nft, index) => (
                    nft.ImgUrl == null ?
                    <></>
                    : (
                        nft.type == "image" ?
                        <NftImgCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} loaded={loaded}/>
                        :
                        <NftVideoCard nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
                    )
                ))}
                {
                    !allloaded &&
                    <div className='col-lg-12'>
                        <div className="spacer-single"></div>
                        <span onClick={() => loadMore()} className="btn-main lead m-auto">Load More</span>
                    </div>
                }
            </div>
        </div>              
    );
};

export default memo(NFTExplorer);