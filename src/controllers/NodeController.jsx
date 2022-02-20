import { rgb2lab, lab2rgb, deltaE } from 'rgb-lab';
import {Constants} from '../utils/Constants.jsx';
import {MathUtils} from '../utils/MathUtils.jsx';
import {generateName} from '../models/NameGenerator';

/* 
    This controller is mainly for controlling node to node interactions
*/

const computeLocalGrowthDecay = (boardSpot) => {
    let strRoll = MathUtils.getRandomIntInclusive(0, Constants.DEFINITE_SUCCESS * 2);
    if (boardSpot.culture.strength > Constants.DECAY_START && strRoll <= Constants.DEFINITE_FAIL && boardSpot.culture.initalRate > 0) {
        boardSpot.culture.initalRate = -boardSpot.culture.initalRate //reverse
    } else if (boardSpot.culture.strength < 100 || strRoll == Constants.DEFINITE_SUCCESS) {
        boardSpot.culture.initalRate = Math.abs(boardSpot.culture.initalRate);
    }

    let updatedStr = (boardSpot.culture.initalRate * (MathUtils.log(boardSpot.culture.logarithmicBase, boardSpot.culture.strength)));
    if (updatedStr > Constants.MAX_STRENGTH_ALLOWED) {
        boardSpot.culture.strength = Constants.MAX_STRENGTH_ALLOWED;
    } else if (updatedStr < Constants.MIN_STRENGTH_ALLOWED) {
        boardSpot.culture.strength = Constants.MIN_STRENGTH_ALLOWED;
    } else {
        boardSpot.culture.strength += updatedStr;
    }
}

const computeFriendlyNeighborInteraction = (boardSpot, neighborSpot) => {
    let roll = MathUtils.getRandomIntInclusive(0, Constants.MAX_STRENGTH_ALLOWED);

    // if (neighborSpot.culture.strength > Constants.DECAY_START && roll <= Constants.DEFINITE_FAIL * 5) {
    //     neighborSpot.culture.initalRate = -neighborSpot.culture.initalRate      //failed w friendly neighbor
    //     return;
    // } 

    // //if same nodes same 'team' both get stronger
    // if (boardSpot.culture.strength + Constants.MIN_STRENGTH_GAINED < Constants.MAX_STRENGTH_ALLOWED) {
    //     boardSpot.culture.strength = boardSpot.culture.strength + Constants.MIN_STRENGTH_GAINED;
    // }
    // if (neighborSpot.culture.strength + Constants.MIN_STRENGTH_GAINED < Constants.MAX_STRENGTH_ALLOWED) {
    //     neighborSpot.culture.strength = neighborSpot.culture.strength + Constants.MIN_STRENGTH_GAINED;
    // }

    if (boardSpot.political.name != neighborSpot.political.name  ){
        neighborSpot.political.name = boardSpot.political.name;
        neighborSpot.culture.color = boardSpot.culture.color;
        neighborSpot.culture.initalRate = boardSpot.culture.initalRate  
        searchBoard(neighborSpot);
    }
}

const computeEnemyNeighborInteraction = (boardSpot, neighborSpot) => {
    let roll = MathUtils.getRandomIntInclusive(0, Constants.MAX_STRENGTH_ALLOWED);
    let conflictRoll = boardSpot.culture.strength + roll / 5;

    if (conflictRoll >= neighborSpot.culture.strength) {    

        neighborSpot.culture.color = boardSpot.culture.color;                        //node success against neighbor
        neighborSpot.political.name = boardSpot.political.name;
        neighborSpot.culture.initalRate = Math.abs(boardSpot.culture.initalRate);
        boardSpot.culture.initalRate = Math.abs(boardSpot.culture.initalRate);

        if (boardSpot.culture.strength + Constants.MIN_STRENGTH_GAINED < Constants.MAX_STRENGTH_ALLOWED) {
            boardSpot.culture.strength = boardSpot.culture.strength * 1.1;
        }
                                                        //if node success, it takes over but loses some strength
        if (neighborSpot.culture.strength - 20 > Constants.MIN_STRENGTH_ALLOWED) {
            neighborSpot.culture.strength = boardSpot.culture.strength * 1.1;
        }

        searchBoard(neighborSpot, 50);

    } else {           
                                                                     //node fail against neighbor
        if (boardSpot.culture.strength - Constants.MIN_STRENGTH_GAINED > Constants.MIN_STRENGTH_ALLOWED) {
            boardSpot.culture.strength = boardSpot.culture.strength * 0.90;
        }
        if (neighborSpot.culture.strength + Constants.MIN_STRENGTH_GAINED > Constants.MAX_STRENGTH_ALLOWED) {
            neighborSpot.culture.strength = neighborSpot.culture.strength * 1.1;
        }

    }
}

