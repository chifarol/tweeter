import React, { useState, useContext, useEffect } from "react";
import "./replies-card.scss";
import { getDateTimeString } from "../utils/tweet-utils";
import UserContext from "../contexts/usercontext";
import { goToProfile } from "../utils/profile-utils";
import axios from "axios";

function ReplyCard({ e }) {
  const { userProfile } = useContext(UserContext);
  const [likeCount, setLikeCount] = useState(e.likes.length);
  const [likeState, setLikeState] = useState(
    e.likes.some((e) => e.id === userProfile.id)
  );
  function likeReply() {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${userLocal.token}`,
      },
    };
    axios
      .post(`/api/tweet/${e.id}/like`, {}, config)
      .then((res) => {
        setLikeState(!likeState);
        let oldLikeCount = likeCount;
        if (res.data.status === "unliked") {
          e.likes.splice(
            e.likes.findIndex((e) => e.id === userProfile.id),
            1
          );
          setLikeCount(oldLikeCount - 1);
        } else if (res.data.status === "liked") {
          e.likes.unshift(userProfile);
          setLikeCount(oldLikeCount + 1);
        }
        setLikeState(!likeState);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {}, [e]);
  return (
    <div className="reply-card-item" key={e.id}>
      <img
        onClick={() => goToProfile(e.author.username)}
        src={
          e.author.profile.profile_pic || "/static/frontend/images/no_image.png"
        }
      />
      <div className="reply-card-right">
        <div className="reply-card-info">
          <h4 onClick={() => goToProfile(e.author.username)}>
            {e.author.profile.display_name}
          </h4>
          <span>{getDateTimeString(e.date)}</span>
        </div>
        <p className="reply-card-text">{e.text}</p>
        <div className="reply-card-interact gray4 f12">
          <div className={likeState ? "like" : ""} onClick={likeReply}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              viewBox="0 0 48 48"
              className="svg16"
            >
              <g>
                <path d="m24 41.95-2.05-1.85q-5.3-4.85-8.75-8.375-3.45-3.525-5.5-6.3T4.825 20.4Q4 18.15 4 15.85q0-4.5 3.025-7.525Q10.05 5.3 14.5 5.3q2.85 0 5.275 1.35Q22.2 8 24 10.55q2.1-2.7 4.45-3.975T33.5 5.3q4.45 0 7.475 3.025Q44 11.35 44 15.85q0 2.3-.825 4.55T40.3 25.425q-2.05 2.775-5.5 6.3T26.05 40.1ZM24 38q5.05-4.65 8.325-7.975 3.275-3.325 5.2-5.825 1.925-2.5 2.7-4.45.775-1.95.775-3.9 0-3.3-2.1-5.425T33.5 8.3q-2.55 0-4.75 1.575T25.2 14.3h-2.45q-1.3-2.8-3.5-4.4-2.2-1.6-4.75-1.6-3.3 0-5.4 2.125Q7 12.55 7 15.85q0 1.95.775 3.925.775 1.975 2.7 4.5Q12.4 26.8 15.7 30.1 19 33.4 24 38Zm0-14.85Z" />
              </g>
            </svg>
            <span>Like</span>
          </div>
          <span>
            &#183; {likeCount} Like{likeCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
function RepliesCard({ replies }) {
  return (
    <div className="reply-card-container">
      {replies.map((e) => {
        return <ReplyCard e={e} key={e.id} />;
      })}
    </div>
  );
}

export default RepliesCard;
