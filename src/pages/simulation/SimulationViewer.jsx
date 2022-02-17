import React,  { useState, useEffect, useRef, ReactDOM } from 'react';
import { Button, Col, Row, Form, OverlayTrigger, Tooltip, Overlay, Container, Popover} from 'react-bootstrap';
import SimModel from '../../models/SimulationModel.jsx';
import {Constants} from '../../utils/Constants.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import cssStyles from './SimulationViewer.module.css';
import { computeStyles } from '@popperjs/core';

export let canvasOffsetWidth; 
export let canvasOffsetHeight;

const SimView = (props) => {
    const [isHover, setHovered] = useState(false);
    const [canvas, setCanvas] = useState(null);
    const [context, setContext] = useState(null);
    const [currNode, setCurrNode] = useState(null);
    const [referenceElement, setReferenceElement] = useState(null);

    const [mouseX, setMouseX] = useState(null);
    const [mouseY, setMouseY] = useState(null);

    // useEffect uses the callbacks when state changes
    useEffect(()=>{
        setCanvas(document.getElementById("canvas"));
    }, []); //watches empty var, activate once

    useEffect(() => { 
        if (currNode) {
            setHovered(true);
            console.log(currNode.name);
        } else {
            setHovered(false);
        }
    }, [currNode]); 

    useEffect(() => { 
        updateMap();
    }, [{...props.simboard}]); 

    useEffect(() => {
        if (canvas) {
            setContext(canvas.getContext('2d'));
            canvasOffsetWidth = canvas.offsetWidth;
            canvasOffsetHeight = canvas.offsetHeight;
    
            canvas.addEventListener('mousemove', function(event) {
                displayNodeInfo(event);
            });
            canvas.addEventListener('mouseout', function(event) {
                hideNodeInfo(event);    
            });
        }
    }, [canvas]); 

    const displayNodeInfo = (event) => {
        let rect = canvas.getBoundingClientRect();
        //converts to css pixels
        let x = Math.round(event.clientX - rect.left)-2;
        let y = Math.round(event.clientY - rect.top)-2;

        setMouseX(x);
        // setMouseY(y - 200); 
        // setMouseX(x + 50);
        setMouseY(y - 400); //arbitrary, need to adjust

        let xOffsetRatio = Constants.CANVAS_WIDTH / canvasOffsetWidth;
        let yOffsetRatio = Constants.CANVAS_HEIGHT / canvasOffsetHeight;

        const board = props.simboard;
        let findX = Math.round((x * xOffsetRatio) * (Constants.DEFAULT_XNODE_SIZE / Constants.CANVAS_WIDTH));
        let findY = Math.round((y * yOffsetRatio) * (Constants.DEFAULT_YNODE_SIZE / Constants.CANVAS_HEIGHT));

        if (findX < board.length && findY < board[0].length){
            setCurrNode(board[findY][findX]);
        }
    }

    const hideNodeInfo = (event) => {
        setHovered(false);
    }

    const updateMap = () => {
        if (context) {
            let img = context.getImageData(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
            props.simboard.map(function (row, rowId) {
                row.map((col, colId) => { 
                        draw(img, col);
                });
            });
            context.putImageData(img, 0, 0);
        }
    }

    const draw = (img, col) => {
        let opacityVal = (col.culture.strength / Constants.MAX_STRENGTH_ALLOWED) + Constants.MINIMUM_OPACITY_VISIBILITY;
        if (opacityVal > 0.85) {
            opacityVal = 0.85;
        }

        let pixels = img.data;
        var x = Math.round((col.position.x / Constants.CANVAS_WIDTH) * Constants.CANVAS_WIDTH);
        var y = Math.round((col.position.y / Constants.CANVAS_HEIGHT) * Constants.CANVAS_HEIGHT);
        var off = (y * Constants.CANVAS_WIDTH + x) * 4;
        
        if (isHover && currNode.position.x == col.position.x && currNode.position.y == col.position.y) {          //selected
            pixels[off]     = 255;
            pixels[off + 1] = 255;
            pixels[off + 2] = 255;
            pixels[off + 3] = 255;
        } else if (isHover && currNode.political.name == col.political.name && col.culture.initalRate < 0) {   //decaying
            pixels[off]     = 0;
            pixels[off + 1] = 0;
            pixels[off + 2] = 0;
            pixels[off + 3] = 255;
        } else if (isHover && currNode.political.name == col.political.name) {                                 //growing
            pixels[off]     = 220;
            pixels[off + 1] = 220;
            pixels[off + 2] = 220;
            pixels[off + 3] = 255;
        } else {
            pixels[off]     = col.culture.color.r;
            pixels[off + 1] = col.culture.color.g;
            pixels[off + 2] = col.culture.color.b;
            pixels[off + 3] = opacityVal * 255;
        }
    }

    return (
        <div style={{marginTop: '20px', marginBottom: '30px', 
                    display: 'grid', fontSize: 'small', justifyContent: 'center',}}> 
            <Overlay target={referenceElement} show={isHover} >
                {(props) => {
                    if (props.style.transform) {
                        let currStyle = {
                            ...props.style
                        }
                        let adjustedPosStyle = {
                            transform: "translate3d(" + mouseX + "px, " + mouseY + "px, 0)",
                            padding: '5px',
                            border: 'thin',
                            backgroundColor: 'grey'
                        }
                        props.style  = {...currStyle, ...adjustedPosStyle}
                    }

                    return (
                    <Popover id="overlay" 
                        {...props}>
                            {"Information: "}<br></br>
                            {"Id: " + currNode.id}<br></br>
                            {"Name: " + currNode.political.name}<br></br> 
                            {"Pos: " + currNode.position.x + " " + currNode.position.y}<br></br>
                            {"Culture Color: " + currNode.culture.color.r + " " + currNode.culture.color.g + " " + currNode.culture.color.b + " "}<br></br> 
                            {"Culture Power: " + Math.round(currNode.culture.strength)}<br></br>
                            {"Culture Rate: " + Math.round(currNode.culture.initalRate)}<br></br>
                    </Popover>
                    )
                }}
            </Overlay>

            <canvas 
            id='canvas'
            ref={setReferenceElement}
            style={{border: '5px dashed black'}}
            className={cssStyles.canvas}
            width={Constants.CANVAS_WIDTH}
            height={Constants.CANVAS_HEIGHT}/>
        </div>
    )
}
  
export {
    SimView
}