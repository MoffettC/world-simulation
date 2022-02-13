import * as React from 'react';
import {board, coord, province} from '../models/SimulationModel.jsx';


//heavy part, most logic will go here to compute world sim

//map generator func, generates initial state of map

//func that iterates over map and adjusts/adds/subs effects and applies modifiers to each province
    //sub functions for each effect/modifier

//generate log statements, both to each province and to general logger    


const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

const getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// find Euclidian distance from the pixel color to the specified color 
const colorDistance = (aRed,aGreen,aBlue,bRed,bGreen,bBlue) => {
    let diffR,diffG,diffB;

    // distance to color
    diffR=( aRed - bRed );
    diffG=( aGreen - bGreen );
    diffB=( aBlue - bBlue );
    return(Math.sqrt(diffR*diffR + diffG*diffG + diffB*diffB));
}

const randomLand = () => {
        let val = getRandomIntInclusive(1, 99);
        if (val < 30) {
            return hexToRgb('#F0FFFF'); //light blue
        } else {
            return hexToRgb('3caa13'); //dark green
        }
        // return hexToRgb(getRandomColor())
}

const initializeBoard = (boardToInitialize) => {
    let board = boardToInitialize;
    let ctr = 0;

    for (let i = 0; i < board.length; i++) { //i = row/y
        for (let j = 0; j < board[i].length; j++) {
            let x = randomLand();
            let initialSetup = { //filler info for now
                id: ctr++,
                color: x,
                name: 'x' + j + 'y' + i,
                position: coord(j, i),
                neighbors: {
                    top: {},
                    bottom: {},
                    left: {},
                    right: {},
                }, //will go back and fill in after initialization,
                strength: getRandomIntInclusive(20, 99),
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
    setBoard([...cycleMapOnce(board)]); //immediate
    setStatus("Processing cycle: " + (1) + " Total Cycles: " + boardCycles);
    setboardCycles(++boardCycles);
    setWorking(true);

    for (let i = 1; i < times; i++) {
        setTimeout(() => {
            setboardCycles(++boardCycles);
            setBoard([...cycleMapOnce(board)])
            if (i == (times-1)){
                setStatus("Completed cycle(s): " + (i+1) + " Total Cycles: " + boardCycles);
                setWorking(false);
            } else {
                setStatus("Processing cycle: " + (i+1) + " Total Cycles: " + boardCycles);
            }
        }, i * 250); //timeout to see progression
    }
}

let visitedHashMap = {};
const cycleMapOnce = (board) => {
    for (let i = 0; i < board.length; i++) { //i = row/y
        for (let j = 0; j < board[i].length; j++) {
            let boardSpot = board[i][j];

            if (!visitedHashMap[boardSpot.id]){
                visitedHashMap[boardSpot.id] = 1;
                    //this will cycle through the board once and apply effects/modifiers.....
                for (let neighborPosition in boardSpot.neighbors) {
                    let neighborSpot = boardSpot.neighbors[neighborPosition];

                    if (neighborSpot.id && neighborSpot.color != boardSpot.color) { //on map neighbors
                        let roll = getRandomIntInclusive(0, 100);
                         if (roll <= boardSpot.strength || roll == 100) {
                            neighborSpot.color = boardSpot.color;
                            neighborSpot.name = boardSpot.name;

                            if (neighborSpot.strength - 10 > 30) {
                                neighborSpot.strength = neighborSpot.strength - 10;
                            }
                            // visitedHashMap[neighborSpot.id] = 1;
                        } else {

                            if (boardSpot.strength + 10 < 99) {
                                boardSpot.strength = boardSpot.strength + 10;
                            }
                            // boardSpot.color = neighborSpot.color
                            // boardSpot.name = neighborSpot.name
                        }

                    } else if (!neighborSpot.id) {                                  //off map neighbor
                        let roll = getRandomIntInclusive(0, 81);
                        let x = randomLand();
                        if (roll > boardSpot.strength) {
                            boardSpot.color = x;
                            boardSpot.strength = roll;
                        }
                    }
                }

            } else {
                continue;
            }
        }
    }
    visitedHashMap = {};
    return board;
}

const searchBoard = (boardStartSpot, board) => { //BFS for different colors
    let queueNeighbors = [];
    queueNeighbors.push(boardStartSpot);

    while (queueNeighbors.length != 0) {
        let currSpot = queueNeighbors.shift();

        for (let neighborPosition in currSpot.neighbors) {
            let neighborSpot = currSpot.neighbors[neighborPosition];
            if (neighborSpot.id && neighborSpot.color != currSpot.color) {
                queueNeighbors.push(neighborSpot);
            }
        }

    }

    return board
}


export {
    getRandomIntInclusive,
    rgbToHex,
    hexToRgb,
    getRandomColor,
    cycleMapOnce,
    cycleMapXTimes,
    initializeBoard,
}