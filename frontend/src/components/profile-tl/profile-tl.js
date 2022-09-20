import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarCard from "../sidebar-card/sidebar-card";
import Timeline from "../timeline/timeline";
import FollowModal from "../modal/follow-modal";
import UserContext from "../contexts/usercontext";
import "./profile-tl.scss";
import axios from "axios";
import {
  getTargetUserProfile,
  followUtil,
  getTargetUserTweets,
} from "../utils/profile-utils";
import { Spinner } from "../loading-spinner/spinner";
import AlertContext from "../contexts/alert";
import TimelineContext from "../contexts/timeline-context";
import ImageModal from "../modal/image-modal";
import CacheContext from "../contexts/cache";

function ProfileTL() {
  const navigate = useNavigate();
  const { usernameRoute } = useParams();
  const { alert, setAlert } = useContext(AlertContext);
  const { pTLContext } = useContext(TimelineContext);
  const { setUsersCache } = useContext(CacheContext);
  const [modal, showModal] = useState(false);
  const [username, setUsername] = useState("");
  const [isEmptyRes, setIsEmptyRes] = useState(false);
  const [display_name, setDisplay_name] = useState("");
  const [bio, setBio] = useState("");
  const [headerPic, setHeaderPic] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [tweets, setTweets] = useState([]);
  const { userLocal } = useContext(UserContext);
  const [isCurrentUser, setIsCurrentUser] = useState(
    userLocal.username !== usernameRoute
  );
  const [theProfile, setTheProfile] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [openProfilePic, setOpenProfilePic] = useState(false);
  const [openHeaderPic, setOpenHeaderPic] = useState(false);

  useEffect(() => {
    setTweets([]);
    setIsEmptyRes(false);
    let usersCache = JSON.parse(localStorage.getItem("users"));
    if (usersCache.some((e) => e.username === usernameRoute)) {
      let index = usersCache.findIndex((e) => e.username === usernameRoute);
      let lowerPLContext = pTLContext.toLowerCase();
      if (usersCache[index][lowerPLContext].length) {
        setTweets(usersCache[index][lowerPLContext]);
      } else {
        setTweets([]);
        fetchUserTweets();
      }
    } else {
      setTweets([]);
      fetchUserTweets();
    }
    function fetchUserTweets() {
      getTargetUserTweets(usernameRoute, pTLContext)
        .then((res) => {
          let result = res.tweets;
          if (result.length === 0) {
            setIsEmptyRes(true);
          }
          setTweets(result);
          setUsersCache(usernameRoute, { type: pTLContext, list: result });
        })
        .catch((err) => {
          console.log(err);
          if (window.location.href.includes("user")) {
            navigate("/404");
          }
        });
    }
  }, [pTLContext]);

  useEffect(() => {
    let usersCache = JSON.parse(localStorage.getItem("users"));
    if (usersCache.some((e) => e.username === usernameRoute)) {
      let index = usersCache.findIndex((e) => e.username === usernameRoute);
      if (usersCache[index]["profile"]) {
        setTheProfile(usersCache[index]["profile"]);
      } else {
        fetchUserProfile();
      }
    } else {
      fetchUserProfile();
    }
    function fetchUserProfile() {
      getTargetUserProfile(usernameRoute, pTLContext)
        .then((res) => {
          setTheProfile(res);
          setUsersCache(usernameRoute, {
            type: "Profile",
            list: res,
          });
        })
        .catch((err) => {
          console.log(err);
          if (window.location.href.includes("user")) {
            navigate("/404");
          }
        });
    }
  }, []);

  useEffect(() => {
    if (theProfile.profile) {
      setUsername(theProfile.username);
      setDisplay_name(theProfile.profile.display_name);
      setProfilePic(theProfile.profile.profile_pic);
      setHeaderPic(theProfile.profile.header_pic);
      setBio(theProfile.profile.bio);
      setFollowing(theProfile.following);
      setFollowers(theProfile.followers);
      theProfile.followers.some((e) => userLocal.username == e.username)
        ? setIsFollowing(true)
        : setIsFollowing(false);
    }
  }, [theProfile]);

  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState([]);
  const [modalType, setModalType] = useState("");
  const toggleModal = (title, list, type) => {
    showModal(!modal);
    setModalTitle(title);
    setModalList(list);
    setModalType(type);
  };

  const [followLoading, setFollowLoading] = useState(false);

  const followHandler = () => {
    setFollowLoading(true);
    followUtil(theProfile.username)
      .then((res) => {
        res.status === "followed"
          ? setIsFollowing(true)
          : setIsFollowing(false);
        setFollowLoading(false);
      })
      .catch((err) => {
        setFollowLoading(false);
        setAlert({
          ...alert,
          text: "Something went wrong",
          type: "error",
          active: true,
        });
        console.log(err);
      });
  };
  const toggleHeaderPic = () => {
    setOpenHeaderPic(!openHeaderPic);
  };
  const toggleProfilePic = () => {
    setOpenProfilePic(!openProfilePic);
  };
  return (
    <div className="profile-wrapper">
      {openProfilePic && profilePic && (
        <ImageModal
          list={[{ url: profilePic }]}
          toggleCarousel={toggleProfilePic}
        />
      )}
      {openHeaderPic && headerPic && (
        <ImageModal
          list={[{ url: headerPic }]}
          toggleCarousel={toggleHeaderPic}
        />
      )}
      {modal && (
        <FollowModal
          toggleModal={toggleModal}
          title={modalTitle}
          list={modalList}
          type={modalType}
        />
      )}
      <div className="profile-header">
        <div className="profile-header-pic-container">
          <img
            src={
              headerPic
                ? headerPic
                : "/static/frontend/images/add-person-solid.svg"
            }
            onClick={toggleHeaderPic}
            className="profile-header-pic"
          />
        </div>

        <div className="profile-proper">
          <div className="profile-proper-left">
            <img
              src={
                profilePic ? profilePic : "/static/frontend/images/no_image.png"
              }
              onClick={toggleProfilePic}
            />
          </div>
          <div className="profile-proper-right">
            <div className="profile-proper-right-info">
              <h3>{display_name}</h3>

              {isCurrentUser && (
                <button
                  onClick={followHandler}
                  className={`profile-proper-follow-button-big ${
                    isFollowing && "outline-b"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                  {followLoading && <Spinner />}
                </button>
              )}
            </div>
            <div className="profile-proper-right-metrics">
              <span
                onClick={() => toggleModal(`Following`, following, "profile")}
              >
                <b>{following.length}</b> Following
              </span>
              <span
                onClick={() => toggleModal(`Followers`, followers, "profile")}
              >
                <b>{followers.length}</b> Follower
                {followers.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="profile-proper-right-bio">
              <span>{bio}</span>
            </div>
            {isCurrentUser && (
              <button
                onClick={followHandler}
                className={`profile-proper-follow-button-small ${
                  isFollowing && "outline-b"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
                {followLoading && <Spinner />}
              </button>
            )}
          </div>
        </div>
      </div>
      <div id="main">
        <div className="left-sidebar-style mobile-mt40">
          <SidebarCard
            sidebarItems={["Tweets", "Tweets & Replies", "Media", "Likes"]}
            context="profileTL"
          />
          {!isEmptyRes ? (
            <Timeline tweets={tweets} />
          ) : (
            <span className="w300 empty"> Nothing to see here</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileTL;
