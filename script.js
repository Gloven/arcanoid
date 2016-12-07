/**
 * Created by Vlad on 25.10.2016.
 */

function Start (){

    collision = document.getElementById("collide");
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var racket = {};
    racket.x = 225;
    racket.y = 485;
    racket.w = 60;
    racket.h = 8;
    racket.color = 'rgba(10,10,150,0.9)';
    racket.dx = 0;
    racket.dy = 0;

    var ball = {};
    ball.x = 250;
    ball.y = racket.y - 6;
    ball.radius = 6;
    ball.startAngle = 0;
    ball.endAngle = Math.PI * 2;
    ball.color = 'rgba(10,10,150,0.4)';
    ball.speed = 2.8;

    var blocks = [];
    var stateOf = [/*ball.dx, ball.dx, racket.x*/];  // ������ ���������� ����������(����������� ��������) ��� ������ � ������� � ������ �������� �� �����
    var totalScore = 0, level = 0, levelScore = 0, p = false, newLvl=false;
// "p/newLvl" ����� ������� ������������ ��� �������������� �������������� ������� ����� � ������ ������

    var cnvs = document.getElementById('canvasStatic');
    var ctx = cnvs.getContext('2d');
    var infoctx = document.getElementById('info').getContext('2d');

    var   angle = function  (rad) {
        return Math.PI/180*rad
    };

    Block = function(x, y) {
        this.x = x;
        this.y = y;
        this.w = 24;
        this.h = 24
    };

    window.onmousemove = function (e) {
        if (ball.dx  && ball.dy){ //���� ����� �� ����� �� �����, �� �������� ���������� �������� �� ����
            racket.x = e.pageX - 85
        }

    };//���������� ��������

    window.onkeydown = function (e) {
        if (e.keyCode === 32 && !newLvl ) { //���� ����� ������, � ��� �� ����   �������
            if (ball.dx  && ball.dy  ) {        // ���� ����� �� ����� �� �����
                pause();
                drawPause( 'rgba(0, 0, 255, 0.45)');
                drawText(ctx,'Pause', 110, 100);
                p = true;
            } else {        // ���� ��� �� ����� �� �����, ������ ������ �����
                ball.dx = stateOf[0];
                ball.dy = stateOf[1];
                ctx.clearRect(0, 0, cnvs.width, cnvs.height);   // ��������� ����
            }
        }//pause (KEY "space")
        if (e.keyCode === 13) { //  ���� ENTER
            if (!p && !ball.dy) {
                ctx.clearRect(0, 0, cnvs.width, cnvs.height);   // ������� ����-����
                ball.y = racket.y - 6;  // �������� ����� �� 1�� ����� � �������, ��� �� �������� �������� �������� ������
                newLvl = false;
            }
        }
    };

    function drawInfo() {
        infoctx.clearRect(0,0,500,50);
        infoctx.fillStyle = 'rgba(10,10,150,0.5)';
        infoctx.rect(0,0,120,50);
        infoctx.fill();
        infoctx.closePath();
        drawText(infoctx,'Level '+ (level), 10, 35);
        infoctx.beginPath();
        infoctx.rect(340,0,160,50);
        infoctx.closePath();
        drawText(infoctx,'Score '+ totalScore, 350, 35);

        drawText(infoctx,'Space -> pause ', 130, 35);

    } // ����������� �����, ������

    function draw() {
        drawBall();
        drawBlocks();
        drawRacket();
    }

    function createBlocks(lvl) {    // �������� ��������� ��� ������� ������
        var step = 40, xBegin, xEnd, yBegin, yEnd;
        if (lvl === 1 ) {
            xBegin = 125; yBegin = 50; //����������  ������� �����
            xEnd = xBegin + step * 7;  // ���������� ���������� �����
            yEnd = yBegin + step * 5;
            for (var y = yBegin; y < yEnd; y += step) {
                for (var x = xBegin; x < xEnd; x += step) {
                    var block = new Block(x, y);
                    blocks.push(block);
                    levelScore++;  // ���-���� ������ �� ���� ������
                }
            }
        }

        /*
         * �� 2 ������ ������� �������� �� ������ ������ � ������. ��� ������ �������� "�" (var x = xBegin; x < xEnd; x += step )
         * ������������ ���� �� �����, ������� ��������� � ��������� ����� pointL � pointR.
         * � ������ ����� (����� ���������) ���� �������� �������������
         * � ������, �����  pointL == xBegin && pointR  == xEnd, � ���  ����� ��� yBegin + step * 3 (�.�. �� 3 ������),
         * ���������� �������� ������, �.�.  �������� �����������
         * */
        if (lvl === 2) {
            xBegin = 125; yBegin = 50;
            xEnd = xBegin + step * 7;
            yEnd = yBegin + step * 7;
            var pointL = xBegin + step * 3;
            var pointR = pointL;
            for (var y = yBegin ; y < yEnd; y += step) {
                for (var x = xBegin; x < xEnd; x += step ) {
                    if (x >= pointL && x <= pointR ) {
                        var block = new Block(x, y);
                        blocks.push(block);
                    }
                }
                if (y >= yBegin + step * 3) {
                    pointL += step;
                    pointR -= step
                } else  {
                    pointL -= step;
                    pointR += step
                }

            }

        }
    }

    function drawBlocks() {
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            context.fillStyle = 'green';
            context.beginPath();
            context.rect(block.x, block.y, block.w, block.h );
            context.fill();
            context.closePath();
        }
    }

    function drawRacket() {
        context.fillStyle = racket.color;
        context.beginPath();
        context.rect(racket.x,racket.y,racket.w,racket.h);
        context.fill();
        context.closePath();
    }

    function drawBall() {
        context.fillStyle = ball.color;
        context.beginPath();
        context.arc( ball.x,  ball.y, ball.radius, 0,Math.PI * 2 , true);
        context.fill();
        context.closePath();
    }

    function drawPause(color) {
        ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        ctx.fillStyle =  color;
        ctx.beginPath();
        ctx.rect(0,0,cnvs.width,cnvs.height);
        ctx.fill();
        ctx.closePath();
    }

    function drawText(Context,text,txtX,txtY,coloor ) {
        /* ctx.shadowColor = "#F00";
         ctx.shadowOffsetX = 5;
         ctx.shadowOffsetY = 5;
         ctx.shadowBlur = 5;*/
        Context.fillStyle = coloor;
        Context.font = "30px Comic Sans MS";
        Context.fillText(text, txtX, txtY);
        Context.closePath();
    }

    function checkHit() {
        /*
         * ���� �����  ����� ������  �������� � ������������
         * [���� �� ������ ����� - ������ ������ / 2;���� �� ������ ����� +  ������ ������], �� ���� ���������
         * �������� ��� �������� ���������� � ������ ������ (������ �����) �� ��� �������, ��� ����� ��������
         * �� "���������" != 1, �.�. �� ���� ��� ��� ������������ +-2,8 px, � ���� ��� ��������� ����� ������, �� �����
         * �������� ����� ��������� ����� ����, ��� �������
         * */
        for (var i = 0; i < blocks.length; i++) {  // �������� �� ���� ��������� ������� ������
            var block = blocks[i];
            if (  (ball.y  <= block.y + block.h + ball.radius && ball.y >= block.y + block.h + ball.radius/2   ) && (ball.x >= block.x - ball.radius && ball.x <= block.x + block.w + ball.radius) ) {
                ball.dy = ball.speed;
                blocks [i]  = 0;
                totalScore += 10;
                if(collision) {
                    /*      if(points > 0)
                     collision.pause();*/

                    collision.currentTime = 0;
                    collision.play();
                }
            }  // ��������� � ������ ����� �����
            if (  (ball.y >= block.y - ball.radius && ball.y <= block.y - ball.radius/2) &&  (ball.x >= block.x - ball.radius && ball.x <= block.x + block.w + ball.radius)  ) {
                blocks[i] = 0;
                ball.dy = -ball.speed;
                totalScore += 10;
                if(collision) {
                    /*      if(points > 0)
                     collision.pause();*/

                    collision.currentTime = 0;
                    collision.play();
                }

            }   // ��������� ������  �����

            if (  (ball.y > block.y - ball.radius && ball.y < block.y + block.h + ball.radius) && (ball.x >= block.x - ball.radius && ball.x < block.x - ball.radius/2  )){
                blocks[i] = 0;
                ball.dx= - ball.speed;
                totalScore += 10;
                if(collision) {
                    /*      if(points > 0)
                     collision.pause();*/

                    collision.currentTime = 0;
                    collision.play();
                }
            }       //��������� �����  �����

            if (  (ball.y > block.y - ball.radius && ball.y < block.y + block.h + ball.radius) && (ball.x <= block.x + block.w + ball.radius && ball.x > block.x + block.w + ball.radius/2) ) {
                blocks[i] = 0;
                ball.dx = ball.speed;
                totalScore += 10;
                if(collision) {
                    /*      if(points > 0)
                     collision.pause();*/

                    collision.currentTime = 0;
                    collision.play();
                }
            }  // ��������� ������  �����

        }

        if (ball.x - ball.radius < 0){
            ball.dx = Math.abs(ball.speed);
        }  //left wall
        if (ball.x + ball.radius > canvas.width){
            ball.dx = - Math.abs(ball.speed);
        }  //  right wall
        if (ball.y - ball.radius < 0){
            ball.dy = Math.abs(ball.speed);
        }   // top wall


        /*
         * ������� ������� �������� �� 4 �����.
         * ��� ��������� �� ������� ������/����� �������, �������� ������ ������������� ��
         * ��� "�", ��� ����� � ��������� ���� ������� �� ������� (����� != 45),
         * � ��� ��������� �� ������� �����, ���� �������  == 45
         * */
        if (  (ball.y + ball.radius >= racket.y) && ( ball.x + ball.radius >= racket.x && ball.x <= racket.x + racket.w)  ) { // ���� ����� ����� �� �������
            if (ball.x >= racket.x && ball.x < racket.x + racket.w/4) {  //���� ����� �� ����� ����� �������
                /*   ball.speed = - Math.abs(ball.speed);
                 ball.dx = Math.sin(angle(60))*ball.speed; // 30 grad
                 ball.dy = Math.cos(angle(60))*ball.speed;*/
                ball.dy = - Math.abs(ball.speed);
                ball.dx = - Math.abs(ball.speed) * 1.1;

            }
            if (ball.x >= racket.x + racket.w/4  && ball.x < racket.x+racket.w/2){              // ����� ������
                ball.dy = - Math.abs(ball.speed);
                ball.dx = - Math.abs(ball.speed);

            }

            if (ball.x  == racket.x + racket.w/2) {             // �����
                ball.dy = - Math.abs(ball.speed);
            }

            if (ball.x > racket.x+racket.w/2 && ball.x <= racket.x + racket.w*3/4  ) {    // ������  ������
                ball.dy = - Math.abs(ball.speed);
                ball.dx =  Math.abs(ball.speed);

            }

            if (ball.x > racket.x + racket.w*3/4  &&  ball.x <= racket.x + racket.w){       //���� ����� �� ������ ����� �������
                /*                ball.speed = Math.abs(ball.speed);
                 ball.dx = Math.sin(angle(125))*ball.speed; // 30 grad
                 ball.dy = Math.cos(angle(125))*ball.speed;*/
                ball.dy = - Math.abs(ball.speed);
                ball.dx =  Math.abs(ball.speed)*1.1;

            }
            // ball.dy = -ball.speed;

        }  //racket

        if (racket.x < 0) { racket.x = 0
        } else if (racket.x > canvas.width - racket.w ) {
            racket.x = canvas.width - racket.w
        }   // ������ �� ������ �� ������� ������� �������
        if (ball.y + ball.radius + ball.speed > canvas.height ) {
            gameOver();
        } // Game Over
    }

    function gameOver() {
        drawPause('rgba(0, 0, 255, 0.45)');
        drawText(ctx,'Game over',80,100,'red' );
        drawText(ctx,'You score: ' + totalScore,50,150, 'red' );
        racket.x = canvas.width / 2;
        ball.x = 0;
        ball.y = canvas.height + ball.radius*2;
    }  // ���������� ����� ����, ������� ������ �� ������� ������, ����� �������

    function pause (){
        stateOf[0] = ball.dx;
        stateOf[1] = ball.dy;
        stateOf[2] = racket.x;
        ball.dx = 0;
        ball.dy = 0;
    } // ���������� ������� ������/�������; ������������� �����

    function Game() {
        context.clearRect(0,0,500,500);  // clear canvas
        checkHit();
        drawInfo();
        ball.x += ball.dx  ;
        ball.y += ball.dy  ;
        draw();
    }

    function status() {
        /*Game*/
        Game();
        /*Game*/

        /*New level*/
        if (totalScore/10 == levelScore ) {
            newLvl = true;
            ball.y =  racket.y - 7; // ������ ����� ���� ���� �������, ��� �� �� �������� �������� ������� �� �������
            ball.x = 250;
            racket.x = 225;
            racket.y = 485;  //������ ������� � ����� � �������� ���������

            ball.dx = 0;
            ball.dy = 0;  // ������������� �������� ������, ���� user �� ������ ENTER
            drawPause('rgba(5, 161, 161, 0.85)'); // ������ �������� � �����������
            if (level !== 0) { // ���� �� ������ ����
                drawText(ctx,'Level ' + level + ' completed!' ,30,70 );
                drawText(ctx,'You score: ' + totalScore,50,120);
                drawText(ctx,'ENTER - continue',30, 170)
            } else {
                drawText(ctx,'Press ENTER', 50, 70,'rgba(64, 9, 64, 0.85)');
                drawText(ctx,'to start the game', 20, 130)

            }

            level++;
            levelScore = 0;
            createBlocks(level);
        }
        /*New level*/
    }

    function animation() {
        status();
        requestAnimationFrame(animation);
    }
    animation();

}

