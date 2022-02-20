const INDEX_PER_PIXEL = 4;
const DEFAULT_CYCLE_TIME = 0; //ms 1s = 1000;
const DEFAULT_CYCLE_AMT = 100;
const DEFAULT_YNODE_SIZE = 100;
const DEFAULT_XNODE_SIZE = 100; 

/*  
these should match the nodes produced in controller, ie how many pixels per node 
if nodes = 100 and canvasWidth = 200, it means 1/2 ratio of image shown because there
arent enough nodes to fill canvas size

probably preferred to set xnode/ynode size the same 
---size of the actual html component--- 
*/
const CANVAS_WIDTH = 100;    //html size
const CANVAS_HEIGHT = 100;   //html size

//how often to check for big events
const DEFAULT_GENERATION_CYCLE = 25; 

//opacity for nodes
const MINIMUM_OPACITY_VISIBILITY = 0.30;

//for rare events
const DEFINITE_SUCCESS = 100;
const DEFINITE_FAIL = 10;

const MAX_STRENGTH_ALLOWED = 20000;
const MIN_STRENGTH_ALLOWED = 5;
const MAX_STRENGTH_SPAWNED = 10000;
const MIN_STRENGTH_SPAWNED = 5;

const DECAY_START = 18000;
const GROWTH_START = 100;

const OFFMAP_STR_REQUIREMENT = 300;
const LOG_BASE_MIN = 1;
const LOG_BASE_MAX = 1;
const LOG_INITIAL_RATE_MIN = 1;
const LOG_INITIAL_RATE_MAX = 1;

/* 
    https://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js
    <=1     Not perceptible by human eyes
    1-2     Perceptible to close observation
    2-10    Perceptible at glance
    11-49   Colors are more similar than opposite
    100     Colors exact opposite
*/
const COLOR_DIFF = 10;

/*
required diff in str between nodes for a success to occur
*/
const MIN_DIFF_IN_STRENGTH = 10;

/*
when a node is successful against a diff node, it takes over but
the new nodes strength is weakened. when a node is unsuccessful 
against a diff node, it takes dmg in str
from the other node
*/
const MIN_STRENGTH_WEAKENED = 500;
const MIN_STRENGTH_GAINED = 500;

/*
max/min chance for offmap nodes to interact with border nodes
*/
const OFFMAP_CHANCE_MIN = 0;
const OFFMAP_CHANCE_MAX = 81;


export const Constants = {
    INDEX_PER_PIXEL,
    DEFAULT_XNODE_SIZE,
    DEFAULT_YNODE_SIZE,
    DEFAULT_CYCLE_TIME,
    DEFAULT_CYCLE_AMT,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    MAX_STRENGTH_ALLOWED,
    MINIMUM_OPACITY_VISIBILITY,
    MIN_STRENGTH_ALLOWED,
    DEFINITE_SUCCESS,
    DEFINITE_FAIL,
    MAX_STRENGTH_SPAWNED,
    MIN_STRENGTH_SPAWNED,
    DECAY_START,
    GROWTH_START,
    MIN_STRENGTH_GAINED,
    MIN_STRENGTH_WEAKENED,
    COLOR_DIFF,
}
