import React, { useState } from "react";
import { useEffect,useContext } from "react";
import {Card, Placeholder, Row, Col, Badge} from "react-bootstrap";

import { UserChosen } from "../App";


const TopPostsWL = () =>{

    const { wl } = useContext(UserChosen);
    const [topPosts,setPosts] = useState([]);
    const [loadingPosts,setLoadingPosts] = useState(false);

    // let req="http://127.0.0.1:5000/watchlist?tickSelector%5B0%5D=TSLA&tickSelector%5B1%5D=APPL&tickSelector%5B2%5D=GME";
    // let req = "/api/topsubs/hour";
    // let req =  "http://127.0.0.1:5000/topsubs/hour"

    useEffect(()=>{

        setLoadingPosts(true);
        let req="http://127.0.0.1:5000/watchlist?ticks="+wl.map((val)=> val).join(',');

        const getTopPostsWL = async (API) => {
            let res = await fetch(API)
            console.log("data w/ j",res);
            res =  await res.json();
            console.log("data",res);
            if(Object.keys(res).length>=5){
                setLoadingPosts(false);
                console.log(">10",loadingPosts);
                setPosts(res);
                // return res
            }
        }

        console.log("in redd");
        getTopPostsWL(req)
        // setPosts(async()=>await getTopPostsWL(req));
        console.log("top",topPosts);
    
    },[wl]);

    useEffect(()=>{
        console.log("inuseef",loadingPosts);
    },[loadingPosts])

    return (
        <>
            <h2>Top Reddit posts related to watchlist</h2>
            <div style={{display:"flex",flexDirection:"row", flexWrap:"wrap", margin:"20px"}}>  
            {
                loadingPosts?
                    <Card style={{ width:"100%",maxWidth:"100%",marginTop:"5px",marginBottom:"5px",height:"auto"}}>
                        <Card.Body>
                        <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                        <Placeholder xs={6} /> <Placeholder xs={9} />
                        </Placeholder>
                        </Card.Body>
                    </Card>
                :<>
                <Row xs={2} md={3} className="g-4" >
                    {topPosts.map((obj, idx) => (
                        <Col key={idx}>
                        <Card className="news-card" style={{height:"8em", margin:"10px" }}>
                            <Card.Body className="h-50" style={{maxHeight: "50%", margin:"2px"}}>
                            <Card.Text ><Badge bg="dark"><a style={{color:"white"}} href={obj.Permalink}>{obj.Sub}</a></Badge></Card.Text>
                            <Card.Title style={{fontSize:"15px"}}>{obj.Title.slice(0,40)+"..."}</Card.Title>
                            {/* <Card.Text style={{fontSize:"12px"}} >{obj.Sub}</Card.Text> */}
                            </Card.Body>
                        </Card>
                        </Col>
                    ))}
                    </Row>



                </> 
            }

            

            

            </div>
        </>
    );

}

export default TopPostsWL;
