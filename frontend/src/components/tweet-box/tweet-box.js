import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./tweet-box.scss";
import axios from "axios";
import UserContext from "../contexts/usercontext";
import { Spinner } from "../loading-spinner/spinner";
import AlertContext from "../contexts/alert";
import imageUpload, { getFilePath } from "../utils/image-upload";
import { tweetImageUpload } from "../utils/image-upload";
import createTweet from "../utils/tweet-utils";

function TweetBox() {
  const [tweetOptions, showTweetOptions] = useState(false);
  const tweet = useRef(null);
  const [tweetPix, setTweetPix] = useState({});
  const { userProfile, user, userLocal, apiConfig } = useContext(UserContext);
  const { alert, setAlert } = useContext(AlertContext);
  const [tweetStatus, setTweetStatus] = useState(false);

  const toggleTweetOptions = () => {
    showTweetOptions(!tweetOptions);
  };
  async function setTweetPixHandler(e) {
    let max4 = {};
    const files = e.target.files;
    Object.keys(files).map((x) => {
      if (parseInt(x) < 4) {
        max4[x] = files[x];
      }
    });
    setTweetPix(max4);

    return;
  }
  async function submitTweetHandler(e) {
    setTweetStatus(true);
    if (!tweet.current.value && Object.keys(tweetPix).length === 0) {
      setTweetStatus(false);
      setAlert({
        ...alert,
        text: "Empty tweet",
        active: true,
        type: "error",
      });
      return;
    }
    const body = {
      text: tweet.current.value,
    };
    if (Object.keys(tweetPix).length > 0) {
      let postPix = await tweetImageUpload(tweetPix); //upload pictures to cloudinary and get pic array
      let tweeIdRes = await createTweet(body); //create new tweet
      if (postPix.length && tweeIdRes.data.tweet_id) {
        createTweetPix(tweeIdRes.data.tweet_id, postPix); //attach pix to tweet using id
      } else {
        setTweetStatus(false);
        console.log("postPix", postPix, "tweeIdRes", tweeIdRes);
        setAlert({
          ...alert,
          text: "Something went wrong",
          active: true,
          type: "error",
        });
      }
    } else {
      createTweet(body)
        .then((res) => {
          tweet.current.value = "";
          setTweetStatus(false);
          setAlert({
            ...alert,
            text: "Tweet posted successfully",
            active: true,
            type: "success",
          });
        })
        .catch((e) => {
          setAlert({
            ...alert,
            text: "Something went wrong",
            active: true,
            type: "error",
          });
          console.log(e);
        });
    }

    function createTweetPix(tweetId, postPix) {
      setTimeout(() => {
        axios
          .post(
            `/api/tweetpix/${tweetId}/`,
            {
              urls: postPix,
            },
            apiConfig
          )
          .then((res) => {
            setTweetStatus(false);
            tweet.current.value = "";
            setTweetPix([]);
            setAlert({
              ...alert,
              text: "Tweet posted successfully",
              active: true,
              type: "success",
            });
          })
          .catch((e) => {
            setAlert({
              ...alert,
              text: "Something went wrong",
              active: true,
              type: "error",
            });
          });
      }, 3000);
    }
  }
  return (
    <div className="modal-container">
      <div className="tweet-boxx-card">
        <div className="tweet-box-top">
          <span className="f12 gray2">Tweet Something</span>
        </div>
        <div className="tweet-box-divider"></div>
        <div className="tweet-box-bottom">
          <Link to={`/user/${userProfile.username}`}>
            <img
              src={
                userProfile.profile
                  ? userProfile.profile.profile_pic ||
                    "/static/frontend/images/no_image.png"
                  : "/static/frontend/images/no_image.png"
              }
              className="tweet-box-bottom-pic"
            />
          </Link>
          <div className="tweet-box-bottom-message-box">
            <textarea
              type="text"
              placeholder="What's happening?"
              className="f16 noto-sans"
              maxLength={250}
              ref={tweet}
            />
            <div className="tweet-box-bottom-images-container">
              {tweetPix &&
                Object.keys(tweetPix).map(function (key) {
                  return <img src={getFilePath(tweetPix[key])} key={key} />;
                })}
            </div>
            <div className="tweet-box-bottom-bottom">
              <label htmlFor="tweet-box-upload-pix">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="48"
                  viewBox="0 0 48 48"
                >
                  <g fill="#2F80ED">
                    <path d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30Zm2.8-4.85h24.45l-7.35-9.8-6.6 8.55-4.65-6.35ZM9 39V9v30Z" />
                  </g>
                </svg>
              </label>

              <input
                type="file"
                multiple
                accept="image/jpeg"
                id="tweet-box-upload-pix"
                onChange={(e) => setTweetPixHandler(e)}
              />
              <div
                className="tweet-box-options-trigger"
                onClick={toggleTweetOptions}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="48"
                  viewBox="0 0 48 48"
                >
                  <g fill="#2F80ED">
                    <path d="M24 44Q19.85 44 16.2 42.425Q12.55 40.85 9.85 38.15Q7.15 35.45 5.575 31.8Q4 28.15 4 24Q4 19.85 5.575 16.2Q7.15 12.55 9.85 9.85Q12.55 7.15 16.2 5.575Q19.85 4 24 4Q28.15 4 31.8 5.575Q35.45 7.15 38.15 9.85Q40.85 12.55 42.425 16.2Q44 19.85 44 24Q44 28.15 42.425 31.8Q40.85 35.45 38.15 38.15Q35.45 40.85 31.8 42.425Q28.15 44 24 44ZM21.85 40.95V36.85Q20.1 36.85 18.9 35.55Q17.7 34.25 17.7 32.5V30.3L7.45 20.05Q7.2 21.05 7.1 22.025Q7 23 7 24Q7 30.5 11.225 35.35Q15.45 40.2 21.85 40.95ZM36.55 35.55Q38.75 33.15 39.875 30.175Q41 27.2 41 24Q41 18.7 38.1 14.375Q35.2 10.05 30.35 8.05V8.95Q30.35 10.7 29.15 12Q27.95 13.3 26.2 13.3H21.85V17.65Q21.85 18.5 21.175 19.05Q20.5 19.6 19.65 19.6H15.5V24H28.4Q29.25 24 29.8 24.65Q30.35 25.3 30.35 26.15V32.5H32.5Q33.95 32.5 35.05 33.35Q36.15 34.2 36.55 35.55Z" />
                  </g>
                </svg>
                <span>Everyone can reply</span>

                {tweetOptions && (
                  <div className="tweet-box-options">
                    <span className="tweet-box-options-title gray2">
                      Who can reply?
                    </span>
                    <span className="tweet-box-options-desc w400 gray3">
                      Choose who can reply to this tweet
                    </span>
                    <div className="tweet-box-option w500 gray2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="48"
                        width="48"
                        viewBox="0 0 48 48"
                      >
                        <g fill="#4F4F4F">
                          <path d="M24 44Q19.85 44 16.2 42.425Q12.55 40.85 9.85 38.15Q7.15 35.45 5.575 31.8Q4 28.15 4 24Q4 19.85 5.575 16.2Q7.15 12.55 9.85 9.85Q12.55 7.15 16.2 5.575Q19.85 4 24 4Q28.15 4 31.8 5.575Q35.45 7.15 38.15 9.85Q40.85 12.55 42.425 16.2Q44 19.85 44 24Q44 28.15 42.425 31.8Q40.85 35.45 38.15 38.15Q35.45 40.85 31.8 42.425Q28.15 44 24 44ZM21.85 40.95V36.85Q20.1 36.85 18.9 35.55Q17.7 34.25 17.7 32.5V30.3L7.45 20.05Q7.2 21.05 7.1 22.025Q7 23 7 24Q7 30.5 11.225 35.35Q15.45 40.2 21.85 40.95ZM36.55 35.55Q38.75 33.15 39.875 30.175Q41 27.2 41 24Q41 18.7 38.1 14.375Q35.2 10.05 30.35 8.05V8.95Q30.35 10.7 29.15 12Q27.95 13.3 26.2 13.3H21.85V17.65Q21.85 18.5 21.175 19.05Q20.5 19.6 19.65 19.6H15.5V24H28.4Q29.25 24 29.8 24.65Q30.35 25.3 30.35 26.15V32.5H32.5Q33.95 32.5 35.05 33.35Q36.15 34.2 36.55 35.55Z" />
                        </g>
                      </svg>
                      <span>Everyone</span>
                    </div>
                    <div className="tweet-box-option w500 gray2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="48"
                        width="48"
                        viewBox="0 0 48 48"
                      >
                        <g fill="#4F4F4F">
                          <path d="M1.9 40v-4.7q0-1.75.9-3.175Q3.7 30.7 5.3 30q3.65-1.6 6.575-2.3Q14.8 27 17.9 27q3.1 0 6 .7t6.55 2.3q1.6.7 2.525 2.125.925 1.425.925 3.175V40Zm35 0v-4.7q0-3.15-1.6-5.175t-4.2-3.275q3.45.4 6.5 1.175t4.95 1.775q1.65.95 2.6 2.35.95 1.4.95 3.15V40Zm-19-16.05q-3.3 0-5.4-2.1-2.1-2.1-2.1-5.4 0-3.3 2.1-5.4 2.1-2.1 5.4-2.1 3.3 0 5.4 2.1 2.1 2.1 2.1 5.4 0 3.3-2.1 5.4-2.1 2.1-5.4 2.1Zm18-7.5q0 3.3-2.1 5.4-2.1 2.1-5.4 2.1-.55 0-1.225-.075T25.95 23.6q1.2-1.25 1.825-3.075.625-1.825.625-4.075t-.625-3.975Q27.15 10.75 25.95 9.3q.55-.15 1.225-.25t1.225-.1q3.3 0 5.4 2.1 2.1 2.1 2.1 5.4Z" />
                        </g>
                      </svg>
                      <span className="f12 noto-sans">People you follow</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="tweet-box-button" onClick={submitTweetHandler}>
                Tweet
                {tweetStatus && <Spinner />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetBox;
