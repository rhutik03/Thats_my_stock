import React from "react";
import { useState } from "react";
import { useContext } from "react";
import axios from "axios";
import getAPI from "../Utils/api";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Card,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { UserChosen } from "../App.js";

export const SearchCard = (props) => {
  const [tracked, updateTracked] = useState(["TSLA", "AAPL"]);
  const [input, changeInp] = useState("");
  const [options, updateOptions] = useState([
    "TSLA",
    "AAPL",
    "GME",
    "AMC",
    "IBM",
  ]);

  const { chosen, changeChosen } = useContext(UserChosen);

  function removeTrack(e) {
    const arr = tracked.filter((ele) => ele != e);

    updateTracked(arr);
  }

  function inpChange(e) {
    const val = e.target.value;
    changeInp(val);
  }
  var typingTimer;
  var doneTypingInterval = 1000;
  function keyU() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }

  function keyD() {
    clearTimeout(typingTimer);
  }

  function doneTyping() {
    // searchEndpoint(input);
  }

  async function searchEndpoint(key) {
    const APIkey = getAPI();
    console.log(APIkey);
    axios
      .get(
        "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
          key +
          "&apikey=" +
          APIkey
      )
      .then((response) => {
        const data = response.data.bestMatches;
        console.log(data);

        var array = [];
        if (data) {
          data.forEach((ele) => {
            array.push(ele["1. symbol"]);
          });
          updateOptions(array);
        }
        console.log(array);

        // console.log(response.data.bestMatches);
      });
  }

  return (
    <Row>
      <Col xs={12} md={12} lg={12}>
        <Card className="search-card" md={12} border="info">
          <Card.Header style={{ height: "60px" }}>
            <InputGroup className="mb-3">
              <input
                className="form-control"
                onChange={inpChange}
                value={input}
                type="text"
                list="data"
                placeholder="Search"
                aria-label="name"
                aria-describedby="basic-addon2"
                onKeyUp={keyU}
                onKeyDown={keyD}
              />
              <datalist id="data">
                {options.map((val, ind) => (
                  <option key={ind} value={val} />
                ))}
              </datalist>

              <Button
                variant="outline-primary"
                id="button-addon2"
                onClick={() => {
                  console.log("clicked");
                  changeInp("");
                  if (options.includes(input)) {
                    changeChosen(input);
                    if (!tracked.includes(input))
                      updateTracked([input, ...tracked]);
                    if (tracked.length > 5) {
                      updateTracked((prev) => {
                        prev.pop();
                        return prev;
                      });
                    }
                  }
                }}
              >
                Search
              </Button>
            </InputGroup>
          </Card.Header>
          <Card.Body>
            <ListGroup className="search-list">
              {tracked.map((e, _) => {
                return (
                  <>
                    <ListGroup.Item
                      key={_}
                      style={{ cursor: "pointer" }}
                      className={chosen == e ? "selected-item" : null}
                      onClick={() => {
                        changeChosen(e);
                      }}
                    >
                      <Row>
                        <Col>{e}</Col>
                        <Col style={{ textAlign: "right" }}>
                          <HighlightOffIcon
                            onClick={() => removeTrack(e)}
                            style={{ cursor: "pointer", color: "red" }}
                          />
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
