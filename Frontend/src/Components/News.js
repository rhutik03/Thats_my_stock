import React, { useState, useEffect } from "react";
import { NewsCard } from "./NewsCard";

export const News = () => {
  const [watchlist, updateList] = useState([
    "TSLA",
    "AAPL",
    "GME",
    "IBM",
    "TCS",
  ]); 

  return (
    <>
      <h2 id="news">News</h2>
      <hr />
      {watchlist.map((tick, _ ) => (
        <NewsCard
          key={_}
          style={{ marginTop: "100px", marginBottom: "100px" }}
          tick={tick}
        />
      ))}
    </>
  );
};
