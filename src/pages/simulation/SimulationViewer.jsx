import * as React from 'react';
import { Button, Col, Row, Form, OverlayTrigger, Tooltip, Overlay,Container, } from 'react-bootstrap';
// import { Button, Col, Form, OverlayTrigger, Tooltip, Overlay } from 'bootstrap';
import {hexToRgb, getRandomColor} from '../../controllers/SimulationController.jsx';
import SimModel from '../../models/SimulationModel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

//viewer, will display simulation map
    //another obj to generate each individual province in array?

//also may need modal for pop up log of each province?

//should take simmodel as props?
const UpdatedMap = (props) => {

    // const styles = {
    //     backgroundSquare: {
    //       height: '100%',
    //       width: '100%',
    //       backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //     }
    // }

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