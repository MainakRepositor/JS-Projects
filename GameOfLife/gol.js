// === CONSTANTS ===

// canvases and other elements
const game_cvs = document.getElementById("game_cnv");
const game_ctx = game_cvs.getContext("2d");
const chart_cvs = document.getElementById("chart_cnv");
const chart_ctx = chart_cvs.getContext("2d");
const data_cvs = document.getElementById("data_cnv");
const data_ctx = data_cvs.getContext("2d");


// unit of measure
const unit = 4;

// base values
const matrix_side_length = 160;


// === INPUT VARIABLES ===
let populate_chance;
let time_per_gen;


// === RUNTIME VARIABLES ===
let game_interval;
let generation;
let live_cells;


// === GAME INIT ===

// creates empty matrix
function get_empty_matrix(side_length){

    var matrix = new Array(side_length);
    for (i = 0; i < matrix.length; i++){
        matrix[i] = new Array(side_length);
    }
    return matrix;
}

// game matrix
var matrix = get_empty_matrix(matrix_side_length);
let new_gen_matrix;

function init_matrix(){
    for (i = 0; i < matrix_side_length; i++){
        for (j = 0; j < matrix_side_length; j++){
            if(Math.random() < populate_chance){
                matrix[i][j] = 1;
            } else {
                matrix[i][j] = 0;
            }
        }
    }
}




// === GAME WORKINGS ===

// Conway's Game of Life ruleset:
// 1. Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure[1]).
// 2. Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).
// 3. Any live cell with two or three live neighbours lives, unchanged, to the next generation.
// 4. Any dead cell with exactly three live neighbours will come to life.
// "live cell" is represented as a "1" in the matrix
// "dead cell" is represented as a "0" in the matrix

// returns cell's alive status
function is_live_cell(i,j){
    return matrix[i][j] == 1;
}

// updates a single cell
function update_cell(i,j){

    // counts cell's alive neighbours
    var neighbours = 0;

    // iterate over all neighbours
    for (i_in = i-1; i_in <= i+1; i_in++){
        for (j_in = j-1; j_in <= j+1; j_in++){

            // skip out of matrix indexes
            if (i_in < 0 || j_in < 0){
                continue;
            }
            if (i_in >= matrix_side_length || j_in >= matrix_side_length){
                continue;
            }
            
            // skip current cell
            if (i_in == i && j_in == j){
                continue;
            }

            // check neighboor status, increment count if alive
            if (is_live_cell(i_in,j_in)){
                neighbours++;
            }

            // update this cell
            if(is_live_cell(i,j)){
                // rule 1
                if(neighbours < 2){
                    new_gen_matrix[i][j] = 0;
                // rule 2
                } else if (neighbours > 3){
                    new_gen_matrix[i][j] = 0;
                // rule 3
                } else {
                    new_gen_matrix[i][j] = 1;
                }
            } else {
                // rule 4
                if (neighbours == 3){
                    new_gen_matrix[i][j] = 1;
                } else {
                    new_gen_matrix[i][j] = 0;
                }
            }

        }
    } 

}


// updates all cells
function update_all(){

    // initiates new matrix
    new_gen_matrix = get_empty_matrix(matrix_side_length);
    var new_live_cells = 0;

    // updates all cells
    for (i = 0; i < matrix_side_length; i++){
        for (j = 0; j < matrix_side_length; j++){
           update_cell(i,j);
           // if the cell is alive in next generation, increment live cells amount
           if(new_gen_matrix[i][j]==1){
                new_live_cells++;
           }
        }
    }   

    // replaces old matrix with the new one
    matrix = new_gen_matrix;   

    // increment generation
    generation++;

    // update live cells
    live_cells = new_live_cells;
}

// === GAME DISPLAY ===

// clears game canvas
function clear_game_canvas(){
    game_ctx.clearRect(0,0,unit*matrix_side_length,unit*matrix_side_length)
}

// draws current state of matrix
function disp_curr_game_state(){
    game_ctx.fillStyle = "yellow" ;
    for (i = 0; i < matrix_side_length; i++){
        for (j = 0; j < matrix_side_length; j++){
            if( matrix[i][j] == 1 ){
                game_ctx.fillRect(i*unit, j*unit, unit, unit); 
            }
        }
    }  
}



// === DATA DISPLAY ===


// clears data canvas
function clear_data_canvas(){
    data_ctx.clearRect(0,0,110,80)
}

// draws current state of game data
function disp_curr_data_state(){
    data_ctx.fillStyle = "lightgreen" ;
    data_ctx.font = "16px Arial";
    data_ctx.fillText('Living Cells:',5,18);
    data_ctx.fillText(live_cells,5,36);
    data_ctx.fillText('Geneation:',5,54);
    data_ctx.fillText(generation,5,72);
}



// === CHART DISPLAY ===

// constants
const chart_max_value = 6000;
const gens_per_display = 5;
const gridX_spacing = 100/gens_per_display;
const gridY_spacing = 80/6;


// draws chart grid
function init_chart_grid(){
    chart_ctx.fillStyle = "skyblue" ;
    // vertical lines
    for(i = 0; i < 520; i+=gridX_spacing){
        chart_ctx.fillRect(i,0,1,80);
    }
    // horisontal lines
    for(i = gridY_spacing; i < 80; i+=gridY_spacing){
        chart_ctx.fillRect(0,i,520,1);
    }
}

// clears chart canvas
function clear_chart_canvas(){
    chart_ctx.clearRect(0,0,520,80)
    init_chart_grid();
}

// draws current state of matrix
function draw_to_chart(){
    chart_ctx.fillStyle = "red" ;
    var height = live_cells/chart_max_value * 80;
    chart_ctx.fillRect(generation/gens_per_display, 80-height,1,80);
}




// draw current state to the canvas
function contDraw(){

    clear_game_canvas();
    disp_curr_game_state();  

    clear_data_canvas();
    disp_curr_data_state();

    draw_to_chart();

    update_all();
}


// starts the game
function run_game_of_life(vgen, gen_per_sec){

    // clears existing interval (othervise restarting the game would speed it up)
    clearInterval(game_interval);

    // set input values
    populate_chance = vgen;
    time_per_gen = 1000/gen_per_sec;

    // reset state values
    generation = 1;
    live_cells = 0;
    clear_chart_canvas();

    // init
    init_matrix();
    disp_curr_game_state();
    init_chart_grid();

    // call draw function every {time_per_gen} ms
    game_interval = setInterval(contDraw,time_per_gen);
}






