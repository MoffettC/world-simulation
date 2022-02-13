import React,  { useState, useEffect, useRef, ReactDOM } from 'react';
import { Button, Col, Row, Form, OverlayTrigger, Tooltip, Overlay, Container, } from 'react-bootstrap';
// import { Button, Col, Form, OverlayTrigger, Tooltip, Overlay } from 'bootstrap';
import {hexToRgb, getRandomColor} from '../../controllers/SimulationController.jsx';
import SimModel from '../../models/SimulationModel.jsx';
import {Constants} from '../../utils/Constants.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import cssStyles from './SimulationViewer.module.css';

/*  these should match the nodes produced in controller, ie how many pixels per node 
if nodes = 100 and canvasWidth = 200, it means 1/2 ratio of image shown because there
arent enough nodes to fill canvas size
---size of the actual html component--- */
export const canvasWidth = 200; 
export const canvasHeight = 200;
export let canvasOffsetWidth; 
export let canvasOffsetHeight;

const UpdatedMap = (props) => {
    const [isHover, setHovered] = useState(false);
    const [canvas, setCanvas] = useState(null);
    const [context, setContext] = useState(null);
    const [currNode, setCurrNode] = useState(null);
    const [referenceElement, setReferenceElement] = useState(null);

    // useEffect uses the callbacks when state changes
    useEffect(()=>{
        setCanvas(document.getElementById("canvas"));
    }, []); //watches empty var, activate once

    useEffect(() => { 
        if (currNode) {
            setHovered(true);
        } else {
            setHovered(false);
        }
    }, [currNode]); 

    useEffect(() => {
        if (canvas) {
            setContext(canvas.getContext('2d'));
            canvasOffsetWidth = canvas.offsetWidth;
            canvasOffsetHeight = canvas.offsetHeight;
    
            canvas.addEventListener('mousemove', function(event) {
                displayNodeInfo(event, 'red');
            });
            canvas.addEventListener('mouseout', function(event) {
                hideNodeInfo(event);
            });
        }
    }, [canvas]); 

    const displayNodeInfo = (event) => {
        let rect = canvas.getBoundingClientRect();
        //converts to css pixels
        let x = Math.round(event.clientX - rect.left);
        let y = Math.round(event.clientY - rect.top);
        // console.log("Coordinate x: " + x, "Coordinate y: " + y);

        let xOffsetRatio = canvasWidth / canvasOffsetWidth;
        let yOffsetRatio = canvasHeight / canvasOffsetHeight;

        const board = props.simboard;
        let findX = Math.round((x * xOffsetRatio) * (400 / canvasWidth));
        let findY = Math.round((y * yOffsetRatio) * (400 / canvasHeight));

        if (findX < board.length && findY < board[0].length){
            setCurrNode(board[findX][findY]);
        } else {
            console.log("OUT: " + findX + " " + findY)
        }
    }

    const hideNodeInfo = (event) => {
        setHovered(false);
    }

    const draw = (img, col) => {
        let opacityVal = col.strength / 100;
        let pixels = img.data;
        var x = Math.round((col.position.x/canvasWidth) * canvasWidth);
        var y = Math.round((col.position.y/canvasHeight) * canvasHeight);
        var off = (y * img.width + x) * 4;
        pixels[off] = col.color.r;
        pixels[off + 1] = col.color.g;
        pixels[off + 2] = col.color.b;
        pixels[off + 3] = (opacityVal * 255);
    }

    if (context) {
        let img = context.getImageData(0, 0, canvasWidth, canvasHeight);
        props.simboard.map(function (row, rowId) {
            row.map((col, colId) => { 
                    draw(img, col);
            });
        });
        context.putImageData(img, 0, 0);
    }

    return (
        <div style={{marginTop: '20px', display: 'grid', fontSize: 'small', justifyContent: 'center',}}> 
            <Overlay target={referenceElement} show={isHover} placement="right" >
                {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        {"Information: "}<br></br>
                        {"Id: " + currNode.id}<br></br>
                        {"Name: " + currNode.name}<br></br> 
                        {"Pos: " + currNode.position.x + " " + currNode.position.y}<br></br>
                        {"Str: " + currNode.strength}<br></br>
                    </Tooltip>
                )}
            </Overlay>

            <canvas 
            id='canvas'
            ref={setReferenceElement}
            className={cssStyles.canvas}
            width={canvasWidth}
            height={canvasHeight}/>
        </div>
    )
}
  
export {
    UpdatedMap
}