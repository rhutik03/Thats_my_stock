import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { Signup } from "./Components/Signup";
import { Login } from "./Components/Login";
import Predict from "./Components/Predict";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";
import { Container } from "react-bootstrap";

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          } 
        ></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/predict" element={<Predict />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "2rem", fontSize: "2em" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
