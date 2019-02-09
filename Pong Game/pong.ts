// FIT2102 2018 Assignment 1
/** 
 * Nabil Ahmed
 * ID: 25364170
 */
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing
/**
 * This file contains the main function pong.All of the work is done in here except for a few commands which are
 * shown in the pong.html file
 * The program contain two main functions:  1. mid_line   2.ball
 * 1.mid_line is a very simple function that creates a barrier in the middle of the canvas
 * 2.ball is the main function. It contains all the observables and functionality.
 * The ball function has 3 main (svg) elements operating on it. They are named:
 * 1. MousePaddle 
 * 2. Ball
 * 3. Cpu_paddle
 * All of these elements are created by using the rect shape
 * Their functionality:
 * MousePaddle : This is the mouse that is on the right side of the canvas.
 * It is operated by the mousemove event. 
 * Ball: The ball moves in the direction given by the x and y direction
 * Whenever it touches the MousePaddle or Cpu_paddle it changes direction.
 * Whenever it touches the y-axis at x = 0 || x = 600 then it updates the score. 
 * Whenever it touches the x-axis at y = 0 || y = 600 then it again changes the direction.
 * Cpu_paddle: The cpu paddle moves in the y direction.
 * It is situated on the left hand side of the canvas.
 * It follows the co-ordinates of the ball. And moves itself. 
 */

function mid_line(){
  /**
   * This function creates a middle line in the canvas  
   * This is just there for design purposes.
   * It does not interract with the game functionality 
   * or affects the other elements.
   * It just observes.
   */
  const svg = document.getElementById("canvas")!;
  let mid_ln = new Elem(svg, 'rect')
    .attr('x', 300).attr('y', 0)
    .attr('width', 1).attr('height', 600)
    .attr('fill', '#95B3D7');
    mid_ln.observe;
}

