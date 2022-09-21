import React, { useContext, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./components/home/home";
import Bookmark from "./components/bookmark/bookmark";
import Explore from "./components/explore/explore";
import ProfileRouter from "./components/profile-tl/profie-router";
import Profile from "./components/profile/profile";
import Auth from "./components/auth/auth";
import Private from "./components/utils/private";
import UserContext from "./components/contexts/usercontext";
import "./app.css";
import "./responsive.css";

import { Route, Routes } from "react-router-dom";
import P404 from "./components/404/404";

function App() {
  let userFromLocal = JSON.parse(localStorage.getItem("user"));
  if (!userFromLocal) {
    localStorage.setItem(
      "user",
      JSON.stringify({ username: null, token: null, auth: false })
    );
    userFromLocal = JSON.parse(localStorage.getItem("user"));
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/register" element={<Auth type="Register" />} />
      <Route path="/login" element={<Auth type="Login" />} />
      <Route path="/404" element={<P404 />} />
      <Route
        path="/profile"
        element={
          <Private auth={userFromLocal.auth}>
            <Profile />
          </Private>
        }
      />
      <Route path="/" element={<Header />}>
        <Route
          index
          path="/"
          element={
            <Private auth={userFromLocal.auth}>
              <Home />
            </Private>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <Private auth={userFromLocal.auth}>
              <Bookmark />
            </Private>
          }
        />
        <Route
          path="/explore"
          element={
            <Private auth={userFromLocal.auth}>
              <Explore />
            </Private>
          }
        />
        <Route
          path="/user/*"
          element={
            <Private auth={userFromLocal.auth}>
              <ProfileRouter />
            </Private>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
