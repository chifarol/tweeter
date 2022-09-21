import React, { useState, useContext } from "react";
import axios from "axios";

/**
 * api wrapper to update user profile
 *
 * @param {string} profile_pic profile_pic url
 * @param {string} display_name display name
 * @param {string} bio bio
 * @param {string} phone phone number
 * @param {string} header_pic header_pic url
 * @return {void} reloads window after update
 */
export function updateProfile(
  profile_pic,
  display_name,
  bio,
  phone,
  header_pic
) {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${user.token}`,
    },
  };
  const body = {};
  if (display_name) {
    body.display_name = display_name;
  }
  if (bio) {
    body.bio = bio;
  }
  if (profile_pic) {
    body.profile_pic = profile_pic;
  }
  if (phone) {
    body.phone = phone;
  }
  if (header_pic) {
    body.header_pic = header_pic;
  }
  axios
    .post("/api/user/update/", body, config)
    .then((res) => {
      //reset related cache
      localStorage.setItem("users", JSON.stringify([]));
      localStorage.setItem("userprofile", JSON.stringify({}));
    })
    .catch((err) => console.log(err.response.data));
}

/**
 * redirect to user profile page
 *
 * @param {string} username username of user page to redirect to
 */
export const goToProfile = (username) => {
  window.location.href = `/user/${username}`;
};
/**
 * API wrapper to get tweets of specified user
 *
 * @param {string} targetUsername username of user to fetch
 * @param {string} pTLContext type of tweets(media, Likes, tweets/&replies)
 * @return {object} promise object containing specified user tweets
 */
export function getTargetUserTweets(targetUsername, pTLContext) {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${user.token}`,
    },
  };
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .get(`/api/usertweets/${targetUsername}?type=${pTLContext}`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    }, 3000);
  });
}
/**
 * API wrapper to get profile of specified user
 *
 * @param {string} targetUsername username of user to fetch
 * @return {object} promise object containing profile of specified user
 */
export function getTargetUserProfile(targetUsername) {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${user.token}`,
    },
  };
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .get(`/api/users/${targetUsername}/`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    }, 3000);
  });
}
/**
 * API wrapper to follow/unfollow user
 *
 * @param {string} username username of user to follow/unfollow
 * @return {object} promise object specifying follow/unfollow status
 */
export function followUtil(username) {
  const user = JSON.parse(localStorage.getItem("user"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${user.token}`,
    },
  };
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .post(`/api/follow/${username}/`, {}, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    }, 3000);
  });
}
