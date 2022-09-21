import React, { useContext } from "react";
import axios from "axios";
import { tweetImageUpload } from "./image-upload";

// /**
//  * API wrapper to get follow suggestions
//  *
//  * @param {string} username username of user to follow/unfollow
//  * @return {object} promise object specifying follow/unfollow status
//  */
/**
 * API wrapper to get follow suggestions
 *
 * @return {object} promise object containing follow suggestions
 */
export function followSuggestions() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .get(`/api/followsuggestions/`, config)
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
 * API wrapper to get trends words
 *
 * @return {object} promise object containing trends words
 */
export function getTrends() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .get(`/api/trends/`, config)
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
 * API wrapper to get trends words
 *
 * @param {string} search search phrase
 * @param {string} searchTypeContext search type (top,latest,media,people)
 * @return {object} promise object containing trends words
 */
export function searchTweets(search, searchTypeContext) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .get(`/api/search?search=${search}&type=${searchTypeContext}`, config)
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
 * API wrapper to get tweets for user page
 *
 * @param {string} TLContext  type of tweets (tweets,tweets & replies,media,likes)
 * @return {object} promise object containing tweets for user page
 */
export function getTLTweets(TLContext) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .get(`/api/get_tweets?type=${TLContext}`, config)
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
 * API wrapper to create tweet reply
 *
 * @param {string} body  tweet text
 * @param {number} id id of parent tweet
 * @return {object} promise object containing tweet creation status
 */
export function createTweetReply(body, id) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .post(`/api/tweet/${id}/reply`, body, config)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => reject(e));
    }, 5000);
  });
}
/**
 * API wrapper to create new tweet
 *
 * @param {string} body  tweet text
 * @param {number} id id of parent tweet
 * @return {object} promise object containing tweet creation status
 */
function createTweet(body) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      axios
        .post("/api/post_tweet", body, config)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => reject(e));
    }, 5000);
  });
}
/**
 * API wrapper to attach pictures to specified tweet
 *
 * @param {number} tweetId  id of target tweet
 * @param {array} tweetPix  array of photo urls
 * @return {object} promise object containing tweet creation status
 */
export function createTweetPix(tweetId, tweetPix) {
  return new Promise(function (resolve, reject) {
    if (isNaN(tweetId)) {
      reject(new Error("invalid tweet id", tweetId));
    }
    tweetImageUpload(tweetPix).then((res) => {
      setTimeout(() => {
        axios
          .post(
            `/api/tweetpix/${tweetId}/`,
            {
              urls: res,
            },
            config
          )
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            reject(e);
            console.log("error from createTweetPix", e);
          });
      }, 5000);
    });
  });
}
const monthMap = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};
/**
 * get formatted date from timestring
 *
 * @param {string} date  unix time string
 * @return {string} formatted date
 */
export function getDateTimeString(date) {
  date = new Date(date);
  let year = date.getFullYear(); //get $-digit Year
  let month = date.getMonth() + 1; // get month 0-11
  let day = date.getDate(); // get day 1-31
  let hour = date.getHours(); // get day 1-31
  let minutes = date.getMinutes(); // get day 1-31
  return `${monthMap[month]} ${day} ${year} at ${hour}:${minutes}`;
}

export default createTweet;
