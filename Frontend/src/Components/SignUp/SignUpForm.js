import React from "react";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import PasswordStr from "./PasswordStr";
import "./signup.css";
import 'react-notifications/lib/notifications.css';
import NotificationContainer from "react-notifications/lib/NotificationContainer";

import { Link } from 'react-router-dom';
import { NotificationManager } from "react-notifications";


const SignUpForm = ({
  history,
  onSubmit,
  onChange,
  errors,
  user,
  score,
  btnTxt,
  type,
  pwMask,
  onPwChange,
  handleShow
}) => {
  return (
    <div className="loginBox">
      <h1>Sign Up</h1>
      <br />
      {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}

      <form onSubmit={onSubmit}>
        <div >
        <div style={{display:"flex", justifyContent:"center"}} >
            <div>
          <label htmlFor="avatarinput">
            <img
              id="avatar"
              src={
                "data:image/jpeg;base64,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"
              }
            ></img>
          </label>
          <input
            id="avatarinput"
            type="file"
            name="image"
            onChange={onChange}
          ></input>
          </div>
        </div>

        <div>
          <TextField
            name="fullname"
            floatingLabelText="full name"
            value={user.fullname}
            onChange={onChange}
            errorText={errors.username}
          />{" "}
          <br />
          <TextField
            name="username"
            floatingLabelText="user name"
            value={user.username}
            onChange={onChange}
            errorText={errors.username}
          />{" "}
          <br />
          <TextField
            name="email"
            floatingLabelText="email"
            value={user.email}
            onChange={onChange}
            errorText={errors.email}
          />{" "}
          <br />
          <TextField
            type={type}
            name="password"
            floatingLabelText="password"
            value={user.password}
            onChange={onPwChange}
            errorText={errors.password}
          />{" "}
          <br />
          <div className="pwStrRow">
            {score >= 1 && (
              <div>
                <PasswordStr score={score} />
                <FlatButton
                  className="pwShowHideBtn"
                  label={btnTxt}
                  onClick={pwMask}
                  style={{
                    position: "relative",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            )}
          </div>
          <TextField
            type={type}
            name="pwconfirm"
            floatingLabelText="confirm password"
            value={user.pwconfirm}
            onChange={onChange}
            errorText={errors.pwconfirm}
          />
        </div>
        <br />

        <RaisedButton
          className="signUpSubmit"
          primary={true}
          type="submit"
          label="Register"
        />
        </div>
      </form>
      <p>
        Aleady have an account? <br />
        <Link to="/home" className='item'  onClick={handleShow} >Log in here</Link>
      </p>
    </div>
  );
};

export default SignUpForm;
