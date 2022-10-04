import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';
import {
  check_listedAll
} from '../../../core/nft/interact'
import { min } from 'moment';
export const fetchNftsBreakdown = (authorId, isMusic = false) => async (dispatch, getState) => {
  
  //access the state
  const state = getState();
  console.log(state);

  dispatch(actions.getNftBreakdown.request(Canceler.cancel));

  try {
    let filter = authorId ? 'author='+authorId : '';
    let music = isMusic ? 'category=music' : '';

    const { data } = await Axios.get(`${api.baseUrl}${api.nfts}?_limit=-1`, {
    // const { data } = await Axios.get(`${api.baseUrl}${api.nfts}?${filter}&${music}`, {
      cancelToken: Canceler.token,
      params: {}
    });
    // var updatedData = await updateItemStatus(data);

    dispatch(actions.getNftBreakdown.success(data));
  } catch (err) {
    dispatch(actions.getNftBreakdown.failure(err));
  }
};

const updateItemStatus = async (alldata) => {
  var _newdata = [];
  for (let i = 0; i < alldata.length; i++) {
    var element = alldata[i];
    var id = element.id;
    var status = await check_listedAll(id);
    
    var listed = parseInt(status.slice(449,450));
    var minted = parseInt(status.slice(513,514));
    var price = parseInt(status.slice(322,386),16) / 10**18;
    element.status = (minted == 1) ? (listed == 0 ? 'minted' : 'buy_now') : 'not_mint';
    element.price = price;
    _newdata.push(element);
  }
  return _newdata;
}

export const fetchNftShowcase = () => async (dispatch) => {

  dispatch(actions.getNftShowcase.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`${api.baseUrl}${api.nftShowcases}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getNftShowcase.success(data));
  } catch (err) {
    dispatch(actions.getNftShowcase.failure(err));
  }
};

export const fetchNftDetail = (nftId) => async (dispatch) => {

  dispatch(actions.getNftDetail.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`${api.baseUrl}${api.nfts}/${nftId}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getNftDetail.success(data));
  } catch (err) {
    dispatch(actions.getNftDetail.failure(err));
  }
};
