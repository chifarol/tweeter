import React, { useState, useContext } from "react";
import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));
const url = "https://api.cloudinary.com/v1_1/chifarol/image/upload";

/**
 * get Image file path
 *
 * @param {object} file image file object
 * @return {string} file path string
 */
export const getFilePath = (file) => {
  let path = (window.URL || window.webkitURL).createObjectURL(file);
  return path;
};

/**
 * Upload image to cloudinary and return image url
 *
 * @param {object} file image file object
 * @param {string} type whether profile picture or header picture
 * @return {string} cloudinary image url string
 */
function imageUpload(file, type) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      if (file == "") {
        resolve("");
        return;
      }
      // get user credential
      const user = JSON.parse(localStorage.getItem("user"));
      // cloudinary url
      const url = "https://api.cloudinary.com/v1_1/chifarol/image/upload";
      let body = {
        params: {
          public_id: "",
          overwrite: "false",
        },
      };
      if (type === "pf") {
        // if type is profile picture
        body.params.public_id = `pf/${user.username}`;
        body.params.overwrite = "true";
      } else if (type === "headers") {
        // if type is header picture
        body.params.public_id = `headers/${user.username}`;
        body.params.overwrite = "true";
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorizationn: `Token ${user.token}`,
        },
      };
      axios
        .post("/api/cloudinary_signature/", body, config) // api returns signature and timestamp
        .then((res) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("public_id", body.params.public_id);
          formData.append("overwrite", body.params.overwrite);
          formData.append("api_key", "356179964254641");
          formData.append("timestamp", res.data.timestamp);
          formData.append("signature", res.data.signature);

          axios
            .post(url, formData) // main api call upload to cloudinary
            .then((res) => {
              resolve(res.data.secure_url);
            })
            .catch((err) => {
              reject(new Error("failed after signature " + err));
            });
        })
        .catch((err) => {
          reject(new Error(err));
        });
    }, 5000);
  });
}
/**
 * Upload image to cloudinary.
 *
 * @param {object} files image files object
 * @return {object} Promise object containing array of photo urls
 */
export function tweetImageUpload(files) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      // initialize cloudinary parameters to be signed
      let body = {
        params: {
          folder: `tweetpix`,
          overwrite: "false",
          unique_filename: "true",
        },
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorizationn: `Token ${user.token}`,
        },
      };
      // initialize file url array
      let fileUrls = [];
      // sign and upload each image file
      Object.keys(files).forEach((key) => {
        let file = files[key];
        axios
          .post("/api/cloudinary_signature/", body, config) // returns signature and timestamp
          .then((res) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", body.params.folder);
            formData.append("unique_filename", body.params.unique_filename);
            formData.append("overwrite", body.params.overwrite);
            formData.append("api_key", "356179964254641");
            formData.append("timestamp", res.data.timestamp);
            formData.append("signature", res.data.signature);

            axios
              .post(url, formData) // main api call upload to cloudinary
              .then((res) => {
                // push each url to array
                fileUrls.push(res.data.secure_url);
              })
              .catch((err) => {
                reject(new Error("failed after signature " + err));
              });
          })
          .catch((err) => {
            reject(new Error(err));
          });
      });
      // return the array of file urls
      resolve(fileUrls);
    }, 4000);
  });
}

export default imageUpload;
