import React, { useState } from 'react';
import { Button, Col, Row, Form, OverlayTrigger, Tooltip, Overlay,Container, } from 'react-bootstrap';
import logo from '../img/logo.svg';
import styles from './App.module.css';
import {UpdatedMap} from './simulation/SimulationViewer.jsx';
import {createBoard} from '../models/SimulationModel.jsx';
import {initializeBoard, cycleMapOnce, cycleMapXTimes} from '../controllers/SimulationController.jsx';

const App = function App() {
  const [board, setBoard] = useState();
  const [isBoardCreated, setBoardCreated] = useState(false);
  const [boardCycles, setboardCycles] = useState(0);
  const [status, setStatus] = useState('');
  const [isWorking, setWorking] = useState(false);

  const defaultXSize = 50;
  const defaultYSize = 50;
  const defaultCycleAmt = 25;

  const createAndInitializeBoard = (x, y, setBoard) => {
    let board = createBoard(x, y);
    board = initializeBoard(board);
    board = cycleMapOnce(board);
    setBoard(board);
  }

  const onStart = (e) => {
    createAndInitializeBoard(defaultXSize, defaultYSize, setBoard);
  }

  const onCycle = (e) => {
    setStatus("Processing...");
    cycleMapXTimes(defaultCycleAmt, board, setBoard, setStatus, setboardCycles, boardCycles, setWorking)
  }

  {/* create simModel, board store it as state obj here? 
      then pass between viewer/controller?
  */}
  if (!isBoardCreated) {
    createAndInitializeBoard(defaultXSize, defaultYSize, setBoard);
    setBoardCreated(true);
  }

  {/* launches simController, pass simModel as prop to do calc on */}
  {/* return processed simModel from simController  */}

  return (

    <div className={styles.app} >
      <header className={styles.header}
              style={{justifyContent: 'center', display: 'grid'}}>
          <div>
            <img src={logo} className={styles.logo} alt="logo" />
          </div>
          <p>
            Beginning of something cool?&nbsp;
          </p>
      </header>
      <Button style={{margin: '5px', fontSize: 'x-small'}} 
              onClick={(e) => onStart()}> Press to recreate map </Button>
      {isWorking ? 
        <Button disabled style={{margin: '5px', fontSize: 'x-small',}} 
        onClick={(e) => onCycle()}> Press to cycle map </Button>
        :
        <Button style={{margin: '5px', fontSize: 'x-small',}} 
                onClick={(e) => onCycle()}> Press to cycle map </Button>
      }
      {/*
          maybe inputs for x number cycles?
          log output somewhere
      */}

      {/* pass processed simModel into simViewer */}
      <UpdatedMap simboard={board}> </UpdatedMap>

      <footer>&nbsp;{status}</footer>
    </div>
  );
}

export default App;
