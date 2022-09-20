import React, { useEffect, useState, useContext } from "react";
import "./home.scss";
import Timeline from "../timeline/timeline";
import FollowSuggestions from "../follow-suggestions/follow-suggestions";
import { getTLTweets } from "../utils/tweet-utils";
import CacheContext from "../contexts/cache";

function Home() {
  const [tweets, setTweets] = useState([]);
  const [trends, setTrends] = useState([]);
  const { setHomeCache } = useContext(CacheContext);

  useEffect(() => {
    let homeCache = JSON.parse(localStorage.getItem("home"));
    if (!homeCache.length) {
      getTLTweets("Home")
        .then((res) => {
          let shuffled = res.tweets
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
          setTweets(shuffled);
          setHomeCache(shuffled);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setTweets(homeCache);
    }
  }, []);
  return (
    <>
      <div id="main">
        <div className="right-sidebar-style">
          <div>
            <Timeline tweets={tweets} />
          </div>
          <div className="right-sidebar">
            <FollowSuggestions />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
