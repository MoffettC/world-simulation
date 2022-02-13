import React,  { useState, useEffect, useRef, ReactDOM } from 'react';
import { Button, Col, Row, Form, OverlayTrigger, Tooltip, Overlay,Container, } from 'react-bootstrap';
// import { Button, Col, Form, OverlayTrigger, Tooltip, Overlay } from 'bootstrap';
import {hexToRgb, getRandomColor} from '../../controllers/SimulationController.jsx';
import SimModel from '../../models/SimulationModel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import styles from './SimulationViewer.module.css';

let isProcessed = false;
const SCALE = 0.1;
const OFFSET = 0;

/*  these should match the nodes produced in controller, ie how many pixels per node 
if nodes = 100 and canvasWidth = 200, it means 1/2 ratio of image shown because there
arent enough nodes to fill canvas size
---size of the actual html component--- */
export const canvasWidth = 200; 
export const canvasHeight = 200;

const UpdatedMap = (props) => {
    const [context, setContext] = useState();

    function pick(event, destination) {
        var x = event.layerX;
        var y = event.layerY;
        console.log(x + " " + y);

      }

    useEffect(()=>{
        const canvas = document.getElementById("canvas");
        setContext(canvas.getContext('2d'));

        canvas.addEventListener('mousemove', function(event) {
            pick(event, 'red');
        });

        isProcessed = true;
    }, []);

    const draw = (id, col) => {
        let opacityVal = col.strength / 100;
        let pixels = id.data;
        var x = Math.round((col.position.x/canvasWidth) * canvasWidth);
        var y = Math.round((col.position.y/canvasHeight) * canvasHeight);
        var off = (y * id.width + x) * 4;
        pixels[off] = col.color.r;
        pixels[off + 1] = col.color.g;
        pixels[off + 2] = col.color.b;
        pixels[off + 3] = (opacityVal * 255);

    }
    if (context) {
        let id = context.getImageData(0, 0, canvasWidth, canvasHeight);
        props.simboard.map(function (row, rowId) {
            row.map((col, colId) => { 
                    draw(id, col);
            });
        });
        context.putImageData(id, 0, 0);
    }

    return (
        <div style={{marginTop: '20px', display: 'grid', fontSize: 'small', justifyContent: 'center',}}> 
            <canvas 
            id='canvas'
            className={styles.canvas}
            width={canvasWidth}
            height={canvasHeight}/>
        </div>
    )

    return (
        <div style={{marginTop: '20px', display: 'grid', fontSize: 'small'}}>   {/* entire board */}
            {
                props.simboard.map(function (row, rowId) {
                    return (
                        <div style={{justifyContent: 'center',
                                    lineHeight: '0',}}
                             key={rowId}>                                       {/* each row*/}
                            {
                                row.map((col, colId) => {                       {/* each col*/}

                                    let opacityVal = col.strength / 100;
                                    let backgroundColor = 'rgba(' + col.color.r + ',' + col.color.g + ',' + col.color.b + ',' + opacityVal + ')'
                                    let backgroundInfoColor = 'rgba(' + col.color.r + ',' + col.color.g + ',' + col.color.b + ',' + 0.8 + ')'

                                    return ( 
                                        <OverlayTrigger
                                            key={col.id + "overlay"}
                                            placement="right"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={
                                                <div 
                                                    className="rounded border border-primary"
                                                    style={{ 
                                                        background: 'lightGray', 
                                                        fontSize: 'smaller',
                                                        padding: '4px',
                                                        // borderRadius: '3px',
                                                        // width: '10%',
                                                        // height: '10%', 
                                                    }}> 
                                                        {"Id: " + col.id}<br></br>
                                                        {"Name: " + col.name}<br></br> 
                                                        {"Pos: " + col.position.x + " " + col.position.y}<br></br>
                                                        {"Str: " + col.strength}<br></br>
                                                </div>
                                            }>
 
                                        <div    className="rounded border border-dark"
                                                key={col.id} 
                                                // xs={{span: 1, offset: 0}}
                                                style={{display: 'inline-block', 
                                                        background: backgroundColor, 
                                                        width: '10px',
                                                        height: '10px', 
                                                }}>
                                        </div>
                                        </OverlayTrigger>
                                    );
                                }) //end row.map
                            }       
                        </div>
                    );
                }) //end simboard.map
            }    
        </div>       
    );
}
  
export {
    UpdatedMap
}