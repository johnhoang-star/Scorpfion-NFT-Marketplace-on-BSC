import React, {useState, useEffect} from 'react';
import SliderCarouselSingleRedux from '../components/SliderCarouselSingleRedux';
import FeatureBox from '../components/FeatureBox';
import CarouselCollectionRedux from '../components/CarouselCollectionRedux';
import ColumnNewRedux from '../components/ColumnNewRedux';
import NFTExplorer from '../components/NFTExplorer';
import AuthorListRedux from '../components/AuthorListRedux';
import Footer from '../components/footer';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
//Import contract funtions
import {
  getCurrentWalletConnected,
  Init,
  claim,
  owner,
} from "../../core/nft/interact";
import { init } from 'emailjs-com';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;


//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const Homethree= () => {

  const [walletAddr, setWallet] = useState("");
  const [onwerAddr, setOwner] = useState("");
  const [conState, setStatus] = useState(false);

  // useEffect(async () => {
  //   async function getExistingWallet() {
  //     const { address, status } = await getCurrentWalletConnected();
  
  //     setWallet(address);
  //     setStatus(status);
  //   }
  //   getExistingWallet();

  //   var _owner = await owner();
  //   setOwner(_owner);
  // }, []);
  
  const _Init = async () => {
    await Init();
  }

  const _Claim = async () => {
    await claim(walletAddr);
  }

  return (
  <div className="greyscheme">
    <StyledHeader theme={theme} />
      <section className="jumbotron no-bg" style={{backgroundImage: `url(${'./img/background/7.jpg'})`}}>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-lg-6'>
                <div className="spacer-single"></div>
                <Reveal keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                {/* <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce> */}
                  <h6><span className="text-uppercase color">Scorpion Market</span></h6>
                </Reveal>
                <div className="spacer-10"></div>
                <Reveal keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
                  <h1>Play, Buy , Sell or Collect our rare digital items.</h1>
                </Reveal>
                <Reveal keyframes={fadeInUp} delay={600} duration={600} triggerOnce>
                  <p className="lead">
                  A set of uniquely designed 3-D NFTs. Each of these rare digital assets can be stored or minted while still keeping its original value.
The NFTs can be used as gaming tools on ScorpGames and also players that complete game stages get to earn them. So in reality, the NFTs serve multipurpose functions on the ecosystem
                  </p>
                </Reveal>
                <div className="spacer-10"></div>
                <Reveal keyframes={fadeInUp} delay={800} duration={600} triggerOnce>
                  <span onClick={()=> window.open("/#", "_self")} className="btn-main lead">Explore</span>
                  {
                    // conState === true && (
                    // (
                    //   <>
                    //     <div className="mb-sm-30"></div>
                    //     <span onClick={()=> _Init()} className="btn-main lead" style={{ marginTop: '10px' }}>Init</span>
                    //     <div className="mb-sm-30"></div>
                    //     <span onClick={()=> _Claim()} className="btn-main lead" style={{ marginTop: '10px' }}>Claim</span>
                    //   </>
                    // )
                  }
                  <div className="mb-sm-30"></div>
                </Reveal>
                <div className="spacer-double"></div>
            </div>
             <div className='col-lg-6 px-0'>
               <SliderCarouselSingleRedux/>
             </div>
          </div>
        </div>
      </section>

      <section className='container'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
              <h2 className='style-2'>Recently minted NFTs</h2>
          </div>
        </div>
       <NFTExplorer/>
      </div>
      </section>

      {/* <section className='container no-top'>
        <div className='row'>
          <div className='col-lg-12'>
              <h2 className='style-2'>Hot Collections</h2>
          </div>
        </div>
        <div className='container no-top'>
          <div className='row'>
            <div className='col-lg-12 px-0'>
              <CarouselCollectionRedux/>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className='container no-top'>
        <div className='row'>
          <div className='col-lg-12'>
              <h2 className='style-2'>Top Seller</h2>
          </div>
          <div className='col-lg-12'>
            <AuthorListRedux/>
          </div>
        </div>
      </section> */}

      <section className='container no-top'>
        <div className='row'>
          <div className='col-lg-12'>
              <h2 className='style-2'>Create and sell</h2>
          </div>
        </div>
        <div className='container px-0'>
          <FeatureBox/>
        </div>
      </section>

    <Footer />

  </div>
);
}
export default Homethree;