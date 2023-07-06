import React, { useState } from "react";
import "./css/profile.css";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  OverlayTrigger,
  Popover,
  Button,
} from "react-bootstrap";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export const Profile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  async function handleLogout() {
    setError("");
    setLoading(true);

    try {
      await logout();
      navigate("/login");
      setLoading(false);
    } catch {
      setLoading(false);
      setError("Failed to log out");
    }
  }
  return (
    <OverlayTrigger
      trigger="focus"
      key="bottom"
      placement="bottom"
      overlay={
        <Popover id={`popover-positioned-bottom`}>
          <Popover.Header as="h3">Hello {currentUser?.displayName || currentUser?.email}</Popover.Header>
          <Popover.Body>
            <Button variant="danger" onClick={handleLogout}>
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <span>Log Out</span>
              )}
            </Button>
          </Popover.Body>
        </Popover>
      }
    >
      <Button variant="dark" className="profile-button">
        <AccountCircleIcon
          style={{
            color: "white",
            fontSize: "35px",
            // marginBottom: "2px",
          }}
        />
      </Button>
    </OverlayTrigger>
  );
};
