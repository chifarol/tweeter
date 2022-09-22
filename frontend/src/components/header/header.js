import "./header.scss";

import React, { useState, useContext, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import PopUp from "../pop-up/pop-up";
import { HeaderSmallTop, HeaderSmallBottom } from "./header-small";
import UserContext from "../contexts/usercontext";
import Alert from "../alert/alert";
import TimelineContext from "../contexts/timeline-context";
import TweetButton from "../tweet-button/tweet-button";
import TweetBox from "../tweet-box/tweet-box";
function Header(props) {
  const { userProfile } = useContext(UserContext);
  const { openTweetBox, headerActive, setHeaderActive } =
    useContext(TimelineContext);
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/explore") {
      setHeaderActive("Explore");
    } else if (location.pathname === "/bookmarks") {
      setHeaderActive("Bookmarks");
    } else if (location.pathname === "/") {
      setHeaderActive("Home");
    }
  }, []);
  const onClickHandler = (event) => {
    setHeaderActive(event.target.id);
  };

  return (
    <>
      <Alert />
      <HeaderSmallTop />
      <div id="header">
        <div id="header-logo-container">
          <svg
            width="126"
            height="30"
            viewBox="0 0 126 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            id="header-logo"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M36.1752 23.6803L31.1324 14.9459C30.7713 14.3205 29.8686 14.3205 29.5075 14.9459L24.4647 23.6803C24.1036 24.3057 24.555 25.0875 25.2771 25.0875H35.3628C36.0849 25.0875 36.5363 24.3057 36.1752 23.6803ZM35.1947 12.6006C33.0281 8.84799 27.6118 8.84799 25.4452 12.6006L20.4024 21.335C18.2359 25.0875 20.9441 29.7782 25.2771 29.7782H35.3628C39.6958 29.7782 42.404 25.0875 40.2375 21.3349L35.1947 12.6006Z"
              fill="#2F80ED"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26.6734 23.5295L16.5616 6.01525C16.2005 5.38983 15.2978 5.38982 14.9367 6.01525L4.82479 23.5295C4.46371 24.1549 4.91507 24.9367 5.63725 24.9367H25.861C26.5832 24.9367 27.0345 24.1549 26.6734 23.5295ZM20.6238 3.66989C18.4573 -0.0826759 13.0409 -0.082671 10.8744 3.6699L0.76252 21.1842C-1.40403 24.9367 1.30416 29.6274 5.63725 29.6274H25.861C30.1941 29.6274 32.9023 24.9367 30.7357 21.1842L20.6238 3.66989Z"
              fill="#2F80ED"
            />
            <path
              d="M65.3312 10.2143V12.2483H61.9832V22.7783H59.4632V12.2483H56.1152V10.2143H65.3312ZM80.3639 12.8063L77.4479 22.7783H74.7299L72.9119 15.8123L71.0939 22.7783H68.3579L65.4239 12.8063H67.9799L69.7439 20.4023L71.6519 12.8063H74.3159L76.1879 20.3843L77.9519 12.8063H80.3639ZM90.3674 17.5763C90.3674 17.9363 90.3434 18.2603 90.2954 18.5483H83.0054C83.0654 19.2683 83.3174 19.8323 83.7614 20.2403C84.2054 20.6483 84.7514 20.8523 85.3994 20.8523C86.3354 20.8523 87.0014 20.4503 87.3974 19.6463H90.1154C89.8274 20.6063 89.2754 21.3983 88.4594 22.0223C87.6434 22.6343 86.6414 22.9403 85.4534 22.9403C84.4934 22.9403 83.6294 22.7303 82.8614 22.3103C82.1054 21.8783 81.5114 21.2723 81.0794 20.4923C80.6594 19.7123 80.4494 18.8123 80.4494 17.7923C80.4494 16.7603 80.6594 15.8543 81.0794 15.0743C81.4994 14.2943 82.0874 13.6943 82.8434 13.2743C83.5994 12.8543 84.4694 12.6443 85.4534 12.6443C86.4014 12.6443 87.2474 12.8483 87.9914 13.2563C88.7474 13.6643 89.3294 14.2463 89.7374 15.0023C90.1574 15.7463 90.3674 16.6043 90.3674 17.5763ZM87.7574 16.8563C87.7454 16.2083 87.5114 15.6923 87.0554 15.3083C86.5994 14.9123 86.0414 14.7143 85.3814 14.7143C84.7574 14.7143 84.2294 14.9063 83.7974 15.2903C83.3774 15.6623 83.1194 16.1843 83.0234 16.8563H87.7574ZM100.847 17.5763C100.847 17.9363 100.823 18.2603 100.775 18.5483H93.4848C93.5448 19.2683 93.7968 19.8323 94.2408 20.2403C94.6848 20.6483 95.2308 20.8523 95.8788 20.8523C96.8148 20.8523 97.4808 20.4503 97.8768 19.6463H100.595C100.307 20.6063 99.7548 21.3983 98.9388 22.0223C98.1228 22.6343 97.1208 22.9403 95.9328 22.9403C94.9728 22.9403 94.1088 22.7303 93.3408 22.3103C92.5848 21.8783 91.9908 21.2723 91.5588 20.4923C91.1388 19.7123 90.9288 18.8123 90.9288 17.7923C90.9288 16.7603 91.1388 15.8543 91.5588 15.0743C91.9788 14.2943 92.5668 13.6943 93.3228 13.2743C94.0788 12.8543 94.9488 12.6443 95.9328 12.6443C96.8808 12.6443 97.7268 12.8483 98.4708 13.2563C99.2268 13.6643 99.8088 14.2463 100.217 15.0023C100.637 15.7463 100.847 16.6043 100.847 17.5763ZM98.2368 16.8563C98.2248 16.2083 97.9908 15.6923 97.5348 15.3083C97.0788 14.9123 96.5208 14.7143 95.8608 14.7143C95.2368 14.7143 94.7088 14.9063 94.2768 15.2903C93.8568 15.6623 93.5988 16.1843 93.5028 16.8563H98.2368ZM104.99 14.8763V19.7003C104.99 20.0363 105.068 20.2823 105.224 20.4383C105.392 20.5823 105.668 20.6543 106.052 20.6543H107.222V22.7783H105.638C103.514 22.7783 102.452 21.7463 102.452 19.6823V14.8763H101.264V12.8063H102.452V10.3403H104.99V12.8063H107.222V14.8763H104.99ZM117.675 17.5763C117.675 17.9363 117.651 18.2603 117.603 18.5483H110.313C110.373 19.2683 110.625 19.8323 111.069 20.2403C111.513 20.6483 112.059 20.8523 112.707 20.8523C113.643 20.8523 114.309 20.4503 114.705 19.6463H117.423C117.135 20.6063 116.583 21.3983 115.767 22.0223C114.951 22.6343 113.949 22.9403 112.761 22.9403C111.801 22.9403 110.937 22.7303 110.169 22.3103C109.413 21.8783 108.819 21.2723 108.387 20.4923C107.967 19.7123 107.757 18.8123 107.757 17.7923C107.757 16.7603 107.967 15.8543 108.387 15.0743C108.807 14.2943 109.395 13.6943 110.151 13.2743C110.907 12.8543 111.777 12.6443 112.761 12.6443C113.709 12.6443 114.555 12.8483 115.299 13.2563C116.055 13.6643 116.637 14.2463 117.045 15.0023C117.465 15.7463 117.675 16.6043 117.675 17.5763ZM115.065 16.8563C115.053 16.2083 114.819 15.6923 114.363 15.3083C113.907 14.9123 113.349 14.7143 112.689 14.7143C112.065 14.7143 111.537 14.9063 111.105 15.2903C110.685 15.6623 110.427 16.1843 110.331 16.8563H115.065ZM121.404 14.3543C121.728 13.8263 122.148 13.4123 122.664 13.1123C123.192 12.8123 123.792 12.6623 124.464 12.6623V15.3083H123.798C123.006 15.3083 122.406 15.4943 121.998 15.8663C121.602 16.2383 121.404 16.8863 121.404 17.8103V22.7783H118.884V12.8063H121.404V14.3543Z"
              fill="#333333"
            />
          </svg>
        </div>
        <div id="header-tabs">
          <Link
            to="/"
            className={`header-tab ${
              headerActive === "Home" ? "header-tab-active" : ""
            }`}
            id="Home"
            onClick={(e) => onClickHandler(e)}
          >
            Home
          </Link>
          <Link
            to="/explore"
            className={`header-tab ${
              headerActive === "Explore" ? "header-tab-active" : ""
            }`}
            id="Explore"
            onClick={(e) => onClickHandler(e)}
          >
            Explore
          </Link>
          <Link
            to="/bookmarks"
            className={`header-tab ${
              headerActive === "Bookmarks" ? "header-tab-active" : ""
            }`}
            id="Bookmarks"
            onClick={(e) => onClickHandler(e)}
          >
            Bookmarks
          </Link>
        </div>
        <div id="header-profile-container">
          <Link to={`/user/${userProfile.username}`}>
            <img
              src={
                userProfile.profile
                  ? userProfile.profile.profile_pic ||
                    "/static/frontend/images/no_image.png"
                  : "/static/frontend/images/no_image.png"
              }
              id="header-profile-pic"
            />
          </Link>
          <Link id="header-profile-name" to={`/user/${userProfile.username}`}>
            {userProfile.profile
              ? userProfile.profile.display_name || userProfile.username
              : ""}
          </Link>
          <span id="header-profile-expander" onClick={togglePopUp}>
            &#9660;
          </span>
          {showPopUp && <PopUp />}
        </div>
      </div>

      <TweetButton />
      {openTweetBox && <TweetBox />}
      <div id="main-container">
        <Outlet />
        <span className="author-footer f12 gray2 w300">
          Built by ilodigwechinaza@gmail.com
        </span>
      </div>
      <HeaderSmallBottom />
    </>
  );
}

export default Header;
