import React, { useState, useEffect, useContext } from "react";
import "./bookmark.scss";
import SidebarCard from "../sidebar-card/sidebar-card";
import Timeline from "../timeline/timeline";
import { getTLTweets } from "../utils/tweet-utils";
import CacheContext from "../contexts/cache";

function Bookmark() {
  const [tweets, setTweets] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const { setBookmarkCache } = useContext(CacheContext);
  useEffect(() => {
    let bookmarkCache = JSON.parse(localStorage.getItem("bookmarks"));
    if (!bookmarkCache.length) {
      getTLTweets("Bookmarks")
        .then((res) => {
          setTweets(res.tweets);
          setBookmarkCache(res.tweets);
          if (res.tweets.length === 0) {
            setIsEmpty(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setTweets(bookmarkCache);
    }
  }, []);
  return (
    <>
      <div id="main">
        <div className="left-sidebar-style">
          <div></div>
          <div>
            {!isEmpty ? (
              <Timeline tweets={tweets} />
            ) : (
              <span className="w300 empty">No results found</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bookmark;
