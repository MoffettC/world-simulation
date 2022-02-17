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
        position: args.position,
        neighbors: args.neighbors,
        culture: args.culture,
        political: args.political,
        economic: args.economic,
        resources: args.resources,
        climate: args.climate,
    }
}

const createBoard = (xSize, ySize) => {
    var board = new Array(ySize);
    for (var i = 0; i < board.length; i++) { //i = row/y
        board[i] = new Array(xSize);
    }
    return board;
}

export {
    createBoard,
    province,
    coord
} 