import React from 'react';
import { Router, Location, Redirect } from '@reach/router';
import ScrollToTopBtn from './menu/ScrollToTop';
import Header from './menu/header';
import Home1grey from './pages/home1Grey';
import Exploregrey from './pages/exploreGrey';
// import Rangking from './pages/rangking';
import Auctiongrey from './pages/AuctionGrey';
import Portfolio from './pages/Portfolio';
import Helpcentergrey from './pages/helpcenterGrey';
import Colectiongrey from './pages/colectionGrey';
// import ItemDetail from './pages/ItemDetail';
import ItemDetailReduxgrey from './pages/ItemDetailReduxGrey';
import ItemMintReduxGrey from './pages/ItemMintReduxGrey';
import Author from './pages/Author';
import AuthorGrey from './pages/AuthorGrey';
import AuthorOpensea from './pages/Opensea/author';
import Wallet from './pages/wallet';
import WalletGrey from './pages/walletGrey';
import Login from './pages/login';
import Logingrey from './pages/loginGrey';
import LoginTwo from './pages/loginTwo';
import LoginTwogrey from './pages/loginTwoGrey';
import Register from './pages/register';
import Registergrey from './pages/registerGrey';
import Price from './pages/price';
import Works from './pages/works';
import News from './pages/news';
import NewsSingle from './pages/newsSingle';
import Create from './pages/create';
import Creategrey from './pages/createGrey';
import Create2 from './pages/create2';
import Create3 from './pages/create3';
import Createoption from './pages/createOptions';
import Activity from './pages/activity';
import Activitygrey from './pages/activityGrey';
import Contact from './pages/contact';
import Contactgrey from './pages/contactGrey';
import ElegantIcons from './pages/elegantIcons';
import EtlineIcons from './pages/etlineIcons';
import FontAwesomeIcons from './pages/fontAwesomeIcons';
import Accordion from './pages/accordion';
import Alerts from './pages/alerts';
import Progressbar from './pages/progressbar';
import Tabs from './pages/tabs';
import Minter from './pages/Minter';
import Mintergrey from './pages/MinterGrey';
import auth from '../core/auth';
import Profile from './pages/Profile';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0,0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuth = auth.getToken() !== null;
  
  return (
      isAuth ? <Component {...rest} /> : <Redirect from="" to="/login" noThrow />
  )
};

const app= () => (
  <div className="wraper">
  <GlobalStyles />
    <Header/>
      <PosedRouter>
      <ScrollTop path="/">
        <Home1grey exact path="/">
          <Redirect to="/home" />
        </Home1grey>
        <Exploregrey path="/explore" />
        <Portfolio path="/Portfolio" />
        <Helpcentergrey path="/helpcenter" />
        <Colectiongrey path="/colection/:collectionId" />
        <ItemDetailReduxgrey path="/ItemDetail/:nftId" />
        <ItemMintReduxGrey path="/ItemMint/:nftId" />
        {/* 
          PROTECTED ROUTE :
          you can use this to protect your route, user must login first to access
         */}
        <ProtectedRoute component={Author} path="/Author/:authorId"/>
        <ProtectedRoute component={Profile} path="/Profile/:authorId"/>
        {/* 
        <Author path="/Author/:authorId" /> 
        */}
        <AuthorGrey path="/AuthorGrey/:authorId" />
        <WalletGrey path="/wallet" />
        <Login path="/login" />
        <Logingrey path="/loginGrey" />
        <LoginTwo path="/loginTwo" />
        <LoginTwogrey path="/loginTwoGrey" />
        <Register path="/register" />
        <Registergrey path="/registerGrey" />
        <Price path="/price" />
        <Works path="/works" />
        <News path="/news" />
        <NewsSingle path="/news/:postId" />
        <Create path="/create" />
        <Creategrey path="/createGrey" />
        <Create2 path="/create2" />
        <Create3 path="/create3" />
        <Createoption path="/createOptions" />
        <Activity path="/activity" />
        <Activitygrey path="/activityGrey" />
        <Contact path="/contact" />
        <Contactgrey path="/contactGrey" />
        <ElegantIcons path="/elegantIcons" />
        <EtlineIcons path="/etlineIcons" />
        <FontAwesomeIcons path="/fontAwesomeIcons" />
        <Accordion path="/accordion" />
        <Alerts path="/alerts" />
        <Progressbar path="/progressbar" />
        <Tabs path="/tabs" />
        <Mintergrey path="/mint" />
        </ScrollTop>
      </PosedRouter>
    <ScrollToTopBtn />
  </div>
);
export default app;