import React, { useRef, useContext, useState } from "react";
import { Card, Form, Button, Container, Alert, Spinner, Row, Col} from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { FaGoogle } from 'react-icons/fa';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { createUserWithEmailAndPassword,signInWithPopup} from "firebase/auth";
import {auth,provider} from '../firebase';

import { AuthContext } from "../contexts/AuthContext";
import bg from "../Assets/images/signin.png";
import stockImage from "../Assets/images/thatsmystock.png";
import styles from "./css/signin.module.css";

export const Signup = () => {
  
    const myStyle = {
    backgroundImage: `url(${bg})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#fff",
  };
  
  const emailRef = useRef();
  const passwordRef = useRef();
  const {signup,signupGoogle} = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userExists, setuserExists] = useState(false);
  
  const navigate = useNavigate();
  
  async function handleEmailSignup(e) {
    e.preventDefault();
    try {
      setLoading(true);
      // console.log(passwordRef.current.value.length);
      if (passwordRef.current.value.length < 6) {
        console.log(passwordRef.current.value.length);
        setError(true);
      } else {
            setError(false);
            await signup(emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/login");
            }).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
              setuserExists(true);
              // ..
          });
            
            setLoading(false);
        }
    }
    catch {
      setError(true);
    }
    setLoading(false);
  }

  async function handleGoogleSignup(e) {
    e.preventDefault();
    console.log("goog");
    try {
      setLoading(true);
      setError(false);
      await signupGoogle()
      .then((userCredential) => {
      // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/");
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setuserExists(true);      
        }
      );
      setLoading(false);  
    }
    catch {
      console.log("error");
    }
    setLoading(false);
  }
  
  return (
    <>
      <div style={myStyle}>
        <div className={styles.parent}>
          
          <Row>
            
            <Col mb={6} sm={0} className={styles.col1}>
              <img src={stockImage} className={styles.img} alt="11" />
              <h1>Welcome To That's My Stock 🚀</h1>
            </Col>
            
            <Col mb={6} className={styles.col}>
              
              <Container className={styles.formContainer}>
                <Container className="text-center d-flex justify-content-center">
                  <AccountCircleOutlinedIcon
                    style={{ textAlign: "center", fontSize: "5em" }}
                  />
                </Container>
                
                {error && (
                  <strong className={styles.error}>
                    Password should be atleast 6 characters.
                  </strong>
                )}

                {userExists && (
                  <strong className={styles.error}>
                    User Already Exists
                  </strong>
                )}
                
                <Form className={styles.form}>
                  <Form.Group id="email">
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="Email ID"
                      ref={emailRef}
                      defaultValue={""}
                      required
                    />
                  </Form.Group>
                  <Form.Group id="password">
                    <input
                      className={styles.input}
                      type="password"
                      placeholder="Password"
                      ref={passwordRef}
                      defaultValue={""}
                      required
                    />
                  </Form.Group>
                  <Button
                    className={styles.btn}
                    mb={12}
                    lg={12}
                    disabled={loading}
                    onClick={handleEmailSignup}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <span>Sign Up</span>
                    )}
                  </Button>
                  <Button

                    style={{backgroundColor:"transparent", border:"none", padding:"10px"}}
                    mb={12}
                    lg={12}
                    disabled={loading}
                    onClick={handleGoogleSignup}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <FaGoogle/>
                    )}
                  </Button>
                </Form>
                
                <Container
                  className="text-center"
                  style={{ paddingTop: "1em" }}
                >
                  Have an account?
                  <br />
                  <Link to="/login" className={styles.links}>
                    Login
                  </Link>
                </Container>
              </Container>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Signup;
