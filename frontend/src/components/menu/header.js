import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
//import { header } from 'react-bootstrap';
import { Link } from '@reach/router';
import useOnclickOutside from "react-cool-onclickoutside";
import auth from '../../core/auth';
import { navigate } from '@reach/router';
import {
  connectWallet,
  getCurrentWalletConnected,
} from "../../core/nft/interact";

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = props => (
  <Link 
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active',
      };
    }}
  />
);

const Header = function({ className }) {

    const [openMenu, setOpenMenu] = React.useState(false);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const [openMenu2, setOpenMenu2] = React.useState(false);
    const [openMenu3, setOpenMenu3] = React.useState(false);
    const handleBtnClick = () => {
      setOpenMenu(!openMenu);
    };
    const handleBtnClick1 = () => {
      setOpenMenu1(!openMenu1);
    };
    const handleBtnClick2 = () => {
      setOpenMenu2(!openMenu2);
    };
    const handleBtnClick3 = () => {
      setOpenMenu3(!openMenu3);
    };
    const closeMenu = () => {
      setOpenMenu(false);
    };
    const closeMenu1 = () => {
      setOpenMenu1(false);
    };
    const closeMenu2 = () => {
      setOpenMenu2(false);
    };
    const closeMenu3 = () => {
      setOpenMenu3(false);
    };

    const ref = useOnclickOutside(() => {
      closeMenu();
    });
    const ref1 = useOnclickOutside(() => {
      closeMenu1();
    });
    const ref2 = useOnclickOutside(() => {
      closeMenu2();
    });
    const ref3 = useOnclickOutside(() => {
      closeMenu3();
    });
    

    const [showmenu, btn_icon] = useState(false);
    const [showpop, btn_icon_pop] = useState(false);
    const [shownot, btn_icon_not] = useState(false);
    const closePop = () => {
      btn_icon_pop(false);
    };
    const closeNot = () => {
      btn_icon_not(false);
    };
    const refpop = useOnclickOutside(() => {
      closePop();
    });
    const refpopnot = useOnclickOutside(() => {
      closeNot();
    });

    const handleLogout = () => {
      auth.clearAppStorage();
      navigate('/')
    }

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");

    const beautifyaddr = (addr) => {
      var value, length;
      length = addr.length;
      value = addr.slice(0,5) + '...' + addr.slice(length-3,length);
      return value;
    }

    function addWalletListener() {
      console.log('wallet detect')
      if (window.ethereum) {
        if(window.ethereum.chainId != 0x38){
          setWallet("");
          alert('Please switch network to bsc mainnet')
          return
        }
        window.ethereum.on("accountsChanged", (accounts) => {
          if(window.ethereum.chainId != 0x38){
            setWallet("");
            alert('Please switch network to bsc mainnet')
            return
          }
          if (accounts.length > 0) {
            setWallet(accounts[0]);
            // setStatus("Fill in the text-field above.");
          } else {
            setWallet("");
            setStatus("🦊 Connect to Metamask using the top right button.");
          }
        });
      } else {
        setStatus(
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        );
      }
    }

    const connectWalletPressed = async () => {
      const walletResponse = await connectWallet();
      setStatus(walletResponse.status);
      setWallet(walletResponse.address);
    };
    
    useEffect(() => {
      async function getExistingWallet() {
        const { address, status } = await getCurrentWalletConnected();
    
        setWallet(address);
        setStatus(status);
    
        addWalletListener();
      }
  
      getExistingWallet();
    }, []);

    useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
        btn_icon(false);
        if (window.pageYOffset > sticky) {
          header.classList.add("sticky");
          totop.classList.add("show");
          
        } else {
          header.classList.remove("sticky");
          totop.classList.remove("show");
        } if (window.pageYOffset > sticky) {
          closeMenu();
        }
      });
      return () => {
        window.removeEventListener("scroll", scrollCallBack);
      };
    }, []);
    return (
    <header className={`navbar white ${className}`} id="myHeader">
     <div className='container'>
       <div className='row w-100-nav'>
          <div className='logo px-0'>
              <div className='navbar-title navbar-item'>
                <NavLink to="/">
                <img
                    src="/img/logo.png"
                    className="img-fluid d-block"
                    alt="#"
                  />
                  <img
                    src="/img/logo-2.png"
                    className="img-fluid d-3"
                    alt="#"
                  />
                  <img
                    src="/img/logo-3.png"
                    className="img-fluid d-4"
                    alt="#"
                  />
                  <img
                    src="/img/logo-light.png"
                    className="img-fluid d-none"
                    alt="#"
                  />
                </NavLink>
              </div>
          </div>

          <div className='search'>
            <input id="quick_search" className="xs-hide" name="quick_search" placeholder="search item here..." type="text" />
          </div>
                    
              <BreakpointProvider>
                <Breakpoint l down>
                  {showmenu && 
                  <div className='menu'>
                    <div className='navbar-item'>
                      <NavLink to="/">Home</NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/explore" onClick={() => btn_icon(!showmenu)}>Marketplace</NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/Portfolio" onClick={() => btn_icon(!showmenu)}>Portfolio</NavLink>
                    </div>
                    {/* <div className='navbar-item'>
                      <NavLink to="/ItemMint/1" onClick={() => btn_icon(!showmenu)}>Mint</NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/ItemDetail/1" onClick={() => btn_icon(!showmenu)}>Details</NavLink>
                    </div> */}
                    {/* <div className='navbar-item'>
                      <div ref={ref1}>
                        <div className="dropdown-custom dropdown-toggle btn" 
                          onClick={handleBtnClick1}
                          >
                          Explore
                        </div>*/}
                        {
                        // openMenu1 && (
                        //   <div className='item-dropdown'>
                        //     <div className="dropdown" onClick={closeMenu1}>
                        //       <NavLink to="/explore" onClick={() => btn_icon(!showmenu)}>Explore</NavLink>
                        //       {/* <NavLink to="/colection/1" onClick={() => btn_icon(!showmenu)}>Collection</NavLink> */}
                        //       <NavLink to="/ItemDetail/1" onClick={() => btn_icon(!showmenu)}>Items Details</NavLink>
                        //       <NavLink to="/Portfolio" onClick={() => btn_icon(!showmenu)}>My NFTs</NavLink>
                        //       <NavLink to="/helpcenter" onClick={() => btn_icon(!showmenu)}>Help Center</NavLink>
                        //     </div>
                        //   </div>
                        // )
                        }
                      {/* </div>
                    </div>  */}
                    {/* <div className='navbar-item'>
                      <div ref={ref2}>
                        <div className="dropdown-custom dropdown-toggle btn" 
                          onClick={handleBtnClick2}
                          >
                          Pages
                        </div> */}
                        {/* {openMenu2 && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu2}> */}
                              {/* <NavLink to="/Author/1" onClick={() => btn_icon(!showmenu)}>Author</NavLink> */}
                              {/* <NavLink to="/Profile/1" onClick={() => btn_icon(!showmenu)}>Profile</NavLink> */}
                              {/* <NavLink to="/AuthorGrey/1" onClick={() => btn_icon(!showmenu)}>Author Grey</NavLink> */}
                              {/* <NavLink to="/wallet" onClick={() => btn_icon(!showmenu)}>Wallet</NavLink> */}
                              {/* <NavLink to="/create" onClick={() => btn_icon(!showmenu)}>Create</NavLink> */}
                              {/* <NavLink to="/create2" onClick={() => btn_icon(!showmenu)}>Create 2</NavLink> */}
                              {/* <NavLink to="/createOptions" onClick={() => btn_icon(!showmenu)}>Create options</NavLink> */}
                              {/* <NavLink to="/mint" onClick={() => btn_icon(!showmenu)}>Nft Minting</NavLink> */}
                              {/* <NavLink to="/news" onClick={() => btn_icon(!showmenu)}>News</NavLink> */}
                              {/* <NavLink to="/works" onClick={() => btn_icon(!showmenu)}>Gallery</NavLink> */}
                              {/* <NavLink to="/login" onClick={() => btn_icon(!showmenu)}>login</NavLink> */}
                              {/* <NavLink to="/loginTwo" onClick={() => btn_icon(!showmenu)}>login 2</NavLink> */}
                              {/* <NavLink to="/register" onClick={() => btn_icon(!showmenu)}>Register</NavLink> */}
                              {/* <NavLink to="/contact" onClick={() => btn_icon(!showmenu)}>Contact Us</NavLink> */}
                            {/* </div>
                          </div> 
                        )} */}
                      {/* </div>
                    </div> */}
                    {/* <div className='navbar-item'>
                      <div ref={ref3}>
                        <div className="dropdown-custom dropdown-toggle btn" 
                          onClick={handleBtnClick3}
                          >
                          Element
                        </div>
                        {openMenu3 && (
                          <div className='item-dropdown'>
                            <div className="dropdown" onClick={closeMenu3}>
                              <NavLink to="/elegantIcons" onClick={() => btn_icon(!showmenu)}>Elegant Icon</NavLink>
                              <NavLink to="/etlineIcons" onClick={() => btn_icon(!showmenu)}>Etline Icon</NavLink>
                              <NavLink to="/fontAwesomeIcons" onClick={() => btn_icon(!showmenu)}>Font Awesome Icon</NavLink>
                              <NavLink to="/accordion" onClick={() => btn_icon(!showmenu)}>Accordion</NavLink>
                              <NavLink to="/alerts" onClick={() => btn_icon(!showmenu)}>Alerts</NavLink>
                              <NavLink to="/price" onClick={() => btn_icon(!showmenu)}>Pricing Table</NavLink>
                              <NavLink to="/progressbar" onClick={() => btn_icon(!showmenu)}>Progress bar</NavLink>
                              <NavLink to="/tabs" onClick={() => btn_icon(!showmenu)}>Tabs</NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>
                  }
                </Breakpoint>

                <Breakpoint xl>
                  <div className='menu'>
                    <div className='navbar-item'>
                      <NavLink to="/">Home</NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/explore" onClick={() => btn_icon(!showmenu)}>Marketplace</NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/Portfolio" onClick={() => btn_icon(!showmenu)}>Portfolio</NavLink>
                    </div>
                    {/* <div className='navbar-item'>
                      <NavLink to="/ItemMint/1" onClick={() => btn_icon(!showmenu)}>Mint</NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/ItemDetail/1" onClick={() => btn_icon(!showmenu)}>Details</NavLink>
                    </div> */}
                    {/* <div className='navbar-item'>
                      <div ref={ref1}>
                          <div className="dropdown-custom dropdown-toggle btn" 
                             onMouseEnter={handleBtnClick1} onMouseLeave={closeMenu1}>
                            Explore
                            <span className='lines'></span> */}
                            {
                          //   openMenu1 && (
                          //   <div className='item-dropdown'>
                          //     <div className="dropdown" onClick={closeMenu1}>
                          //     <NavLink to="/explore">Explore</NavLink>
                          //     <NavLink to="/ItemMint/1">Mint</NavLink>
                          //     <NavLink to="/ItemDetail/1">Items Details</NavLink>
                          //     <NavLink to="/Portfolio">My NFTs</NavLink>
                          //     <NavLink to="/helpcenter">Help Center</NavLink>
                          //     </div>
                          //   </div>
                          // )
                          }
                          {/* </div>
                          
                        </div>
                    </div> */}
                    {/* <div className='navbar-item'>
                      <div ref={ref2}>
                          <div className="dropdown-custom dropdown-toggle btn" 
                             onMouseEnter={handleBtnClick2} onMouseLeave={closeMenu2}>
                            Pages
                            <span className='lines'></span> */}
                            {
                            // openMenu2 && (
                            // <div className='item-dropdown'>
                              // <div className="dropdown" onClick={closeMenu2}>
                            //   <NavLink to="/Author/1">Author</NavLink>
                            //   <NavLink to="/Profile/1">Profile</NavLink> 
                            //   <NavLink to="/AuthorGrey/1">Author Grey</NavLink> 
                            //   <NavLink to="/wallet">Wallet</NavLink> 
                            //   <NavLink to="/create">Create</NavLink> 
                            //   <NavLink to="/createGrey">Create Grey</NavLink> 
                            //   <NavLink to="/create2">Create 2</NavLink> 
                            //   <NavLink to="/createOptions">Create Option</NavLink> 
                            //   <NavLink to="/mint">Nft Minting</NavLink> 
                            //   <NavLink to="/news">News</NavLink> 
                            //   <NavLink to="/works">Gallery</NavLink> 
                            //   <NavLink to="/login">login</NavLink> 
                            //   <NavLink to="/loginTwo">login 2</NavLink> 
                            //   <NavLink to="/register">Register</NavLink> 
                            //   <NavLink to="/contact">Contact Us</NavLink> 
                            //   </div> 
                            // </div>) 
                          
                          }
                          {/* </div>
                        </div>
                    </div> */}
                    {/* <div className='navbar-item'>
                      <div ref={ref3}>
                        <div className="dropdown-custom dropdown-toggle btn" 
                            onMouseEnter={handleBtnClick3} onMouseLeave={closeMenu3}>
                          Elements
                          <span className='lines'></span>
                          {openMenu3 && (
                            <div className='item-dropdown'>
                              <div className="dropdown" onClick={closeMenu3}>
                              <NavLink to="/elegantIcons">Elegant Icon</NavLink>
                              <NavLink to="/etlineIcons">Etline Icon</NavLink>
                              <NavLink to="/fontAwesomeIcons">Font Awesome Icon</NavLink>
                              <NavLink to="/accordion">Accordion</NavLink>
                              <NavLink to="/alerts">Alerts</NavLink>
                              <NavLink to="/price">Pricing Table</NavLink>
                              <NavLink to="/progressbar">Progess Bar</NavLink>
                              <NavLink to="/tabs">Tabs</NavLink>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div> */}
                  </div>
                </Breakpoint>
              </BreakpointProvider>

              <div className='mainside'>
                {walletAddress.length === 0 && (
                <div className='connect-wal btn' onClick={connectWalletPressed}>
                  Connect Wallet
                </div>
                )}
                {walletAddress.length > 0 && (
                <div className='connect-wal btn' onClick={connectWalletPressed}>
                  {beautifyaddr(walletAddress)}
                </div>
                )}
                <div className="logout">
                  <div id="de-click-menu-profile" className="de-menu-profile" onClick={() => btn_icon_pop(!showpop)} ref={refpop}>                           
                      <img src="../../img/author_single/author_thumbnail.jpg" alt=""/>
                      {showpop && 
                        <div className="popshow">
                          <div className="d-name">
                              <h4>Monica Lucas</h4>
                              <span className="name" onClick={()=> window.open("", "_self")}>Set display name</span>
                          </div>
                          <div className="d-balance">
                              <h4>Balance</h4>
                              12.858 ETH
                          </div>
                          <div className="d-wallet">
                              <h4>My Wallet</h4>
                              <span id="wallet" className="d-wallet-address">DdzFFzCqrhshMSxb9oW3mRo4MJrQkusV3fGFSTwaiu4wPBqMryA9DYVJCkW9n7twCffG5f5wX2sSkoDXGiZB1HPa7K7f865Kk4LqnrME</span>
                              <button id="btn_copy" title="Copy Text">Copy</button>
                          </div>
                          <div className="d-line"></div>
                          <ul className="de-submenu-profile">
                            <li>
                              <span>
                                <i className="fa fa-user"></i> My profile
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="fa fa-pencil"></i> Edit profile
                              </span>
                            </li>
                            <li onClick={handleLogout}>
                              <span>
                                <i className="fa fa-sign-out"></i> Sign out
                              </span>
                            </li>
                          </ul>
                        </div>
                      }
                  </div>
                </div>
              </div>
                  
      </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>

      </div>     
    </header>
    );
}
export default Header;