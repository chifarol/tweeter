import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfileTL from "./profile-tl";

const ProfileRouter = () => {
  return (
    <Routes>
      <Route index element={<ProfileTL />} />
      <Route path=":usernameRoute" element={<ProfileTL />} />
    </Routes>
  );
};

export default ProfileRouter;
