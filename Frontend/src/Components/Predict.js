import React, { useState,useEffect,useReducer } from "react";
import { NavBar } from "./Navbar";
import {Form, Row, Col, Container, Button, OverlayTrigger, Popover} from "react-bootstrap";
import axios from "axios";
import createPlotlyComponent from 'react-plotly.js/factory';
import Graphloader from "./Graphloader";




const Predict = () =>{
    
    const [formData,setFormData] = useState({
        ticker: '',
        metric: "close",
        changePointPriorScale: 10,
        holidaysPriorScale: 10,
        seasonalityMode: "multiplicative",
        seasonalityPriorScale: 10,
        dailySeasonalityFourierOrder: 50,
        weeklySeasonalityFourierOrder: 40,
        monthlySeasonalityFourierOrder: 40,
        yearlySeasonalityFourierOrder: 20,
        quaterlySeasonalityFourierOrder: 15
    });

    const [graphData,setGraphData] = useReducer((graphData,newData)=>({...graphData,...newData}),{
        ds:[],
        y:[],
        yhat:[],
        yhatUpper:[],
        yhatLower:[]
    });
    const [validated, setValidated] = useState(false);
    const [formSubmitted,setformSubmitted] = useState(false);
    const [loading,setloading] = useState(false);

    const popover = (header,body)=> {
        return (
        <Popover id="popover-basic" style={{zIndex:"0"}}>
          <Popover.Header as="h3">{header}</Popover.Header>
          <Popover.Body>
            {body}
          </Popover.Body>
        </Popover>
        )
    };

    const handleChange = (e) => {
        
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    }

    const submit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log("submiting",formData);
        setformSubmitted(true);
        setloading(true)
        axios.post('http://localhost:5000/forecast',formData).then((res)=>{
            
            // console.log(res.data);
            const data = JSON.parse(res.data)
            // console.log(data['ds'])
            // setGraphData(data)
            setGraphData({ds:Object.values(data['ds']),y:Object.values(data['y']),yhat:Object.values(data['yhat']),yhatUpper:Object.values(data['yhat_upper']),yhatLower:Object.values(data['yhat_lower'])})
            
            // console.log(graphData);
             
            setloading(false);
        }).catch((err)=>{
            console.log(err);
        })
        
        setValidated(true);
    }

    // const resetButton = () => {
    //     setFormData({
    //         ticker: '',
    //         changePointPriorScale: 10,
    //         holidaysPriorScale: 10,
    //         seasonalityMode: "Multiplicative",
    //         seasonalityPriorScale: 10,
    //         dailySeasonalityFourierOrder: 1,
    //         weeklySeasonalityFourierOrder: 1,
    //         monthlySeasonalityFourierOrder: 1,
    //         yearlySeasonalityFourierOrder: 1,
    //         quaterlySeasonalityFourierOrder: 1
    //     });
    // }
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [loading])

    const Plotly = window.Plotly;
    const Plot = createPlotlyComponent(Plotly);
    
    return(
        <>
            <NavBar />
            <Container fluid style={{ marginTop: "100px" }}>
            <> {formSubmitted? 
                    (loading)?
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <Graphloader/>
                        </div>
                    :<>
                    <Plot
                        data={[
                        {   x: graphData.ds,
                            y: graphData.yhat,
                            name: `${formData.metric} forecast`,
                            type: 'scatter',
                            mode: "lines",
                            line: {color: "blue"} 
                        },
                        {   x: graphData.ds,
                            y: graphData.yhatUpper,
                            name: `${formData.metric} forecast Upper`,
                            type: 'scatter',
                            mode: "lines",
                            line: {width: "0.5", color:'rgba(0, 4, 255,0.5)'},
                            fill:"tonexty"

                        },
                        {   x: graphData.ds,
                            y: graphData.yhatLower,
                            name: `${formData.metric} Forecast Lower`,
                            type: 'scatter',
                            mode: "lines",
                            line: {width: "0.5", color:'rgba(0, 102, 255,0.5)'},
                            fill:"tonexty"

                        },
                        {
                            x: graphData.ds,
                            y: graphData.y,
                            type: 'scatter',
                            mode: 'markers',
                            marker: {color: 'black'},
                            name: formData.metric
                        }
                        ]}

                        layout={ {autosize: true, title: formData.ticker} }

                        useResizeHandler={true} style={{ width: '100%',height:'100%' }}
                    />
                    {/* {console.log(graphData)} */}
                    </>
                    :
                    null
                }
            </>

            </Container>
            <Container style={{ marginTop: "100px", marginBottom:"50px"}}>
            <Form autoComplete="off" validated={validated} onSubmit={submit}>
            
            <Form.Group as={Row} className="mb-3"  controlId="formTicker">
                <Form.Label column sm="1" style={{ marginRight: "5px" }}>
                Ticker 
                </Form.Label>
                <Col sm="9">
                <Form.Control type="text" placeholder="eg. TSLA" autoComplete="none" name="ticker" defaultValue={formData.ticker} onChange={handleChange} required/>
                <Form.Control.Feedback type="invalid">Please enter a Stock Ticker.</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3"  controlId="formMetric">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Metric to analyse 
                </Form.Label>
                <Col sm="5">
                <Form.Select aria-label="Default select example" name="metric" defaultValue={formData.metric} onChange={handleChange} >
                        <option value="Close" >Closing price</option>
                        <option value="Open" >Opening price</option>
                        <option value="High" >Highest price</option>
                        <option value="Low" >Lowest price</option>
                    </Form.Select>
                </Col>
            </Form.Group>

            
            <Form.Group as={Row} className="mb-3" controlId="formChangePointPriorScale">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Changepoint Prior Scale 
                </Form.Label>
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" overlay={popover("Changepoint Prior Scale","Points in your data where there are sudden and abrupt changes in the trend, determines how much can the changepoints fit to the data.")}>
                <Form.Control type="number" placeholder="Between 10 to 30" max="99" min="1" maxLength="2" name="changePointPriorScale" defaultValue={formData.changePointPriorScale} onChange={handleChange} required />
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>
            

            <Form.Group as={Row} className="mb-3" controlId="formHolidaysPriorScale">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Holidays Prior Scale
                </Form.Label>
               
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" delay={{ show: 250, hide: 400 }} overlay={popover("Holidays Prior Scale","Determines how much of an effect holidays should have on your predictions")}>
                <Form.Control type="number" placeholder="Between 10 to 40" max="99" min="1" maxLength="2" name="holidaysPriorScale" defaultValue={formData.holidaysPriorScale} onChange={handleChange} required/>
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>
            
            
            <Form.Group as={Row} className="mb-3" controlId="formSeasonalityMode">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                    Sesonality Mode
                </Form.Label>
                <Col sm="5">
                    <OverlayTrigger trigger="focus" placement="left" overlay={popover("Seasonality Mode","Use additive when your seasonality trend should be “constant” over the entire period, else multiplicative")}>
                    <Form.Select aria-label="Default select example" name="seasonalityMode" defaultValue={formData.seasonalityMode} onChange={handleChange} >
                        <option value="Multiplicative" >multiplicative</option>
                        <option value="Additive" >additive</option>
                    </Form.Select>
                    </OverlayTrigger>

                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formSeasonalityPriorScale">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Sesonality Prior Scale
                </Form.Label>
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" overlay={popover("Seasonality Prior Scale","Determines how much seasonality is present in the data")}>
                <Form.Control type="number" placeholder="Between 10 to 25" max="99" min="1" maxLength="2" name="seasonalityPriorScale" defaultValue={formData.seasonalityPriorScale} onChange={handleChange} required/>
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formDailyFourierOrder">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Daily Seasonality Fourier Order
                </Form.Label>
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" overlay={popover("Daily Seasonality Fourier Order","Determines extent to which daily pattern is captured in the data")}>
                <Form.Control type="number" placeholder="From 10 to 25 and above" max="99" min="1" maxLength="2" name="dailySeasonalityFourierOrder" defaultValue={formData.dailySeasonalityFourierOrder} onChange={handleChange} required/>
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formWeeklyFourierOrder">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Weekly Seasonality Fourier Order
                </Form.Label>
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" overlay={popover("Weekly Seasonality Fourier Order","Determines extent to which weekly pattern is captured in the data")}>
                <Form.Control type="number" placeholder="From 10 to 25 and above" max="99" min="1" maxLength="2" name="weeklySeasonalityFourierOrder" defaultValue={formData.weeklySeasonalityFourierOrder} onChange={handleChange} required/>
                </OverlayTrigger><Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formMonthlyFourierOrder">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Monthly Seasonality Fourier Order
                </Form.Label>
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" overlay={popover("Monthly Seasonality Fourier Order","Determines extent to which monthly pattern is captured in the data")}>
                <Form.Control type="number" placeholder="From 10 to 25 and above" max="99" min="1" maxLength="2" name="monthlySeasonalityFourierOrder" defaultValue={formData.monthlySeasonalityFourierOrder} onChange={handleChange} required/>
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formYearlyFourierOrder">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Yearly Seasonality Fourier Order
                </Form.Label>
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" overlay={popover("Yearly Seasonality Fourier Order","Determines extent to which yearly pattern is captured in the data")}>
                <Form.Control type="number" placeholder="From 10 to 25 and above" max="99" min="1" maxLength="2" name="yearlySeasonalityFourierOrder" defaultValue={formData.yearlySeasonalityFourierOrder} onChange={handleChange} required/>
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formQuaterlyFourierOrder">
                <Form.Label column sm="5" style={{ marginRight: "5px" }}>
                Quaterly Seasonality Fourier Order
                </Form.Label>
                <Col sm="5">
                <OverlayTrigger trigger="focus" placement="left" overlay={popover("Quaterly Seasonality Fourier Order","Determines extent to which quaterly pattern is captured in the data")}>
                <Form.Control type="number" placeholder="From 10 to 25 and above" max="99" min="1" maxLength="2" name="quaterlySeasonalityFourierOrder" defaultValue={formData.quaterlySeasonalityFourierOrder} onChange={handleChange} required/>
                </OverlayTrigger>
                <Form.Control.Feedback type="invalid">Please enter a valid value.</Form.Control.Feedback>
                </Col>
            </Form.Group>


            <Button type="submit" disabled={loading}>Get Analysis</Button>
            
            </Form>
            </Container>


        </>
    );
}

export default Predict;