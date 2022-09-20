import React, { useContext, useState } from "react";
import TimelineContext from "../contexts/timeline-context";
import "./tweet-button.scss";

const TweetButton = () => {
  const { openTweetBox, setOpenTweetBox } = useContext(TimelineContext);
  const [close, setClose] = useState(false);
  function tweetBox() {
    setOpenTweetBox(!openTweetBox);
    setClose(!close);
  }
  return (
    <div className="tweet-button-container pointer" onClick={tweetBox}>
      {!close ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
          viewBox="0 0 48 48"
        >
          <path d="M22.5 38V25.5H10v-3h12.5V10h3v12.5H38v3H25.5V38Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          width="48"
          viewBox="0 0 48 48"
        >
          <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
        </svg>
      )}
    </div>
  );
};

export default TweetButton;
