import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../contexts/usercontext";
import "./auth.scss";
import axios from "axios";
import AlertContext from "../contexts/alert";
import { Spinner } from "../../../../../../studybuddy/frontend/src/components/loading-spinner/spinner";
import { clearCache } from "../contexts/cache";

export function authLogout(apiConfig, userDispatch) {
  axios
    .post("/api/logout/", {}, apiConfig)
    .then((res) => {
      // update usercontext -userProfile
      userDispatch({ type: "logout", payload: {} });
      // reset localStorage userprofile
      clearCache();
      // redirect to login
      window.location.href = "/login";
    })
    .catch((e) => {
      console.log(e);
    });
}
/**
 * Login/Register form
 *
 * @param {string} type type of authentication (login or register)
 */

function Auth({ type }) {
  let navigate = useNavigate();
  // user context info
  const { user, userDispatch } = useContext(UserContext);
  // flash alert messages
  const { setAlert, alert } = useContext(AlertContext);
  const [username, setUsername] = useState("");
  // loading state for spinner
  const [loading, setLoading] = useState(false);
  // login processed message
  const [loginMsg, setLoginMsg] = useState("");
  // user password input
  const [password, setPassword] = useState("");
  // user email input
  const [email, setEmail] = useState("");
  // set username on input
  const handleUsername = (event) => {
    setUsername(event.target.value);
  };
  // set Password on input
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  // set Email on input
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  // process the submitted credentials
  const handleAuthSubmit = (event) => {
    setLoading(true);
    // if it's a login form
    if (type === "Login") {
      const bod = {
        username,
        password,
      };
      axios
        .post("/api/login/", bod) // login api
        .then((res) => {
          setLoading(false);
          setAlert({
            ...alert,
            text: "Log In successful",
            active: true,
            type: "success",
          });
          const payload = {
            username: username,
            token: res.data.token,
          };
          // update userProfile context
          userDispatch({ operation: "login", payload: payload });
          // redirect to home page
          navigate("/");
          // reload home page to reflect new user info
          window.location.reload();
        })
        .catch((err) => {
          setLoading(false);
          setAlert({
            ...alert,
            text: "Sorry, something went wrong please try again",
            active: true,
            type: "error",
          });
          if (
            err.response.data.non_field_errors[0] ===
            "Unable to log in with provided credentials."
          ) {
            setLoginMsg("Wrong username or password");
          } else {
            setLoginMsg("Sorry, Something went wrong from our side");
          }
          console.log(err);
        });
    }
    // if auth type is "register"
    else {
      const body = {
        username,
        email,
        password,
      };
      axios
        .post("/api/register/", body) // register api
        .then((res) => {
          setLoading(false);
          setAlert({
            ...alert,
            text: "Account created Successfully",
            active: true,
            type: "success",
          });
          // login for newly registered user
          navigate("/login");
        })
        .catch((err) => {
          setLoading(false);
          setAlert({
            ...alert,
            text: "Sorry, something went wrong please try again",
            active: true,
            type: "error",
          });
          if (
            err.response.data.username[0] ===
            "A user with that username already exists."
          ) {
            setLoginMsg("A user with that username already exists.");
          } else {
            setLoginMsg("Sorry, Something went wrong from our side");
          }
          console.log(err);
        });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <h3>{type}</h3>
        <span className="f12 w300 red">{loginMsg}</span>
        <form>
          {type === "Login" ? (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => handleUsername(e)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="48"
                  viewBox="0 0 48 48"
                >
                  <g fill="#4F4F4F">
                    <path d="m39.7 14.7-6.4-6.4 2.1-2.1q.85-.85 2.125-.825 1.275.025 2.125.875L41.8 8.4q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Z" />
                  </g>
                </svg>
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => handlePassword(e)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="48"
                  viewBox="0 0 48 48"
                >
                  <g fill="#4F4F4F">
                    <path d="M11 44q-1.25 0-2.125-.875T8 41V19.3q0-1.25.875-2.125T11 16.3h3.5v-4.8q0-3.95 2.775-6.725Q20.05 2 24 2q3.95 0 6.725 2.775Q33.5 7.55 33.5 11.5v4.8H37q1.25 0 2.125.875T40 19.3V41q0 1.25-.875 2.125T37 44Zm13-10q1.6 0 2.725-1.1t1.125-2.65q0-1.5-1.125-2.725T24 26.3q-1.6 0-2.725 1.225T20.15 30.25q0 1.55 1.125 2.65Q22.4 34 24 34Zm-6.5-17.7h13v-4.8q0-2.7-1.9-4.6Q26.7 5 24 5q-2.7 0-4.6 1.9-1.9 1.9-1.9 4.6Z" />
                  </g>
                </svg>
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => handleUsername(e)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="48"
                  viewBox="0 0 48 48"
                >
                  <g fill="#4F4F4F">
                    <path d="m39.7 14.7-6.4-6.4 2.1-2.1q.85-.85 2.125-.825 1.275.025 2.125.875L41.8 8.4q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Z" />
                  </g>
                </svg>
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => handleEmail(e)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="48"
                  viewBox="0 0 48 48"
                >
                  <g fill="#4F4F4F">
                    <path d="M7 40q-1.2 0-2.1-.9Q4 38.2 4 37V11q0-1.2.9-2.1Q5.8 8 7 8h34q1.2 0 2.1.9.9.9.9 2.1v26q0 1.2-.9 2.1-.9.9-2.1.9Zm17-15.1 17-11.15V11L24 21.9 7 11v2.75Z" />
                  </g>
                </svg>
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => handlePassword(e)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  width="48"
                  viewBox="0 0 48 48"
                >
                  <g fill="#4F4F4F">
                    <path d="M11 44q-1.25 0-2.125-.875T8 41V19.3q0-1.25.875-2.125T11 16.3h3.5v-4.8q0-3.95 2.775-6.725Q20.05 2 24 2q3.95 0 6.725 2.775Q33.5 7.55 33.5 11.5v4.8H37q1.25 0 2.125.875T40 19.3V41q0 1.25-.875 2.125T37 44Zm13-10q1.6 0 2.725-1.1t1.125-2.65q0-1.5-1.125-2.725T24 26.3q-1.6 0-2.725 1.225T20.15 30.25q0 1.55 1.125 2.65Q22.4 34 24 34Zm-6.5-17.7h13v-4.8q0-2.7-1.9-4.6Q26.7 5 24 5q-2.7 0-4.6 1.9-1.9 1.9-1.9 4.6Z" />
                  </g>
                </svg>
              </div>
            </>
          )}

          <div className="auth-submit" onClick={handleAuthSubmit}>
            {loading && <Spinner />}
            {type}
          </div>
          {type === "Login" ? (
            <span className="f12 w300 center">
              <Link to="/register" className="blue">
                Register
              </Link>
            </span>
          ) : (
            <span className="f12 w300 center">
              <Link to="/login" className="blue">
                Log in
              </Link>
            </span>
          )}
        </form>
      </div>
    </div>
  );
}

export default Auth;
