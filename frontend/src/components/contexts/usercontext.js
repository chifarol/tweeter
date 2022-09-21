import React, { createContext, useState, useReducer, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// initialize user context
const UserContext = createContext();
// config object for api
let apiConfig = {};
// user info from local storage
let userLocal = JSON.parse(localStorage.getItem("user"));
if (!userLocal) {
  localStorage.setItem(
    "user",
    JSON.stringify({ username: null, token: null, auth: false })
  );
  userFromLocal = JSON.parse(localStorage.getItem("user"));
  navigate("/login");
} else {
  apiConfig["headers"] = {
    "Content-Type": "application/json",
    Authorization: `Token ${userLocal.token}`,
  };
}

export const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const initialState = {
    username: null,
    token: null,
    auth: false,
  };
  const reducer = (state, action) => {
    const { payload, operation } = action;
    switch (operation) {
      case "login":
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: payload.username,
            token: payload.token,
            auth: true,
          })
        );
        return {
          ...state,
          username: payload.username,
          token: payload.token,
          auth: true,
        };
      case "logout":
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: null,
            token: null,
            auth: false,
          })
        );
        return {
          ...state,
          username: null,
          token: null,
          auth: false,
        };
    }
  };
  const [user, userDispatch] = useReducer(reducer, initialState);
  const [userProfile, setUserProfile] = useState({});

  // get user's profile object containing profile & header pictures, display name, followers/followings etc
  function getUserProfile() {
    let userProfileCache = JSON.parse(localStorage.getItem("userprofile"));
    // if user profile cache exists
    if (userProfileCache && userProfileCache.username) {
      axios
        .get(`/api/authstatus/`, apiConfig) // check auth state using user cache profile info
        .then((res) => {
          // if valid update userProfile state
          res.data.valid === true && setUserProfile(userProfileCache);
        })
        .catch((e) => {
          // if invalid auth redirect to login
          navigate("/login");
        });
    }
    // if no user profile cache exists
    else {
      axios
        .get(`/api/user/`, apiConfig)
        .then((res) => {
          setUserProfile(res.data);
          localStorage.setItem("userprofile", JSON.stringify(res.data));
        })
        .catch((e) => {
          navigate("/login");
        });
    }
  }
  useEffect(() => {
    getUserProfile();
  }, []);

  const value = { userProfile, userLocal, user, userDispatch, apiConfig };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
