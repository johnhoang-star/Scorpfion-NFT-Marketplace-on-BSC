import React from 'react';
import NFTExplorer from '../components/NFTExplorer';
import ColumnNewRedux from '../components/ColumnNewRedux';
import Footer from '../components/footer';
//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const explore= () => (
<div className="greyscheme">
<StyledHeader theme={theme} />
  <section className='jumbotron breadcumb no-bg'>
    <div className='mainbreadcumb'>
      <div className='container'>
        <div className='row m-10-hor'>
          <div className='col-12'>
            <h1 className='text-center'>Explore</h1>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className='container'>
    <NFTExplorer filter={true}/>
  </section>


  <Footer />
</div>

);
export default explore;