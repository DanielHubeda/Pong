var canvas = document.getElementById("soccer-game");
        var ctx = canvas.getContext("2d");

        var player1 = {
            x: 20,
            y: canvas.height / 2 - 50,
            width: 20,
            height: 80,
            score: 0,
            speed: 8,
            movingUp: false,
            movingDown: false
        };

        var player2 = {
            x: canvas.width - 40,
            y: canvas.height / 2 - 50,
            width: 20,
            height: 80,
            score: 0,
            speed: 8,
            movingUp: false,
            movingDown: false
        };

        var ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            speedX: 5,
            speedY: 5
        };

        var speedFactor = 1;
        var maxSpeed = 15;

        function increaseSpeed() {
            speedFactor += 0.001; // aumenta o fator de velocidade em 0.001 a cada 2 segundos
            ball.speedX *= speedFactor;
            ball.speedY *= speedFactor;
            
        }
        if (ball.speedX <= maxSpeed && ball.speedY <= maxSpeed) {
            // Adiciona a função increaseSpeed a cada 2 segundos
            setInterval(increaseSpeed, 2000);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.fillRect(
                player1.x,
                player1.y,
                player1.width,
                player1.height
            );
            ctx.fillRect(
                player2.x,
                player2.y,
                player2.width,
                player2.height
            );

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();

            ctx.font = "24px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(player1.score, 100, 50);
            ctx.fillText(player2.score, canvas.width - 100, 50);
        }

        function update() {
            // Update player positions based on key input
            if (player1.movingUp && player1.y > 0) {
                player1.y -= player1.speed;
            } else if (
                player1.movingDown &&
                player1.y + player1.height < canvas.height
            ) {
                player1.y += player1.speed;
            }

            if (player2.movingUp && player2.y > 0) {
                player2.y -= player2.speed;
            } else if (
                player2.movingDown &&
                player2.y + player2.height < canvas.height
            ) {
                player2.y += player2.speed;
            }

            // Update ball position
            ball.x += ball.speedX;
            ball.y += ball.speedY;

            // Check for collisions with the top and bottom walls
            if (
                ball.y - ball.radius < 0 ||
                ball.y + ball.radius > canvas.height
            ) {
                ball.speedY = -ball.speedY;
            }

            // Check for collisions with the left and right walls (goals)
            if (ball.x - ball.radius < 0) {
                ball.speedX = -ball.speedX;
                player2.score++;
                resetBall();
            } else if (ball.x + ball.radius > canvas.width) {
                ball.speedX = -ball.speedX;
                player1.score++;
                resetBall();
            }

            // Check for collisions with the paddles
            if (
                ball.x - ball.radius < player1.x + player1.width &&
                ball.y + ball.radius > player1.y &&
                ball.y - ball.radius < player1.y + player1.height
            ) {
                ball.speedX = Math.abs(ball.speedX);
            } else if (
                ball.x + ball.radius > player2.x &&
                ball.y + ball.radius > player2.y &&
                ball.y - ball.radius < player2.y + player2.height
            ) {
                ball.speedX = -Math.abs(ball.speedX);
            }
        }

        function resetBall() {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.speedX = 5; // reinicializa a velocidade X
            ball.speedY = 5; // reinicializa a velocidade Y
        }

        function keyDownHandler(e) {
            if (e.key === "ArrowUp") player2.movingUp = true;
            else if (e.key === "ArrowDown") player2.movingDown = true;
            else if (e.key === "w") player1.movingUp = true;
            else if (e.key === "s") player1.movingDown = true;
        }

        function keyUpHandler(e) {
            if (e.key === "ArrowUp") player2.movingUp = false;
            else if (e.key === "ArrowDown") player2.movingDown = false;
            else if (e.key === "w") player1.movingUp = false;
            else if (e.key === "s") player1.movingDown = false;
        }

        function loop() {
            draw();
            update();
            requestAnimationFrame(loop);
        }

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        loop();