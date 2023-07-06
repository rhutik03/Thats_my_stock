import React from "react";
import { useContext } from "react";
import axios from "axios";
import { Card, Button, Col, Row } from "react-bootstrap";
import { UserChosen } from "../App.js";
import ChartPlot from "./ChartPlot.js";

export const ChartCard = () => {
  const chart_time = ["1M", "3M", "1Y", "5Y"];
  const { chosenName } = useContext(UserChosen);

  return (
    <Row>
      <Col xs={12} md={12}>
        <Card
          className="chart-card"
          border="primary"
          style={{ height: "auto" }}
        >
          <Card.Header style={{ fontWeight: "600", fontSize: "1.1em" }}>
            <Row>
              <Col md={8} lg={9} sm={6}>
                {chosenName}
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <div className="fetching">Fetching Data...</div>
            </Card.Text>
            <div id="chart"></div>
            {/* <Button variant="primary">Go somewhere</Button> */}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
