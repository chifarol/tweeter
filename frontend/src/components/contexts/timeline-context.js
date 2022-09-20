import React, { createContext, useState, useEffect } from "react";

export const TimelineContext = createContext();

export const TimelineContextProvider = ({ children }) => {
  // user profile page contexts ('Tweets','Tweets & Replies','Media','Likes')
  const [pTLContext, setPTLContext] = useState("Tweets");
  // headet tabs ('Home','Explore','Bookmarks')
  const [headerActive, setHeaderActive] = useState("Home");
  // tweet box modal state
  const [openTweetBox, setOpenTweetBox] = useState(false);
  // search phrase context
  const [searchContext, setSearchContext] = useState("");
  // search type context ('Top','Latest',"Media','People')
  const [searchTypeContext, setSearchTypeContext] = useState("Top");

  const value = {
    pTLContext,
    setPTLContext,
    searchContext,
    setSearchContext,
    searchTypeContext,
    setSearchTypeContext,
    openTweetBox,
    setOpenTweetBox,
    headerActive,
    setHeaderActive,
  };
  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};

export default TimelineContext;
