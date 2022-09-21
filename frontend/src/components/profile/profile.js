import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import axios from "axios";
import imageUpload, { getFilePath } from "../utils/image-upload";
import { updateProfile } from "../utils/profile-utils";
import { Spinner } from "../loading-spinner/spinner";
import UserContext from "../contexts/usercontext";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [profileImage, setProfileImage] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [tempProfileUrl, setTempProfileUrl] = useState("");
  const [tempHeaderUrl, setTempHeaderUrl] = useState("");
  const [headerUrl, setHeaderUrl] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saveStatus, setSaveStatus] = useState(false);

  async function getSignature() {
    setSaveStatus(true);
    let header_pic = await imageUpload(headerImage, "headers");
    let profile_pic = await imageUpload(profileImage, "pf");
    updateProfile(profile_pic, name, bio, phone, header_pic);
  }
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${user.token}`,
    },
  };
  useEffect(() => {
    axios
      .get(`api/user/`, config)
      .then((res) => {
        setName(res.data.profile.display_name);
        setPhone(res.data.profile.phone);
        setBio(res.data.profile.bio);
        setEmail(res.data.email);
        setProfileUrl(res.data.profile.profile_pic);
        setHeaderUrl(res.data.profile.header_pic);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);
  return (
    <div className="profile-modal-container gray1">
      <div className="profile-modal">
        <div>Edit Profile</div>
        <form>
          <div className="form-image-upload-container">
            Header Picture:
            <label
              htmlFor="profile-modal-header"
              className="form-image-upload-label"
            >
              <img src={tempHeaderUrl ? tempHeaderUrl : headerUrl} />
            </label>
            <input
              type="file"
              className="form-image-upload"
              accept="image/jpeg"
              name="profile-modal-header"
              id="profile-modal-header"
              onChange={(e) => {
                setHeaderImage(e.target.files[0]);
                setTempHeaderUrl(getFilePath(e.target.files[0]));
              }}
            />
          </div>
          <div className="form-image-upload-container">
            Profile Picture:
            <label
              htmlFor="profile-modal-dp"
              className="form-image-upload-label"
            >
              <img src={tempProfileUrl ? tempProfileUrl : profileUrl} />
            </label>
            <input
              type="file"
              className="form-image-upload"
              accept="image/jpeg"
              name="profile-modal-dp"
              id="profile-modal-dp"
              onChange={(e) => {
                setProfileImage(e.target.files[0]);
                setTempProfileUrl(getFilePath(e.target.files[0]));
              }}
            />
          </div>
          <label htmlFor="name">Display Name</label>
          <input
            type="text"
            id="name"
            maxLength={16}
            placeholder={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="bio">Bio</label>
          <textarea
            type="text"
            id="bio"
            placeholder={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            placeholder={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="profile-edit-submit" onClick={getSignature}>
            <span>Save</span>
            {saveStatus && <Spinner />}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
