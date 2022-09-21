import React, { createContext, useState, useEffect } from "react";

// initialize cache
export const CacheContext = createContext();
export function clearCache() {
  localStorage.setItem("trends", JSON.stringify([]));
  localStorage.setItem("follow-suggestions", JSON.stringify([]));
  localStorage.setItem("home", JSON.stringify([]));
  localStorage.setItem("explore", JSON.stringify([]));
  localStorage.setItem("bookmarks", JSON.stringify([]));
  localStorage.setItem("users", JSON.stringify([]));
}

/**
 * Provides cache context to components.
 */
export const CacheContextProvider = ({ children }) => {
  // get trends cache from localstorage
  let trendsCache = JSON.parse(localStorage.getItem("trends"));
  // get follow suggestions cache from localstorage
  let followSugCache = JSON.parse(localStorage.getItem("follow-suggestions"));
  // get home cache from localstorage
  let homeCache = JSON.parse(localStorage.getItem("home"));
  // get bookmarks cache from localstorage
  let bookmarkCache = JSON.parse(localStorage.getItem("bookmarks"));
  // get explore cache from localstorage
  let exploreCache = JSON.parse(localStorage.getItem("explore"));
  // get users cache from localstorage
  let usersCache = JSON.parse(localStorage.getItem("users"));

  // initialize trends cache if not existing
  if (!trendsCache) {
    localStorage.setItem("trends", JSON.stringify([]));
  }
  // initialize follow suggestions cache if not existing
  if (!followSugCache) {
    localStorage.setItem("follow-suggestions", JSON.stringify([]));
  }
  // initialize home cache if not existing
  if (!homeCache) {
    localStorage.setItem("home", JSON.stringify([]));
  }
  // initialize bookmarks cache if not existing
  if (!bookmarkCache) {
    localStorage.setItem("bookmarks", JSON.stringify([]));
  }
  // initialize explore cache if not existing
  if (!exploreCache) {
    localStorage.setItem("explore", JSON.stringify([]));
  }
  // initialize users cache if not existing
  if (!usersCache) {
    localStorage.setItem("users", JSON.stringify([]));
  }

  /**
   * Sets value of follow-suggestions cache in localstorage.
   *
   * @param {array} folloSugArr array of user objects.
   */
  function setFollowSugCache(folloSugArr) {
    localStorage.setItem("follow-suggestions", JSON.stringify(folloSugArr));
    // update value of followSugCache
    followSugCache = JSON.parse(localStorage.getItem("follow-suggestions"));
  }
  /**
   * Sets value of trends cache in localstorage.
   *
   * @param {array} trends array of tweet objects.
   */
  function setTrendCache(trends) {
    localStorage.setItem("trends", JSON.stringify(trends));
    // update value of trendsCache
    trendsCache = JSON.parse(localStorage.getItem("trends"));
  }
  /**
   * Sets value of home cache in localstorage.
   *
   * @param {array} tweets array of tweet objects.
   */
  function setHomeCache(tweets) {
    localStorage.setItem("home", JSON.stringify(tweets));
    // update value of homeCache
    homeCache = JSON.parse(localStorage.getItem("home"));
  }
  /**
   * Sets value of bookmarks cache in localstorage.
   *
   * @param {array} tweets array of tweet objects.
   */
  function setBookmarkCache(tweets) {
    localStorage.setItem("bookmarks", JSON.stringify(tweets));
    // update value of bookmarkCache
    bookmarkCache = JSON.parse(localStorage.getItem("bookmarks"));
  }
  /**
   * Sets value of explore/search cache in localstorage.
   *
   * @param {string} searchTerm search phrase.
   * @param {object} obj array of tweet objects.
   * @param {string} obj.type type of search (top,latest,media,people)
   * @param {array} obj.list array of search result tweets
   */
  function setExploreCache(searchTerm, { type, list }) {
    exploreCache = JSON.parse(localStorage.getItem("explore"));
    // get lowecase version of type ('top','latest','people','media')
    let lowerCaseType = type.toLocaleLowerCase();
    // check if search term exists in localstorage
    if (
      exploreCache.some(
        (e) => e.searchTerm.toLowerCase() === searchTerm.toLowerCase()
      )
    ) {
      // get index of object containing search term
      let index = exploreCache.findIndex(
        (e) => e.searchTerm.toLowerCase() === searchTerm.toLowerCase()
      );
      // modify cache object e.g exploreCache[index]['top']
      exploreCache[index][lowerCaseType] = list;
      // update cache in local storage e.g exploreCache[index]['top']
      localStorage.setItem("explore", JSON.stringify(exploreCache));
    }
    // if search term does not exist in localstorage
    else {
      let newObj = {
        searchTerm: searchTerm,
        top: [],
        media: [],
        people: [],
      };
      // new cache object e.g newObj['top']
      newObj[lowerCaseType] = list;
      // add object to array
      exploreCache.push(newObj);
      // update localstorage
      localStorage.setItem("explore", JSON.stringify(exploreCache));
    }
  }

  /**
   * Sets value of explore/search cache in localstorage.
   *
   * @param {string} username username of user to cache.
   * @param {object} obj array of tweet objects.
   * @param {string} obj.type type of info/tweets (profile,tweets,tweets & replies,media,likes)
   * @param {array} obj.list array of user's tweets
   */
  function setUsersCache(username, { type, list }) {
    usersCache = JSON.parse(localStorage.getItem("users"));
    // get lowecase version of type ('profile','tweets','tweetsreplies','people','media','likes')
    let lowerCaseType = type.toLocaleLowerCase();
    // if user info is already existing
    if (
      usersCache.some(
        (e) => e.username.toLowerCase() === username.toLowerCase()
      )
    ) {
      let index = usersCache.findIndex(
        (e) => e.username.toLowerCase() === username.toLowerCase()
      );
      // modify cache object e.g usersCache[index]['top']
      usersCache[index][lowerCaseType] = list;
      // update cache in localstorage
      localStorage.setItem("users", JSON.stringify(usersCache));
    }
    // if user info is not already existing
    else {
      // new cache object
      let newObj = {
        username: username,
        profile: [],
        tweets: [],
        tweetsreplies: [],
        media: [],
        likes: [],
      };
      // modify cache object e.g newObj['top']
      newObj[lowerCaseType] = list;
      // add new cache object to user cache array
      usersCache.push(newObj);
      // update user cache in localstorage
      localStorage.setItem("users", JSON.stringify(usersCache));
    }
  }

  useEffect(() => {
    // clear the following cache after 2 minutes of component mount
    setTimeout(() => {
      setTrendCache([]);
      setFollowSugCache([]);
      setHomeCache([]);
    }, 2 * 1000 * 60);
    // clear the following cache after 20 minutes of component mount
    setTimeout(() => {
      localStorage.setItem("explore", JSON.stringify([]));
      localStorage.setItem("bookmarks", JSON.stringify([]));
      localStorage.setItem("users", JSON.stringify([]));
    }, 20 * 1000 * 60);
  }, []);

  const value = {
    setTrendCache,
    setFollowSugCache,
    setHomeCache,
    setExploreCache,
    setUsersCache,
    setBookmarkCache,
  };
  return (
    <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
  );
};

export default CacheContext;
