import "./follow-modal.scss";
import React, { useState, useContext, useEffect } from "react";
import { Spinner } from "../loading-spinner/spinner";
import UserContext from "../contexts/usercontext";
import { followUtil } from "../utils/profile-utils";
import { useNavigate } from "react-router-dom";
import RepliesCard from "../replies-card/replies-card";

export const FollowModalItem = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const { userProfile } = useContext(UserContext);
  useEffect(() => {
    userProfile.followers.findIndex(
      (e) => userProfile.username == user.username
    )
      ? setIsFollowing(true)
      : setIsFollowing(false);
  }, [userProfile]);

  const followHandler = () => {
    setFollowLoading(true);
    followUtil(user.username)
      .then((res) => {
        res.status === "followed"
          ? setIsFollowing(true)
          : setIsFollowing(false);
        setFollowLoading(false);
      })
      .catch((err) => {
        setFollowLoading(false);
        setAlert({
          ...alert,
          text: "Something went wrong",
          type: "error",
          active: true,
        });
        console.log(err);
      });
  };
  const goToProfile = () => {
    window.location.href = `/user/${user.username}`;
  };
  return (
    <div className="follow-modal-item">
      <div className="follow-modal-profile-container">
        <div className="follow-modal-profile">
          <img
            onClick={goToProfile}
            src={
              user.profile.profile_pic || "/static/frontend/images/no_image.png"
            }
          />
          <div>
            <h3 onClick={goToProfile}>
              {user.profile.display_name || user.username}
            </h3>
            <span className="gray3 f12 w500">
              {user.profile.followers.length} follower
              {user.profile.followers.length === 1 ? "" : "s"}
            </span>
          </div>
          {user.id !== userProfile.id && (
            <button
              className={isFollowing ? "outline-b" : ""}
              onClick={followHandler}
            >
              {isFollowing ? "Unfollow" : "Follow"}
              {followLoading && <Spinner />}
            </button>
          )}
        </div>
        <div className="follow-modal-bio gray3 f14 w500">
          {user.profile.bio}
        </div>
      </div>
    </div>
  );
};

function FollowModal({ toggleModal, title, list, type }) {
  const { userProfile } = useContext(UserContext);
  return (
    <div className="modal-container">
      <div className="modal">
        <div className="follow-modal-top f12 gray1">
          {title}
          <p className="follow-modal-cancel gray4" onClick={toggleModal}>
            &#215;
          </p>
        </div>
        {list.length > 0 ? (
          type === "profile" ? (
            list.map((user) => {
              return <FollowModalItem user={user} key={user.id} />;
            })
          ) : type === "tweets" ? (
            <RepliesCard replies={list} />
          ) : (
            list.map((user) => {
              return <FollowModalItem user={user} key={user.id} />;
            })
          )
        ) : (
          <span className="f12">Nothing to see here</span>
        )}
      </div>
    </div>
  );
}

export default FollowModal;
