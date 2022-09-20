import React, { useState, useEffect, useContext } from "react";
import "./explore.scss";
import SidebarCard from "../sidebar-card/sidebar-card";
import Trending from "../trending/trending-card";
import Timeline from "../timeline/timeline";
import SearchBox from "../search/search";
import { searchTweets } from "../utils/tweet-utils";
import TimelineContext from "../contexts/timeline-context";
import CacheContext from "../contexts/cache";
import { getTrends } from "../utils/tweet-utils";

function Explore() {
  // tweets array state
  const [tweets, setTweets] = useState([]);
  const [trends, setTrends] = useState([]);
  // if fetch result is empty
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  // get 'search' timeline contexts for
  const { searchContext, searchTypeContext } = useContext(TimelineContext);
  // get explore page cache context
  const { setExploreCache, setTrendCache } = useContext(CacheContext);

  useEffect(() => {
    let trendsCache = JSON.parse(localStorage.getItem("trends"));
    if (!trendsCache.length) {
      getTrends()
        .then((res) => {
          setTrends(res.trends);
          setTrendCache(res.trends);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setTrends(trendsCache);
    }
  }, []);

  // run whenever $searchContext, $searchTypeContext changes
  useEffect(() => {
    // reset isEmpty state
    setIsEmptyResult(false);
    // get 'explore' localstorage array
    let exploreCache = JSON.parse(localStorage.getItem("explore"));
    // if searchTerm exists
    if (
      exploreCache.some(
        (e) => e.searchTerm.toLowerCase() === searchContext.toLowerCase()
      )
    ) {
      // get index of corresponding searchTerm object
      let index = exploreCache.findIndex(
        (e) => e.searchTerm.toLowerCase() === searchContext.toLowerCase()
      );
      // get lowercase version of $searchTypeContext
      let lowerCaseTypeContext = searchTypeContext.toLowerCase();
      // if e.g exploreCache[index]['top'].length is not an empty array
      if (
        exploreCache[index][lowerCaseTypeContext] &&
        exploreCache[index][lowerCaseTypeContext].length
      ) {
        // update tweets array state
        setTweets(exploreCache[index][lowerCaseTypeContext]);
      }

      // if e.g exploreCache[index]['top'].length is an empty array
      else {
        // reset tweets array state
        setTweets([]);
        // fetch new tweets
        fetchTweets();
      }
    }
    // if searchTerm does not exists already
    else {
      // reset tweets array state
      setTweets([]);
      // fetch new tweets
      fetchTweets();
    }
    /**
     * API wrapper to fetch tweets for search result
     */
    function fetchTweets() {
      // if search term is not empty
      if (searchContext.length) {
        // search tweets api
        searchTweets(searchContext, searchTypeContext)
          .then((res) => {
            let result = res.tweets;
            if (result.length === 0) {
              setIsEmptyResult(true);
              return;
            } else {
              setTweets(result);
            }
            if (
              searchTypeContext === "Media" ||
              searchTypeContext === "People"
            ) {
              result = result
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            }
            // update explore cache type
            if (searchTypeContext.toLowerCase() !== "latest") {
              setExploreCache(searchContext, {
                type: searchTypeContext,
                list: result,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [searchContext, searchTypeContext]);
  const sidebarItems = ["Top", "Latest", "People", "Media"];
  return (
    <>
      <div id="main">
        <div className="left-sidebar-style">
          <div>
            <Trending trends={trends} />
            <SidebarCard sidebarItems={sidebarItems} context="explore" />
          </div>
          <div>
            <SearchBox />

            {tweets.length || searchContext ? (
              isEmptyResult ? (
                <span className="w300 empty">No results found</span>
              ) : (
                <Timeline tweets={tweets} />
              )
            ) : (
              <span className="w300 empty">Please enter a search term</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Explore;
