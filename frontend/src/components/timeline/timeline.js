import React, { useState, useContext, useRef } from "react";
import RepliesCard from "../replies-card/replies-card";
import "./timeline.scss";
import axios from "axios";
import UserContext from "../contexts/usercontext";
import AlertContext from "../contexts/alert";
import { Spinner } from "../../../../../../studybuddy/frontend/src/components/loading-spinner/spinner";
import TimelineCard from "./timeline-card";

function Timeline({ tweets }) {
  const { alert, setAlert } = useContext(AlertContext);
  const { userProfile, userLocal } = useContext(UserContext);
  return (
    <div className="timeline-container">
      {!tweets.length ? (
        <div className="timeline-spinner">
          <Spinner />
        </div>
      ) : (
        tweets.map((tweet) => (
          <TimelineCard
            tweet={tweet}
            userProfile={userProfile}
            userLocal={userLocal}
            alert={alert}
            setAlert={setAlert}
            key={tweet.id}
          />
        ))
      )}
    </div>
  );
}

export default Timeline;
