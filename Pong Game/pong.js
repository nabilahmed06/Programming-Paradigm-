"use strict";
function mid_line() {
    const svg = document.getElementById("canvas");
    let mid_ln = new Elem(svg, 'rect')
        .attr('x', 300).attr('y', 0)
        .attr('width', 1).attr('height', 600)
        .attr('fill', '#95B3D7');
    mid_ln.observe;
}
function ball() {
    const svg = document.getElementById("canvas");
    const mousemove = Observable.fromEvent(svg, 'mousemove'), MousePaddle = new Elem(svg, 'rect')
        .attr('x', 590)
        .attr('y', 70)
        .attr('width', 10)
        .attr('height', 80)
        .attr('fill', 'blue');
    let Ball = new Elem(svg, 'rect')
        .attr('x', 300)
        .attr('y', 300)
        .attr('width', 5)
        .attr('height', 5)
        .attr('fill', 'red');
    let Cpu_paddle = new Elem(svg, 'rect')
        .attr('x', 0)
        .attr('y', 300)
        .attr('width', 10)
        .attr('height', 80)
        .attr('fill', 'green');
    let x_direction = 5, y_direction = 6, y_paddle = 40, score_player1 = 0, score_cpu = 0;
    const player_1_wins = 'Game Over! Players 1 wins!';
    const Cpu_wins = "Game Over! CPU wins!";
    let M = MousePaddle.observe('mousemove').filter(() => score_cpu <= 11 && score_player1 <= 11);
    M.filter(() => ((Number(MousePaddle.attr('y'))) + 80) >= 600).subscribe(() => MousePaddle.attr('y', 520));
    M.filter(() => (Number(MousePaddle.attr('y'))) <= 0).subscribe(() => MousePaddle.attr('y', 0));
    M.map(({ clientY }) => ({ yOffset: Number(MousePaddle.attr('y')) - clientY }))
        .flatMap(({ yOffset }) => mousemove
        .map(({ clientY }) => ({ y: clientY + yOffset })))
        .subscribe(({ y }) => MousePaddle.attr('y', y));
    M.filter(() => score_cpu == 11).subscribe(() => console.log(Cpu_wins));
    M.filter(() => score_player1 == 11).subscribe(() => console.log(player_1_wins));
    let o = Observable.interval(2).filter(() => score_cpu <= 11 && score_player1 <= 11);
    o.filter(() => ((Number(Cpu_paddle.attr('y')) <= 0) || (Number(Cpu_paddle.attr('y')) + 80) >= 600))
        .subscribe(() => { y_paddle = y_paddle * -1; });
    o.filter(() => (Number(Ball.attr('y'))) >= 600 || (Number(Ball.attr('y'))) <= 0)
        .subscribe(() => { y_direction = y_direction * -1; });
    o.filter(() => (Number(Ball.attr('x'))) == (Number(MousePaddle.attr('x'))) &&
        (Number(Ball.attr('y'))) >= (Number(MousePaddle.attr('y'))) &&
        (Number(Ball.attr('y'))) <= ((Number(MousePaddle.attr('y'))) + 80))
        .subscribe(() => { x_direction = (x_direction * -1); });
    o.filter(() => (Number(Ball.attr('x'))) == ((Number(Cpu_paddle.attr('x'))) + 10) &&
        (Number(Ball.attr('y'))) >= (Number(Cpu_paddle.attr('y'))) &&
        (Number(Ball.attr('y'))) <= ((Number(Cpu_paddle.attr('y'))) + 80))
        .subscribe(() => { x_direction = (x_direction * -1); });
    o.subscribe(() => {
        Ball.attr('y', ((Number(Ball.attr('y'))) + y_direction));
        Ball.attr('x', ((Number(Ball.attr('x'))) + x_direction));
        Cpu_paddle.attr('y', ((Number(Ball.attr('y'))) + y_paddle));
        o.filter(() => (Number(Ball.attr('y'))) <= 40)
            .subscribe(() => { Cpu_paddle.attr('y', 0); });
        o.filter(() => (Number(Ball.attr('y'))) >= 560)
            .subscribe(() => { Cpu_paddle.attr('y', 520); });
        o.filter(() => (Number(Ball.attr('x'))) > 600)
            .subscribe(() => {
            Ball.attr('x', 300), Ball.attr('y', 300),
                score_cpu = score_cpu + 1;
        });
        o.filter(() => (Number(Ball.attr('x'))) < 0)
            .subscribe(() => {
            Ball.attr('x', 300), Ball.attr('y', 300),
                score_player1 = score_player1 + 1;
        });
        const cpu_score = document.getElementById("score");
        const player1_score = document.getElementById("score2");
        o.subscribe(() => cpu_score.innerHTML = score_cpu.toString());
        o.subscribe(() => player1_score.innerHTML = score_player1.toString());
    });
}
function pong() {
    mid_line();
    ball();
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map