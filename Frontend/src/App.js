import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./index.css";
import axios from "axios";
import { createContext } from "react";
import {
  Button,
  Row,
  Col,
  Container,
  CardGroup,
  Alert,
  Toast,
  Spinner
} from "react-bootstrap";
import { NavBar } from "./Components/Navbar";
import { SearchCard } from "./Components/SearchCard";
import { ChartCard } from "./Components/ChartCard";
import { StatCard } from "./Components/StatCard";
import { useContext, useState } from "react";
import { Trending } from "./Components/Trending";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Profile } from "./Components/Profile";
import { SocialSentiment } from "./Components/SocialSentiment";
import { Sector } from "./Components/Sector";
import { db } from "./firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Watchlist } from "./Components/Watchlist";
import { News } from "./Components/News";
import { Biggest } from "./Components/Biggest";
import getAPI from "./Utils/api";
import TopPostsWL from "./Components/TopPostsWL";

const UserChosen = createContext();

export { UserChosen };

function App() {
  const st = {
    background: "LightBlue",
  };
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [chosen, updateChosen] = useState("TSLA");
  const [wl, setWL] = useState([]);
  const [chosenName, updateChosenName] = useState("TESLA INC.");
  const navigate = useNavigate();
  const [docId, setdocId] = useState(null);

  function changeDocID(id, watch) {
    setdocId(id);
    
    setWL(watch);
  }

  async function getData(tick) {
    axios
      .get(
        "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
          tick +
          "&apikey=" +
          getAPI()
      )
      .then((response) => {
        // console.log(response);

        const data = response.data.bestMatches[0];
        const name = data["2. name"];
        console.log(name);
        updateChosenName(name);
      });
  }
  function changeChosen(val) {
    console.log("changed");
    getData(val);
    updateChosen(val);
  }
  function changeWL(newWL) {
    setWL(newWL);
    // console.log("watchlist",wl);
  }

  return (
    <UserChosen.Provider
      value={{ chosen, changeChosen, chosenName, docId, wl, changeWL }}
    >
      <div className="App">
        <NavBar />
        <Container style={{ marginTop: "100px" }}>
          <Watchlist getDocID={changeDocID} />
          <Trending />
          <TopPostsWL/> 
          <Row>
            <Col md={6}>
              <Biggest type={"gainers"} />
            </Col>
            <Col md={6}>
              <Biggest type={"losers"} />
            </Col>
          </Row>
          <Sector />
          <SocialSentiment />
          <News />
          {/* <Row style={{ margin: "auto" }}>
            <Col lg={12}></Col>
            <Col lg={6}>
              <SearchCard update={changeChosen} />
            </Col>
            <Col lg={6}>
              <StatCard />
            </Col>
          </Row> */}
        </Container>
      </div>
    </UserChosen.Provider>
  );
}

export default App;
