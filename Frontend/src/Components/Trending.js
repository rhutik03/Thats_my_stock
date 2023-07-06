import React, { useState, useEffect, useContext } from "react";
import { ListGroup, ListGroupItem, Row, Col, Table } from "react-bootstrap";
import { WatchListItem } from "./WatchListItem";
import { UserChosen } from "../App";
import { doc, collection, updateDoc, getFirestore } from "firebase/firestore";
const trending = ["AMD", "FB", "NFLX", "TWTR", "SNAP", "GOOGL"];

export const Trending = () => {
  const [mainDocId, setDocId] = useState(0);
  const db = getFirestore();
  const watchRef = collection(db, "watchlist");

  const [trend, updateTrend] = useState(trending);
  const { docId, wl } = useContext(UserChosen);

  useEffect(() => {
    setDocId(docId);
    // console.log("docid_trending",docId);

  }, [docId]);

  useEffect(() => {
    updateTrend(trending.filter((ele) => !wl.includes(ele)));
  }, [wl]);

  const addToWL = async (tick) => {
    console.log(tick, docId);
    console.log(typeof(mainDocId));
    const docRef = doc(watchRef, mainDocId);
    let arr = wl;
    arr = [...arr, tick];
    if (!wl.includes(tick)) await updateDoc(docRef, { wl: arr });
    updateTrend((prev) => {
      return prev.filter((e) => e !== tick);
    });
  };

  return (
    <>
      <div className="watchlist-header">
        <h2 style={{ display: "inline" }}>Trending Stocks</h2>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Table striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>High</th>
              <th>Low</th>
              <th>Open</th>
              <th>Current</th>
              <th>Add </th>
            </tr>
          </thead>
          <tbody>
            {trend.map((item, _) => {
              return (
                <WatchListItem
                  key={_}
                  flag={"trend"}
                  tick={item}
                  add={addToWL}
                />
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};
