import * as React from 'react';
import {coord, province} from '../models/SimulationModel.jsx';
import {generateName} from '../models/NameGenerator';
import {Constants} from '../utils/Constants.jsx';
import {MathUtils} from '../utils/MathUtils.jsx';
import { rgb2lab, lab2rgb, deltaE } from 'rgb-lab';
import {NodeController} from './NodeController.jsx'

//TODO generate log statements, both to each province and to general logger    

const generate1DBoardArr = () => {
    let board = new Array(Constants.DEFAULT_YNODE_SIZE);
    let combined1dboard = [];
    for (let i = 0; i < Constants.DEFAULT_YNODE_SIZE; i++) {
        board[i] = new Array(Constants.DEFAULT_XNODE_SIZE);
        for (let j = 0; j < Constants.DEFAULT_XNODE_SIZE; j++) { 
            board[i][j] = {x: i, y: j};
        }
        combined1dboard = [].concat(...board);
    }
    return combined1dboard;
    }

const initializeBoard = (boardToInitialize) => {
    let board = boardToInitialize;
    let ctr = 0;

    for (let i = 0; i < board.length; i++) { //i = row/y
        for (let j = 0; j < board[i].length; j++) {
            // let x = MathUtils.randomLand();
            let x = MathUtils.getRandomColor();

            let initialSetup = { //filled in later
                id: ctr++,
                name: generateName(),
                position: coord(j, i),
                neighbors: {
                    top: {},
                    bottom: {},
                    left: {},
                    right: {},
                }, 
                culture: {
                    name: generateName(),
                    strength: MathUtils.normalDist_bm(Constants.MIN_STRENGTH_SPAWNED, Constants.MAX_STRENGTH_SPAWNED, 0.9),
                    initalRate: MathUtils.normalDist_bm(1.0001, 50, 1.25),  //1-10
                    logarithmicBase: MathUtils.normalDist_bm(2.0001, 25, 1.25),// 1 < x < 7
                    // strength: getRandomIntInclusive(Constants.MIN_STRENGTH_SPAWNED, Constants.MAX_STRENGTH_SPAWNED),
                    // initalRate: getRandomFloatInclusive(1, 5),  //1-10
                    // logarithmicBase: getRandomFloatInclusive(2, 5),// 1 < x < 7
                    color: x,
                },
                political: {
                    name: generateName(),
                }
            }

            board[i][j] = province(initialSetup);
        }
    }

    for (let i = 0; i < board.length; i++) { //fill in neighbors
        for (let j = 0; j < board[i].length; j++) {
            if (i - 1 >= 0) { //top
                board[i][j].neighbors.top = board[i-1][j]//coord(i-1, j);
            }
            if (i + 1 < board.length) { //bottom
                board[i][j].neighbors.bottom = board[i+1][j];
            }
            if (j - 1 >= 0) { //left
                board[i][j].neighbors.left = board[i][j-1];
            }
            if (j + 1 < board[i].length) { //right
                board[i][j].neighbors.right = board[i][j+1];
            }
        }
    }
    return board;
}


const cycleMapXTimes = (times, board, setBoard, setStatus, setboardCycles, boardCycles, setWorking) => {
    setWorking(true);
    for (let i = 0; i < times; i++) {
        setTimeout(() => {
            setboardCycles(++boardCycles);
            setBoard([...cycleMapOnce(board, boardCycles)])
            setStatus("Total Cycles: " + boardCycles);
            if (i == (times-1)){
                setWorking(false);
            }
        }, i * Constants.DEFAULT_CYCLE_TIME); //timeout to see progression
    }
}

//this will cycle through the board once and apply effects/modifiers.....
const cycleMapOnce = (board, boardCycles) => {
    let visitedHashMap = {};
    let combinedShuffledArr = MathUtils.shuffle(generate1DBoardArr());

    for (let i = 0; i < combinedShuffledArr.length; i++) { //j = col/x
        let boardSpot = board[combinedShuffledArr[i].x][combinedShuffledArr[i].y];
        // console.log(shuffleBoard[i][j].x + " " + shuffleBoard[i][j].y)

        if (!visitedHashMap[boardSpot.id]){
            visitedHashMap[boardSpot.id] = 1;

            //randomize neighbors?
            // let positions = [];
            // if( Object.keys) {
            //     positions = Object.keys(boardSpot.neighbors);
            //     positions = shuffle(positions);
            // }
            // for (let direction in positions) {
            //     let neighborSpot = boardSpot.neighbors[positions[direction]];

            //config natural growth of node
            NodeController.computeLocalGrowthDecay(boardSpot);

            for (let direction in boardSpot.neighbors) {
                let neighborSpot = boardSpot.neighbors[direction];

                if (neighborSpot.id) {                                                              //on map neighbor
                    let roll = MathUtils.getRandomIntInclusive(0, Constants.MAX_STRENGTH_ALLOWED);
                    if (roll == Constants.DEFINITE_SUCCESS) {
                        neighborSpot.political.name = boardSpot.political.name;
                        neighborSpot.culture.color = boardSpot.culture.color;
                        neighborSpot.culture.strength += boardSpot.culture.strength;
                    }

                    let colorDiff = MathUtils.findColorDiff(boardSpot.culture.color.r, boardSpot.culture.color.g, boardSpot.culture.color.b, 
                                neighborSpot.culture.color.r, neighborSpot.culture.color.g, neighborSpot.culture.color.b)
                                                                                                    //on map friendly neighbor
                    if (colorDiff < Constants.COLOR_DIFF 
                        || boardSpot.political.name == neighborSpot.political.name
                        || boardSpot.culture.color == neighborSpot.culture.color) {                                 //same team neighbor              
                        NodeController.computeFriendlyNeighborInteraction(boardSpot, neighborSpot);

                    } else {
                        NodeController.computeEnemyNeighborInteraction(boardSpot, neighborSpot);
                    }

                } else if (!neighborSpot.id && (boardCycles % 25) == 1) {                           //off map neighbor
                    NodeController.computeOffMapNeighborInteraction(boardSpot, neighborSpot);
                }
            }
        } 
    }
    return board;
}

export {
    cycleMapOnce,
    cycleMapXTimes,
    initializeBoard,
}