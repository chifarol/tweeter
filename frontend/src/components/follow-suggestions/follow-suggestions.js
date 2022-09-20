import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { followSuggestions } from "../utils/tweet-utils";
import { Spinner } from "../loading-spinner/spinner";
import "./follow-suggestions.scss";
import { followUtil } from "../utils/profile-utils";
import CacheContext from "../contexts/cache";

function FollowItem({ user, setFollowSugCache }) {
  const [followLoading, setFollowLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const followHandler = (e) => {
    setFollowLoading(true);
    followUtil(user.username)
      .then((res) => {
        setFollowLoading(false);
        // activate hide state
        setHide(true);
        let followSugCache = JSON.parse(
          localStorage.getItem("follow-suggestions")
        );
        // new array without the user who got followed
        let newSug = followSugCache.filter((e) => e.username !== user.username);
        // update follow-suggestions cache
        setFollowSugCache(newSug);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={`sidebar-followsug-item ${hide && "hide"}`}>
      <div className="sidebar-followsug-profile-container">
        <div className="sidebar-followsug-profile">
          <Link to={`user/${user.username}`}>
            <img
              src={
                user.profile.profile_pic ||
                "/static/frontend/images/no_image.png"
              }
            />
          </Link>
          <div>
            <h3>
              <Link to={`user/${user.username}`}>
                {user.profile.display_name || user.username}
              </Link>
            </h3>
            <span className="gray3 f12 w500">
              {user.profile.followers.length} followers
            </span>
          </div>
          <button
            className="sidebar-followsug-follow-btn"
            onClick={followHandler}
          >
            {followLoading && <Spinner />}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
            >
              <g fill="#fff">
                <path d="M36.5 28v-6.5H30v-3h6.5V12h3v6.5H46v3h-6.5V28ZM18 23.95q-3.3 0-5.4-2.1-2.1-2.1-2.1-5.4 0-3.3 2.1-5.4 2.1-2.1 5.4-2.1 3.3 0 5.4 2.1 2.1 2.1 2.1 5.4 0 3.3-2.1 5.4-2.1 2.1-5.4 2.1ZM2 40v-4.7q0-1.75.9-3.175Q3.8 30.7 5.4 30q3.75-1.65 6.675-2.325Q15 27 18 27t5.925.675Q26.85 28.35 30.55 30q1.6.75 2.525 2.15.925 1.4.925 3.15V40Z" />
              </g>
            </svg>
            <span>Follow</span>
          </button>
        </div>
        <div className="sidebar-followsug-bio gray3">{user.profile.bio}</div>
        <div className="sidebar-followsug-header-pic">
          <img
            src={
              user.profile.header_pic || "/static/frontend/images/no_image.png"
            }
          />
        </div>
      </div>
    </div>
  );
}

function FollowSuggestions() {
  const [followSug, setFollowSug] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  // get follow-suggestions cache setter
  const { setFollowSugCache } = useContext(CacheContext);
  useEffect(() => {
    let followSugCache = JSON.parse(localStorage.getItem("follow-suggestions"));
    // if followSugCache array is empty
    if (!followSugCache.length) {
      followSuggestions()
        .then((res) => {
          if (!res.suggestions.length) {
            setIsEmpty(true);
          }
          setFollowSug(res.suggestions);
          setFollowSugCache(res.suggestions);
        })
        .catch((err) => console.log(err));
    } else {
      setFollowSug(followSugCache);
    }
  }, []);

  return (
    <>
      {!isEmpty && (
        <div className="sidebar-followsug-container gray3 f14">
          <p className="sidebar-followsug-title f12 gray1">Who to follow</p>
          {!followSug.length ? (
            <div className="sidebar-followsug-spinner">
              <Spinner />
            </div>
          ) : (
            followSug.map((user) => (
              <FollowItem
                user={user}
                key={user.id}
                setFollowSugCache={setFollowSugCache}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}

export default FollowSuggestions;
