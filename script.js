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
    var stateOf = [/*ball.dx, ball.dx, racket.x*/];  // массив содержащий координаты(направление движения) для шарика и ракетки в момент перехода на паузу
    var totalScore = 0, level = 0, levelScore = 0, p = false, newLvl=false;
// "p/newLvl" метки которые используются для предотвращения одновременного запуска паузы и нового уровня

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
        if (ball.dx  && ball.dy){ //если шарик НЕ стоит на месте, то передаем управление ракеткой на мышь
            racket.x = e.pageX - 85
        }

    };//управление ракеткой

    window.onkeydown = function (e) {
        if (e.keyCode === 32 && !newLvl ) { //если нажат пробел, и это не новы   уровень
            if (ball.dx  && ball.dy  ) {        // если шарик не стоит на месте
                pause();
                drawPause( 'rgba(0, 0, 255, 0.45)');
                drawText(ctx,'Pause', 110, 100);
                p = true;
            } else {        // если все же шарик на месте, значит сейчас пауза
                ball.dx = stateOf[0];
                ball.dy = stateOf[1];
                ctx.clearRect(0, 0, cnvs.width, cnvs.height);   // запускаем игру
            }
        }//pause (KEY "space")
        if (e.keyCode === 13) { //  если ENTER
            if (!p && !ball.dy) {
                ctx.clearRect(0, 0, cnvs.width, cnvs.height);   // очищаем инфо-окно
                ball.y = racket.y - 6;  // сдвигаем шарик на 1рх ближе к ракетке, что бы сработал алгоритм движения шарика
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

    } // отображение счета, уровня

    function draw() {
        drawBall();
        drawBlocks();
        drawRacket();
    }

    function createBlocks(lvl) {    // создание координат для массива блоков
        var step = 40, xBegin, xEnd, yBegin, yEnd;
        if (lvl === 1 ) {
            xBegin = 125; yBegin = 50; //координаты  первого блока
            xEnd = xBegin + step * 7;  // координаты последнего блока
            yEnd = yBegin + step * 5;
            for (var y = yBegin; y < yEnd; y += step) {
                for (var x = xBegin; x < xEnd; x += step) {
                    var block = new Block(x, y);
                    blocks.push(block);
                    levelScore++;  // кол-ство блоков на этом уровне
                }
            }
        }

        /*
         * Во 2 уровне введена проверка на запись блоков в массив. При каждой итерации "х" (var x = xBegin; x < xEnd; x += step )
         * записываются лишь те блоки, которые находятся в интервале между pointL и pointR.
         * С каждым шагом (новой итерацией) этот интервал увеличивается
         * В момент, когда  pointL == xBegin && pointR  == xEnd, а это  будет при yBegin + step * 3 (т.е. на 3 строке),
         * начинается обратный отсчет, т.е.  интервал уменьшается
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
         * Если любая  точка шарика  попадает в пространство
         * [одна из сторон блока - радиус шарика / 2;одна из сторон блока +  радиус шарика], то блок удаляется
         * Диапазон для проверки выбирается с учетом зазора (внутрь блока) по той причине, что шарик движется
         * со "скоростью" != 1, т.е. за один шаг шар преодолевает +-2,8 px, и если нее поставить этого зазора, то шарик
         * попросту будет пролетать через блок, без отскока
         * */
        for (var i = 0; i < blocks.length; i++) {  // проверка по всем элементам массива блоков
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
            }  // попадение в нижнюю часть блока
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

            }   // попадание сверху  блока

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
            }       //попадание слева  блока

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
            }  // попадание справа  блока

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
         * ракетка условно поделена на 4 части.
         * при попадании на крайнюю правую/левую сторону, скорость шарика увеличивается по
         * оси "х", что ведет к изменению угла отскока от ракетки (уголл != 45),
         * а при попадании на среднюю часть, угол отскока  == 45
         * */
        if (  (ball.y + ball.radius >= racket.y) && ( ball.x + ball.radius >= racket.x && ball.x <= racket.x + racket.w)  ) { // если шарик попал на ракетку
            if (ball.x >= racket.x && ball.x < racket.x + racket.w/4) {  //если попал на левую часть ракетки
                /*   ball.speed = - Math.abs(ball.speed);
                 ball.dx = Math.sin(angle(60))*ball.speed; // 30 grad
                 ball.dy = Math.cos(angle(60))*ball.speed;*/
                ball.dy = - Math.abs(ball.speed);
                ball.dx = - Math.abs(ball.speed) * 1.1;

            }
            if (ball.x >= racket.x + racket.w/4  && ball.x < racket.x+racket.w/2){              // левее центра
                ball.dy = - Math.abs(ball.speed);
                ball.dx = - Math.abs(ball.speed);

            }

            if (ball.x  == racket.x + racket.w/2) {             // центр
                ball.dy = - Math.abs(ball.speed);
            }

            if (ball.x > racket.x+racket.w/2 && ball.x <= racket.x + racket.w*3/4  ) {    // правее  центра
                ball.dy = - Math.abs(ball.speed);
                ball.dx =  Math.abs(ball.speed);

            }

            if (ball.x > racket.x + racket.w*3/4  &&  ball.x <= racket.x + racket.w){       //если попал на правую часть ракетки
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
        }   // рактка не уходит за пределы рабочей области
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
    }  // прорисовка конца игры, ракетку ставим по средине экрана, шарик убираем

    function pause (){
        stateOf[0] = ball.dx;
        stateOf[1] = ball.dy;
        stateOf[2] = racket.x;
        ball.dx = 0;
        ball.dy = 0;
    } // записываем позицыю шарика/ракетки; останавливаем шарик

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
            ball.y =  racket.y - 7; // ставим шарик чуть выше ракетки, что бы не сработал алгоритм отскока от ракетки
            ball.x = 250;
            racket.x = 225;
            racket.y = 485;  //ставим ракетку и шарик в исходное положение

            ball.dx = 0;
            ball.dy = 0;  // предотвращаем движение шарика, пока user не нажмет ENTER
            drawPause('rgba(5, 161, 161, 0.85)'); // рисуем табличку с информацией
            if (level !== 0) { // если не начало игры
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

