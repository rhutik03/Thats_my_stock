import React, { useContext } from "react";
import { useState,useRef } from "react";
import { Card, Spinner, Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';


import { auth, provider } from '../firebase';
import { AuthContext } from "../contexts/AuthContext";
import styles from "./css/signin.module.css"
import bg from "../Assets/images/signin.png";
import stockImage from "../Assets/images/thatsmystock.png";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";


// const auto = 1;
export const Login = () =>{
    
    const myStyle = {
        backgroundImage: `url(${bg})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        color: "#fff",
      };

    const emailRef = useRef();
    const passwordRef = useRef();
    const {login,signupGoogle} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    
    async function handleEmailLogin(e) {
        e.preventDefault();

        try {
          setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/")
                console.log(user);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage, "Wrong")
              setError(true);
              setLoading(false);
            });

        } catch {
          setError(true);
          setLoading(false);

        }

        setLoading(false);
      }

    
    async function handleGoogleSignup(e) {
        e.preventDefault();
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
              <h1>Welcome Back 🚀</h1>
            </Col>
            
            <Col mb={6} className={styles.col}>
              <Container className={styles.formContainer}>
                <Container className="text-center d-flex justify-content-center">
                  <AccountCircleOutlinedIcon
                    style={{ textAlign: "center", fontSize: "6em" }}
                  />
                </Container>
                {error && (
                  <Alert
                    variant="strong"
                    style={{ marginTop: "2em", textAlign: "center" }}
                  >
                    Failed To sign in. Please try again.
                  </Alert>
                )}
                <Form className={styles.form}>
                  <Form.Group id="email">
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="Email ID"
                      ref={emailRef}
                      required
                    />
                  </Form.Group>
                  <Form.Group id="password">
                    <input
                      className={styles.input}
                      type="password"
                      placeholder="Password"
                      ref={passwordRef}
                      required
                    />
                  </Form.Group>
                  <Button
                    className={styles.btn}
                    mb={12}
                    lg={12}
                    disabled={loading}
                    onClick={handleEmailLogin}
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
                      <span>Log In</span>
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
                  Don't Have an account?
                  <br />
                  <Link to="/signup" className={styles.links}>
                    Sign Up!
                  </Link>
                </Container>
              </Container>
            </Col>

          </Row>
        </div>
      </div>
    </>
        
    );
}
