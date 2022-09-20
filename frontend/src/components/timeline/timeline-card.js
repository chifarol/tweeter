import React, { useState, useRef } from "react";
import axios from "axios";
import { createTweetPix, createTweetReply } from "../utils/tweet-utils";
import { getFilePath, tweetImageUpload } from "../utils/image-upload";
import { Spinner } from "../loading-spinner/spinner";
import FollowModal from "../modal/follow-modal";
import { goToProfile } from "../utils/profile-utils";
import ImageModal from "../modal/image-modal";

const TimelineCard = ({ tweet, userProfile, userLocal, alert, setAlert }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${userLocal.token}`,
    },
  };
  const authorProfile = tweet.author;
  const pixLen = tweet.pix.length;
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const [openCarousel, setOpenCarousel] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [tweetOptions, setTweetOptions] = useState(false);
  const [diSabled, setDisabled] = useState(false);
  const [tweetPix, setTweetPix] = useState({});
  const [modalList, setModalList] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [modalType, setModalType] = useState("");
  const newComment = useRef(null);
  const [likeState, setLikeState] = useState(
    tweet.likes.some((e) => e.username === userLocal.username)
  );
  const [retweetState, setRetweetState] = useState(
    tweet.retweets.some((e) => e.username === userLocal.username)
  );
  const [bookmarkState, setBookmarkState] = useState(
    tweet.saves.some((e) => e.username === userLocal.username)
  );

  const [commentAction, setCommentAction] = useState(0);
  const [likeCount, setLikeCount] = useState(tweet.likes.length);
  const [retweetCount, setRetweetCount] = useState(tweet.retweets.length);
  const interactionHandler = (type) => {
    axios
      .post(`/api/tweet/${tweet.id}/${type}`, {}, config)
      .then((res) => {
        switch (type) {
          case "like":
            let oldLikeCount = likeCount;
            if (res.data.status === "unliked") {
              tweet.likes.splice(tweet.likes.indexOf(userProfile), 1);
              setLikeCount(oldLikeCount - 1);
              setLikeState(false);
            } else if (res.data.status === "liked") {
              tweet.likes.unshift(userProfile);
              setLikeCount(oldLikeCount + 1);
              setLikeState(true);
            }
            break;
          case "retweet":
            let oldRetweetCount = retweetCount;
            if (res.data.status === "unretweeted") {
              tweet.retweets.splice(tweet.retweets.indexOf(userProfile), 1);
              setRetweetCount(oldRetweetCount - 1);
              setRetweetState(false);
            } else if (res.data.status === "retweeted") {
              tweet.retweets.unshift(userProfile);
              setRetweetCount(oldRetweetCount + 1);
              setRetweetState(true);
            }
            break;
          case "save":
            setBookmarkState(!bookmarkState);
            break;

          default:
            break;
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
  const tweetDeleteHandler = () => {
    axios
      .delete(`/api/tweet/${tweet.id}/delete`, config)
      .then((res) => {
        setDeleted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  async function commentSubmitHandler() {
    setDisabled(true);
    setCommentLoading(true);
    if (!newComment.current.value && Object.keys(tweetPix).length === 0) {
      setCommentLoading(false);
      setAlert({
        ...alert,
        text: "Empty tweet",
        active: true,
        type: "error",
      });
      return;
    }
    const body = {
      text: newComment.current.value,
    };
    newComment.current.value = "";

    let count = commentAction + 1;
    if (Object.keys(tweetPix).length > 0) {
      let postPix = await tweetImageUpload(tweetPix); //upload pictures to cloudinary and get pic array
      let tweeIdRes = await createTweetReply(body, tweet.id); //create new tweet reply
      if (postPix.length && tweeIdRes.data.tweet_id) {
        //attach pix to tweet using id
        createTweetPix(tweeIdRes.data.tweet_id, tweetPix)
          .then((res) => {
            setDisabled(false);
            setCommentAction(count);
            setCommentLoading(false);
            setAlert({
              ...alert,
              text: "Comment sent",
              active: true,
              type: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            setDisabled(false);
            setCommentLoading(false);
            setAlert({
              ...alert,
              text: "Comment not sent",
              active: true,
              type: "error",
            });
          });
        setTweetPix({});
      } else {
        setCommentLoading(false);
        console.log("postPix", postPix, "tweeIdRes", tweeIdRes);
        setAlert({
          ...alert,
          text: "Something went wrong",
          active: true,
          type: "error",
        });
      }
    } else {
      let tweeIdRes = await createTweetReply(body, tweet.id); //create new tweet reply
      if (tweeIdRes.data.tweet_id) {
        setDisabled(false);
        setCommentAction(count);
        setCommentLoading(false);
        setAlert({
          ...alert,
          text: "Comment sent",
          active: true,
          type: "success",
        });
      } else {
        setDisabled(false);
        setCommentLoading(false);
        setAlert({
          ...alert,
          text: "Comment not sent",
          active: true,
          type: "error",
        });
      }
    }
  }

  const toggleModal = (title, list, type) => {
    setOpenComments(!openComments);
    setModalTitle(title);
    setModalList(list);
    setModalType(type);
  };
  const toggleCarousel = () => {
    setOpenCarousel(!openCarousel);
  };
  return (
    <div className={`timeline-card ${deleted && "hide"}`}>
      <div className="timeline-top">
        <img
          onClick={() => goToProfile(authorProfile.username)}
          src={
            authorProfile.profile.profile_pic
              ? authorProfile.profile.profile_pic
              : "/static/frontend/images/no_image.png"
          }
          className="timeline-tweet-author-pic"
        />
        <div className="timeline-tweet-info">
          <span
            className="timeline-tweet-author-name  f16"
            onClick={() => goToProfile(authorProfile.username)}
          >
            {authorProfile.profile.display_name}
          </span>
          <span className="timeline-tweet-date noto-sans gray4 f12">
            {tweet.date_string} at {tweet.time_string}
          </span>
        </div>
        {tweet.author.id === userProfile.id && (
          <div
            className="timeline-tweet-options-trigger"
            onClick={() => setTweetOptions(!tweetOptions)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
              className="svg48 pointer"
            >
              <path d="M24 40q-1 0-1.7-.7t-.7-1.7q0-1 .7-1.7t1.7-.7q1 0 1.7.7t.7 1.7q0 1-.7 1.7T24 40Zm0-13.6q-1 0-1.7-.7t-.7-1.7q0-1 .7-1.7t1.7-.7q1 0 1.7.7t.7 1.7q0 1-.7 1.7t-1.7.7Zm0-13.6q-1 0-1.7-.7t-.7-1.7q0-1 .7-1.7T24 8q1 0 1.7.7t.7 1.7q0 1-.7 1.7t-1.7.7Z" />
            </svg>
            {tweetOptions && (
              <div className="timeline-tweet-options">
                <span className="red f12 pointer" onClick={tweetDeleteHandler}>
                  Delete
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="timeline-middle">
        <div className="timeline-middle-tweet-body gray1 f16 noto-sans">
          {tweet.text}
        </div>
        <div className={`timeline-middle-tweet-image-container grid-${pixLen}`}>
          {openCarousel && (
            <ImageModal list={tweet.pix} toggleCarousel={toggleCarousel} />
          )}
          {tweet.pix.map((e) => {
            return (
              <div
                key={e.id}
                className={`timeline-middle-tweet-image-${
                  tweet.pix.indexOf(e) + 1
                }`}
              >
                <img src={e.url} onClick={() => toggleCarousel()} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="timeline-bottom">
        <div className="timeline-bottom-top gray4 f12">
          <span
            onClick={() => toggleModal("Comments", tweet.replies, "tweets")}
          >
            {tweet.replies.length + commentAction} Comment
            {tweet.replies.length === 1 ? "" : `s`}
          </span>
          <span
            onClick={() =>
              toggleModal("People Who retweeted", tweet.retweets, "profile")
            }
          >
            {retweetCount} Retweet{retweetCount === 1 ? "" : `s`}
          </span>
          <span
            onClick={() =>
              toggleModal("People Who liked", tweet.likes, "profile")
            }
          >
            {likeCount} Like
            {likeCount === 1 ? "" : `s`}
          </span>
        </div>
        <div className="timeline-bottom-middle gray2 f14">
          <div
            className="timeline-bottom-middle-item"
            onClick={() => {
              setOpenCommentBox(!openCommentBox);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
              className="svg48"
            >
              <g>
                <path d="M4 44V7q0-1.15.9-2.075Q5.8 4 7 4h34q1.15 0 2.075.925Q44 5.85 44 7v26q0 1.15-.925 2.075Q42.15 36 41 36H12Zm3-7.25L10.75 33H41V7H7ZM7 7v29.75Z" />
              </g>
            </svg>

            <span>Comment</span>
          </div>
          <div
            className={
              "timeline-bottom-middle-item " + (retweetState ? "retweet" : " ")
            }
            onClick={() => interactionHandler("retweet")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
              className="svg48"
            >
              <g>
                <path d="M8.35 40v-3h6.5l-.75-.6q-3.2-2.55-4.65-5.55-1.45-3-1.45-6.7 0-5.3 3.125-9.525Q14.25 10.4 19.35 8.8v3.1q-3.75 1.45-6.05 4.825T11 24.15q0 3.15 1.175 5.475 1.175 2.325 3.175 4.025l1.5 1.05v-6.2h3V40Zm20.35-.75V36.1q3.8-1.45 6.05-4.825T37 23.85q0-2.4-1.175-4.875T32.75 14.6l-1.45-1.3v6.2h-3V8h11.5v3h-6.55l.75.7q3 2.8 4.5 6t1.5 6.15q0 5.3-3.1 9.55-3.1 4.25-8.2 5.85Z" />
              </g>
            </svg>
            <span>{retweetState ? "Retweeted" : "Retweet"}</span>
          </div>
          <div
            className={
              "timeline-bottom-middle-item like-icon " +
              (likeState ? "like" : " ")
            }
            onClick={() => interactionHandler("like")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
              className="svg48"
            >
              <g>
                <path d="m24 41.95-2.05-1.85q-5.3-4.85-8.75-8.375-3.45-3.525-5.5-6.3T4.825 20.4Q4 18.15 4 15.85q0-4.5 3.025-7.525Q10.05 5.3 14.5 5.3q2.85 0 5.275 1.35Q22.2 8 24 10.55q2.1-2.7 4.45-3.975T33.5 5.3q4.45 0 7.475 3.025Q44 11.35 44 15.85q0 2.3-.825 4.55T40.3 25.425q-2.05 2.775-5.5 6.3T26.05 40.1Z" />
              </g>
            </svg>
            <span>{likeState ? "Liked" : "Like"}</span>
          </div>
          <div
            className={
              "timeline-bottom-middle-item " +
              (bookmarkState ? "bookmark" : " ")
            }
            onClick={() => interactionHandler("save")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
              className="svg48"
            >
              <g>
                <path d="M10 42V8.75q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1V42l-14-6Zm3-4.55 11-4.65 11 4.65V8.75H13Zm0-28.7h22-11Z" />
              </g>
            </svg>
            <span>{bookmarkState ? "Saved" : "Save"}</span>
          </div>
        </div>
        {openCommentBox && (
          <div className="timeline-bottom-bottom">
            <img
              src={
                userProfile.profile.profile_pic ||
                "/static/frontend/images/no_image.png"
              }
              className="timeline-bottom-bottom-pic"
            />
            <div className="timeline-bottom-bottom-message-box">
              <div>
                <textarea
                  type="text"
                  maxLength={250}
                  placeholder="Tweet your reply"
                  ref={newComment}
                />
                <div className="timeline-bottom-bottom-with-spinner">
                  {commentLoading && <Spinner />}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="48"
                    width="48"
                    viewBox="0 0 48 48"
                    className="svg48"
                    onClick={commentSubmitHandler}
                  >
                    <path d="M6 40V8l38 16Zm3-4.65L36.2 24 9 12.5v8.4L21.1 24 9 27Zm0 0V12.5 27Z" />
                  </svg>
                </div>
              </div>
              {tweetPix && (
                <div className="timeline-bottom-bottom-images-container">
                  {Object.keys(tweetPix).map(function (key) {
                    return <img src={getFilePath(tweetPix[key])} key={key} />;
                  })}
                </div>
              )}
              <div>
                <label htmlFor="timeline-card-upload-pix">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="48"
                    width="48"
                    viewBox="0 0 48 48"
                    className="svg48"
                    onChange={(e) => setTweetPixHandler(e)}
                  >
                    <g fill="#4F4F4F">
                      <path d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30Zm2.8-4.85h24.45l-7.35-9.8-6.6 8.55-4.65-6.35ZM9 39V9v30Z" />
                    </g>
                  </svg>
                </label>
                {!diSabled && (
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg"
                    id="timeline-card-upload-pix"
                    onChange={(e) => setTweetPixHandler(e)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {openComments && (
        <FollowModal
          toggleModal={toggleModal}
          title={modalTitle}
          list={modalList}
          type={modalType}
        />
      )}
    </div>
  );
};

export default TimelineCard;
