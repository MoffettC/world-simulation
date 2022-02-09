import React, { useState } from 'react';
import {getRandomIntInclusive, getRandomColor, hexToRgb} from '../controllers/SimulationController.jsx';

//holds the data pattern for sim objects passed between viewer/controller

//Map, 2d array?
    //Province, obj in array?
        //Neighbor Provinces
        //Weather/season
        //Production
            //Staple goods
            //Luxury goods
        //Trade routes/partners?

const coord = (xPox, yPos) => {
    return {
        x: xPox,
        y: yPos
    }
}

const province = (args) => {
    return {
        id: args.id,
        name: args.name,
        color: args.color,
        position: args.position,
        neighbors: args.neighbors,
        strength: args.strength,
    }
}

// let board;
// const setBoard = (newboard) => {
//     board = newboard;
// }

const createBoard = (xSize, ySize) => {
    var board = new Array(xSize);
    for (var i = 0; i < board.length; i++) { //i = row/y
        board[i] = new Array(ySize);
    }
    return board;
}

export {
    createBoard,
    // board,
    // setBoard,
    province,
    coord
} 