function ball(){
  /**
   * The ball function code goes as follows 
   * First it creates the 3 elements required for making the game
   * MousePaddle, Ball, CPU paddle
   * Hover the mouse over the right paddle
   * then only the mouse will
   */
  
  //Getting the canvas element in which all of our new objects will interract 
  const svg = document.getElementById("canvas")!;
  //mousemove variable will listen to mouse events
  const mousemove = Observable.fromEvent<MouseEvent>(svg, 'mousemove'),
  //MousePaddle: is a rectangle which will operate on the right side of the canvas
  //It will only move along the Y-direction
  MousePaddle = new Elem(svg, 'rect')
      .attr('x', 590)
      .attr('y', 70)
      .attr('width', 10)
      .attr('height', 80)
      .attr('fill', 'blue');
  //Ball is also a rectangle. Its operation will define and shape the game.
  let Ball = new Elem(svg, 'rect')
      .attr('x', 300)
      .attr('y', 300)
      .attr('width', 5)
      .attr('height', 5)
      .attr('fill', 'red')
  //Cpu Paddle is a rectange which will operate on the left side of the canvas.
  //It follows the Balls y co-ordinates
  let Cpu_paddle = new Elem(svg, 'rect')
      .attr('x', 0)
      .attr('y', 300)
      .attr('width', 10)
      .attr('height', 80)
      .attr('fill', 'green');
      
let x_direction = 5,  //x direction
    y_direction = 6,  //y direction
    y_paddle = 40,    //so that the ball hits the middle of cpu paddle which is shown later
    score_player1 = 0,//This score is updated when players 1 wins a match
    score_cpu = 0;    //This score is updated when the CPU wins a match
  const player_1_wins = 'Game Over! Players 1 wins!';  //For printing in the console
  const Cpu_wins = "Game Over! CPU wins!";             //For printing in the console

//M: MousePaddle will observe mousemove as long as the CPU score or player score is less than or equal to 11.
let M = MousePaddle.observe<MouseEvent>('mousemove').filter(() => score_cpu <= 11 && score_player1 <= 11)
    //If the bottom of the mouse paddle goes beyond the frame then keep it within the frame.
    M.filter(() => ((Number(MousePaddle.attr('y')))+80) >= 600).subscribe(() => MousePaddle.attr('y',520))
    ////If the top of the mouse paddle goes beyond the frame then keep it within the frame.
    M.filter(() => (Number(MousePaddle.attr('y'))) <= 0).subscribe(() => MousePaddle.attr('y',0))
    //Mouse Paddle will follow the Y movement of the mouse
    M.map(({clientY}) => ({yOffset: Number(MousePaddle.attr('y')) - clientY }))    
    .flatMap(({yOffset}) =>mousemove
    .map(({clientY}) => ({ y: clientY + yOffset })))  
    .subscribe(({y}) =>MousePaddle.attr('y', y))
    //If the CPU wins print to console
    M.filter(() => score_cpu == 11).subscribe(() => console.log(Cpu_wins))
    //If the Player-1 wins print to console
    M.filter(() => score_player1 == 11).subscribe(() => console.log(player_1_wins))
  
//function 'o' will run as long as the CPU score or player score is less than or equal to 11.
let o = Observable.interval(2).filter(() => score_cpu <= 11 && score_player1 <= 11)
  
  //CPU paddle moves up and down until the bounding y-axis (y=0) and (y=600)
  o.filter(() => ((Number(Cpu_paddle.attr('y'))<=0) || (Number(Cpu_paddle.attr('y'))+80)>= 600))
   .subscribe(()=> {y_paddle = y_paddle * -1}) 
  
  //If the ball touches the y-axis the ball will go in the opposite direction
  o.filter(()=> (Number(Ball.attr('y')))>= 600 || (Number(Ball.attr('y')))<= 0)
   .subscribe(() => {y_direction = y_direction * -1}) 
  
  //If the ball touches the mouse_paddle it will rebound when the following conditions are met:
  o.filter(() => (Number(Ball.attr('x'))) == (Number(MousePaddle.attr('x'))) && 
                 (Number(Ball.attr('y'))) >= (Number(MousePaddle.attr('y'))) && 
                 (Number(Ball.attr('y'))) <= ((Number(MousePaddle.attr('y')))+80))
   .subscribe(() => {x_direction = (x_direction * -1)})
  
  //If the ball touches the CPU paddle it will rebound when the following conditions are met:
  o.filter(() => (Number(Ball.attr('x'))) == ((Number(Cpu_paddle.attr('x')))+10) && 
                 (Number(Ball.attr('y'))) >= (Number(Cpu_paddle.attr('y'))) && 
                 (Number(Ball.attr('y'))) <= ((Number(Cpu_paddle.attr('y')))+80))
   .subscribe(() => {x_direction = (x_direction * -1)})
  
  //Initiating the ball to move. The ball will move in the direction given by the x and y number
  //The CPU_paddle will follow Balls Y_co_ordinates
  o.subscribe(() => { 
    Ball.attr('y',((Number(Ball.attr('y'))) + y_direction))
    Ball.attr('x',((Number(Ball.attr('x'))) + x_direction))
    //Initiating CPU paddle movement
    Cpu_paddle.attr('y',((Number(Ball.attr('y'))) + y_paddle))  
  
  //CPU paddle stays fixed to the top when the ball y attribute is less than or equal to 40
  o.filter(()=> (Number(Ball.attr('y')))<= 40)
   .subscribe(() => {Cpu_paddle.attr('y',0)})  
  
   //CPU paddle stays fixed to the bottom when the balls y-attribute is greater than or equal to 560
  o.filter(()=> (Number(Ball.attr('y')))>= 560)
   .subscribe(() => {Cpu_paddle.attr('y',520)})
  
  //If the ball crosses the x axis without touching the mousepaddle(right paddle) increase the score of the opponent
  //i.e. the CPU.Then, reset the game which will start from the initial position of x=300 and y=300
  //The score is increased by 1
  o.filter(() => (Number(Ball.attr('x'))) > 600)     //CPU Score 
   .subscribe(() =>{Ball.attr('x',300),Ball.attr('y',300),
    score_cpu = score_cpu + 1}) 

  //If the ball crosses the x axis without touching the CPU_paddle(left paddle) increase the score of the main player
  //aswell as reset the game which will start from the initial position 
  //The score is increased by 1
  o.filter(() => (Number(Ball.attr('x'))) < 0)    
   .subscribe(() =>{Ball.attr('x',300),Ball.attr('y',300),
    score_player1 = score_player1 + 1})

    //There are two IDs in the pong.html which are score and score2
    //Both of them are accessed and updated to show the score 
    const cpu_score = document.getElementById("score")!;
    const player1_score = document.getElementById("score2")!;
  
  //Show the CPU score on the pong.html by converting it to a string
  o.subscribe(() => cpu_score.innerHTML = score_cpu.toString())
  //Show the Player 1 score on the pong.html converting it to a string
  o.subscribe(() => player1_score.innerHTML = score_player1.toString())
})  
}

function pong() {
  //Function pong call the 2 functions given below
  mid_line();
  ball();
}

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();    
}

/**
 * *******************************************************************************************************************
 * *****         ***  ****  ****        ********         ****   *****  ***    ****************************************
 * ********  *******  ****  ****  **************  ***********  *  ***  ***  **  **************************************
 * ********  *******        ****        ********         ****  **  **  ***  **  **************************************
 * ********  *******  ****  ****  **************  ***********  ***  *  ***  **  **************************************
 * ********  *******  ****  ****        ********         ****  ****    ***    ****************************************
 * *******************************************************************************************************************
 */