const computeOffMapNeighborInteraction = (boardSpot, neighborSpot) => { 
    let roll = MathUtils.getRandomIntInclusive(0, Constants.DEFAULT_YNODE_SIZE);
                   
    if (roll < Constants.COLOR_DIFF && boardSpot.culture.strength < 500) { //approx how many spots will have offmap creations (roll/node size)

        let generatedColor = MathUtils.getRandomColor();
        boardSpot.political.name = generateName() + " offmap";
        // let colorDiff = 0;
        // while (colorDiff < 5) {
        //     generatedColor = getRandomColor();
        //     colorDiff = deltaE(rgb2lab([boardSpot.culture.color.r, boardSpot.culture.color.g, boardSpot.culture.color.b]), 
        //             rgb2lab([generatedColor.r, generatedColor.g, generatedColor.b]));
        // }
        boardSpot.color = generatedColor;

        boardSpot.culture.strength = MathUtils.normalDist_bm(Constants.MIN_STRENGTH_SPAWNED, Constants.MAX_STRENGTH_SPAWNED, 0.9);
        boardSpot.culture.initalRate = MathUtils.normalDist_bm(1.0001, 50, 0.25);
        boardSpot.culture.logarithmicBase =  MathUtils.normalDist_bm(2.0001, 25, 0.25);
    }
}

let visitedSearchHashMap = {};
const searchBoard = (boardStartSpot, searchRange) => { //BFS for different colors
    let queueNeighbors = [];
    queueNeighbors.push(boardStartSpot);
    visitedSearchHashMap[boardStartSpot.id] = 1;
    let searchCtr = 0;

    while (queueNeighbors.length != 0 && searchCtr < searchRange) {
        let currSpot = queueNeighbors.shift();
        searchCtr++;

        for (let neighborPosition in currSpot.neighbors) {
            let neighborSpot = currSpot.neighbors[neighborPosition];

            if (neighborSpot.id && !visitedSearchHashMap[neighborSpot.id] && 
                        boardStartSpot.political.name != neighborSpot.political.name) {
                visitedSearchHashMap[neighborSpot.id] = 1;

                let colorDiff = MathUtils.findColorDiff(currSpot.culture.color.r, currSpot.culture.color.g, currSpot.culture.color.b, 
                    neighborSpot.culture.color.r, neighborSpot.culture.color.g, neighborSpot.culture.color.b)

                if (colorDiff < Constants.COLOR_DIFF) {                                              //on map friendly neighbor
                    neighborSpot.political.name = currSpot.political.name;
                    neighborSpot.culture.color = currSpot.culture.color;
                    neighborSpot.culture.initalRate = Math.abs(neighborSpot.culture.initalRate);
                    queueNeighbors.push(neighborSpot);
                }
            }
        }

    }
    visitedSearchHashMap = {};
}

const findNeighbors = (boardSpot, neighborType) => {
    let friendlyArr = [];
    let enemyArr = [];

    for (let direction in boardSpot.neighbors) {
        let neighborSpot = boardSpot.neighbors[direction];
        if (neighborSpot.id) {     

            let colorDiff = deltaE(rgb2lab([boardSpot.culture.color.r, boardSpot.culture.color.g, boardSpot.culture.color.b]), 
            rgb2lab([neighborSpot.culture.color.r, neighborSpot.culture.color.g, neighborSpot.culture.color.b]));

            if (colorDiff < Constants.COLOR_DIFF || JSON.stringify(neighborSpot.culture.color) === JSON.stringify(boardSpot.culture.color)) { 
                friendlyArr.push(neighborSpot);
            } else {
                enemyArr.push(neighborSpot);
            }
        }
        
    }
    if (neighborType === 'friendly') {
        return friendlyArr;
    } else {
        return enemyArr;
    }
            // let friendlyArr = NodeController.findNeighbors(boardSpot, "friendly"); 
            // let enemyArr = NodeController.findNeighbors(boardSpot, "enemy"); 
            // for (let item of friendlyArr) {
            //     console.log(item)
            // }

}

export const NodeController = {
    findNeighbors,
    computeLocalGrowthDecay,
    computeFriendlyNeighborInteraction,
    computeOffMapNeighborInteraction,
    computeEnemyNeighborInteraction,
    searchBoard,

} 