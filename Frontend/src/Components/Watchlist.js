import React, { useState, useEffect, useContext } from "react";
import { ListGroup, ListGroupItem, Row, Col, Table } from "react-bootstrap";
import { WatchListItem } from "./WatchListItem";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { auth } from "../firebase";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  query,
  where,
  collection,
  getDocs,
  addDoc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { UserChosen } from "../App";


export const Watchlist = (props) => {
  const { wl, changeWL } = useContext(UserChosen);
  const [docId, setDocId] = useState(0);
  const [inp, setInp] = useState();
  const db = getFirestore();
  const watchRef = collection(db, "watchlist");

  const [watchlist, updateList] = useState(["AMZN", "TSLA"]);

  // useEffect(() => {
  //   const unsub = setInterval(() => {
  //     updateList([...watchlist]);
  //   }, 60000);
  //   return () => unsub;
  // }, []);

  useEffect(() => {
    
    let unsub;

    async function dbWatchlistdocs(){
    
    const q = query(watchRef, where("uid", "==", auth.currentUser.uid));
    // const querySnapshot = await getDocs(q);
    unsub = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.docs.length === 0) {

        const docRef = await addDoc(watchRef,{
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          wl: watchlist
        }
        );
        
        if (docRef) {
          setDocId(docRef);
          console.log(docRef);
        }

      } else {
        querySnapshot.forEach((doc) => {
          if (docId === 0) setDocId(doc.id);
          updateList(doc.data().wl);
        });
      }
    })

  }

    dbWatchlistdocs();

    return () => unsub();
  }, []);

  useEffect(() => {
    props.getDocID(docId, watchlist);
    // console.log("watchlist",docId);
  }, [docId]);

  useEffect( () => {

    async function updateDb(){
    const docRef = doc(db,"watchlist",`${docId}`);
    // console.log(docRef);
    await updateDoc(docRef, { wl: watchlist })
    props.getDocID(docId, watchlist);
    changeWL(watchlist);
    // console.log("watchlist wl",wl);
    }

    updateDb();
  }, [watchlist]);

  async function deleteFromList(tick) { 
    updateList(watchlist.filter((ele) => ele !== tick));
  }
  async function addStock() {
    if (!watchlist.includes(inp)) updateList([...watchlist, inp]);
    setInp("");
  }

  return (
    <>
      <div className="watchlist-header">
        <h2 style={{ display: "inline" }}>Your Watchlist</h2>
        <div>
          <div>
            <TextField
              id="outlined"
              label="Add Stocks"
              size="small"
              value={inp}
              onChange={(e) => {
                setInp(e.target.value);
              }}
            />
          </div>
          <div>
            <Fab color="primary" aria-label="add" size="small" disabled={!inp}>
              <AddIcon onClick={addStock} />
            </Fab>
          </div>
        </div>
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
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((item) => {
              return (
                <WatchListItem
                  tick={item}
                  flag={"watch"}
                  removeTick={deleteFromList}
                />
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};
