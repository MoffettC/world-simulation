import React, { useState } from 'react';
import { Button, Col, Row, Form, OverlayTrigger, Tooltip, Overlay,Container, } from 'react-bootstrap';
import logo from '../img/logo.svg';
import styles from './App.module.css';
import {SimView} from './simulation/SimulationViewer.jsx';
import {createBoard} from '../models/SimulationModel.jsx';
import {initializeBoard, cycleMapOnce, cycleMapXTimes} from '../controllers/SimulationController.jsx';
import {Constants} from '../utils/Constants.jsx';

const App = function App() {
  const [board, setBoard] = useState();
  const [isBoardCreated, setBoardCreated] = useState(false);
  const [boardCycles, setboardCycles] = useState(0);
  const [status, setStatus] = useState('');
  const [isWorking, setWorking] = useState(false);

  const createAndInitializeBoard = (x, y, setBoard) => {
    let board = createBoard(x, y);
    board = initializeBoard(board);
    board = cycleMapOnce(board);
    setBoard(board);
  }

  const onRestart = (e) => {
    createAndInitializeBoard(Constants.DEFAULT_XNODE_SIZE, Constants.DEFAULT_YNODE_SIZE, setBoard);
  }

  const onCycle = (e) => {
    setStatus("Processing...");
    cycleMapXTimes(Constants.DEFAULT_CYCLE_AMT, board, setBoard, setStatus, setboardCycles, boardCycles, setWorking)
  }

  {/* create simModel, board store it as state obj here? 
      then pass between viewer/controller?
  */}
  if (!isBoardCreated) {
    createAndInitializeBoard(Constants.DEFAULT_XNODE_SIZE, Constants.DEFAULT_YNODE_SIZE, setBoard);
    setBoardCreated(true);
  }


  return (
    <div className={styles.app} >
      <Container>
        <Row>
          <header className={styles.header}
                  style={{justifyContent: 'center', display: 'grid'}}>
              <div>
                <img src={logo} className={styles.logo} alt="logo" />
              </div>
              <p>
                Beginning of something cool?&nbsp;
              </p>
          </header>
        </Row>
        <Row>
          <Col>
            <Button style={{margin: '5px', fontSize: 'x-small'}} 
                  onClick={(e) => onRestart()}> Press to recreate map </Button>
            {isWorking ? 
              <Button disabled style={{margin: '5px', fontSize: 'x-small',}} 
              onClick={(e) => onCycle()}> Press to cycle map </Button>
              :
              <Button style={{margin: '5px', fontSize: 'x-small',}} 
                      onClick={(e) => onCycle()}> Press to cycle map </Button>
            }
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={4} >
            <div style={{fontSize: '0.7em'}}>
              Each color represents a tribe. Mouse over a color to see tribe area.&nbsp;
              White squares mean growth, black squares mean decay.&nbsp;
              Darker opacity means stronger tribe power&nbsp;
            </div>
          </Col>
        </Row>
        {/*
            maybe inputs for x number cycles?
            log output somewhere
        */}
        <Row>
          <SimView simboard={board}> </SimView>
        </Row>

        <footer>&nbsp;{status}</footer>
      </Container>
    </div>
  );
}

export default App;
