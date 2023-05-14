// Importing sound effects
const introMusic = new Audio("./sound effects/introSong.mp3");
const shootingSound = new Audio("./sound effects/shooting.mp3");
const killEnemySound = new Audio("./sound effects/killEnemy.mp3");
const gameOverSound = new Audio("./sound effects/gameOver.mp3");
const HeavyWeaponSound = new Audio("./sound effects/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./sound effects/hugeWeapom.mp3");


introMusic.play();
// Basic enviornment setup
const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
let playerScore = 0;

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");


//Basic functions

//Event listener for Difficulty form
document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();

    // stopping music
    introMusic.pause();

    // making form invisible
    form.style.display = "none";
    // making scoreboard visible
    scoreBoard.style.display = "block";
    // getting difficulty selected by user
    const userValue = document.getElementById("difficulty").value;
    console.log(userValue);

    if (userValue === "Easy") {
        setInterval(spawnEnemy, 2000);
        return (difficulty = 5);

    }
    if (userValue === "Medium") {
        setInterval(spawnEnemy, 1400);
        return (difficulty = 8);
    }
    if (userValue === "Hard") {
        setInterval(spawnEnemy, 1000);
        return (difficulty = 10);
    }
    if (userValue === "Insane") {
        setInterval(spawnEnemy, 700);
        return (difficulty = 12);
    }


});

// Endscreen
const gameOverLoader = () => {
    // Creating endscreen div and play again button anf high score element
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");

    highScore.innerHTML = `high Score: ${localStorage.getItem("highScore") ?
        localStorage.getItem('highScore') :
        playerScore
        }`;

    const oldHighScore =
        localStorage.getItem("highScore") && localStorage.getItem("highScore");

    if (oldHighScore < playerScore) {
        localStorage.setItem("highScore", playerScore);

        // Updating high score html
        highScore.innerHTML = `high Score: ${playerScore}`;
    }

    // Adding text to playagain button
    gameOverBtn.innerText = "Play Again";

    gameOverBanner.appendChild(highScore);

    gameOverBanner.appendChild(gameOverBtn);

    // Making reload on clickig playagan button
    gameOverBtn.onclick = () => {
        window.location.reload();
    };

    gameOverBanner.classList.add("gameover");
    document.querySelector("body").appendChild(gameOverBanner);
}


//.................creating player, enemy, weapon, etc classes ....................

// Setting player position to center
playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};

// Creating player class
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

    }

    draw() {
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;

        context.fill();

    }
}

//........................... creating weapon class............................
class Weapon {
    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;

    }

    draw() {
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
}

// Creating hugeweapon class
class hugeweapon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = 'rgba(221, 214, 3, 0.88)';


    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, 200, canvas.height);
    }

    update() {
        this.draw();
        this.x += 20;

    }
}

//........................creating enemy class ..................
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }

    draw() {
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        (this.x += this.velocity.x), (this.y += this.velocity.y);

    }
}
//..........Creating particle class......................
const friction = 0.98;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;

    }

    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            (Math.PI / 180) * 0,
            (Math.PI / 180) * 360,
            false
        );
        context.fillStyle = this.color;
        context.fill();
        context.restore();

    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;

    }
}


//.................................Main logic here................................

// .................Creation Player object, weapons array, enemy array, etc array.........
const apurva = new Player(playerPosition.x, playerPosition.y, 15, 'white');
const weapons = [];
const hugeweapons = [];
const enemies = [];
const particles = [];


// ...........................Function to spawn enemt at random location...........................
const spawnEnemy = () => {

    // ...........Generating random size for enemy.................
    const enemySize = Math.random() * (40 - 5) + 5;

    // ...........Generating random color for enemy.................
    const enemyColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`


    // Random is enemy spawn position
    let random;

    // Making enemy location random but only from outside of screen
    if (Math.random() < 0.5) {
        // Making x equal to very left off of screen or very right off of screen and setting y to any where vertically
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height,
        };

    }
    else {
        // Making y equal to very up off of screen or very down off of screen and setting x to any where horizontally
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
        };

    }


    // Finding angle between center (means player position) and enemy position
    const myAngle = Math.atan2(
        canvas.height / 2 - random.y,
        canvas.width / 2 - random.x,
    );

    // Making velocity or speed of enemy by multiplying chosen difficulty to radian
    const velocity = {
        x: Math.cos(myAngle) * difficulty,
        y: Math.sin(myAngle) * difficulty,
    }

    // Adding enemy to enemies array
    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

// ................................creating animation function...................................

let animationId;
function animation() {
    // Making recursion
    animationId = requestAnimationFrame(animation);

    // Updating player score in score board in html;
    scoreBoard.innerHTML = `score : ${playerScore}`;

    // Clearing canvas on each frame
    context.fillStyle = 'rgba(49, 49, 49, 0.2)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Drawing player
    apurva.draw();

    //Generating particles
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1)
        }
        else {
            particle.update();
        }


    });

    //Generating huge weapon
    hugeweapons.forEach((hugeweapon, hugeweaponIndex) => {
        if (hugeweapon.x > canvas.width) {
            hugeweapons.splice(hugeweaponIndex, 1);
        }
        else {
            hugeweapon.update();
        }

    });

    // Generating bullets
    weapons.forEach((weapon, weaponIndex) => {
        weapon.update();

        // Removing weapons if they are off screen
        if (weapon.x + weapon.radius < 1 ||
            weapon.y + weapon.radius < 1 ||
            weapon.x - weapon.radius > canvas.width ||
            weapon.y - weapon.radius > canvas.height
        ) {
            weapons.splice(weaponIndex, 1);
        }
    });

    // Generating enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        // Finding distance between player and enemy
        const distanceBetweenPlayerAndEnemy = Math.hypot(
            apurva.x - enemy.x,
            apurva.y - enemy.y
        );

        // Stopping game if enemy hit player
        if (distanceBetweenPlayerAndEnemy - apurva.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId);
            gameOverSound.play();
            hugeWeaponSound.pause();
            shootingSound.pause();
            hugeWeaponSound.pause();
            killEnemySound.pause();
            return gameOverLoader();
        }

        hugeweapons.forEach((hugeweapon) => {
            // Finding distance between hugeweapon and enemy
            const distanceBetweenHugeweaponAndEnemy = hugeweapon.x - enemy.x;

            if (distanceBetweenHugeweaponAndEnemy <= 200 &&
                distanceBetweenHugeweaponAndEnemy >= -200) {
                // Increasing player score when killing one enemy
                playerScore += 10;
                setTimeout(() => {
                    killEnemySound.play();
                    enemies.splice(enemyIndex, 1);
                }, 0);
            }
        });

        weapons.forEach((weapon, weaponIndex) => {

            // Finding distance between weapon and enemy
            const distanceBetweenWeaponAndEnemy = Math.hypot(
                weapon.x - enemy.x,
                weapon.y - enemy.y
            );

            if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {

                // Reducing size of enemy on hit
                if (enemy.radius > weapon.damage + 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage,
                    });
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1);
                    }, 0);
                }
                // Removing enemy on hit if they are below 18
                else {

                    for (let i = 0; i < enemy.radius * 5; i++) {
                        particles.push(
                            new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                                x: (Math.random() - 0.5) * (Math.random() * 7),
                                y: (Math.random() - 0.5) * (Math.random() * 7),
                            })
                        );

                    }

                    // Increasing player score when killing one enemy
                    playerScore += 10;

                    //Randering player score in scoreboard html element
                    scoreBoard.innerHTML = `score : ${playerScore}`;

                    setTimeout(() => {
                        killEnemySound.play();
                        enemies.splice(enemyIndex, 1);
                        weapons.splice(weaponIndex, 1);
                    }, 0);
                }


            }
        });
    });

}





// .................................Adding event Listener.......................................

// Event listener for light weapon aka left click
canvas.addEventListener("click", (e) => {

    shootingSound.play();

    // Finding angle between player position(center) and click co-ordinate
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    );

    // Making const speed for light weapon
    const velocity = {
        x: Math.cos(myAngle) * 6,
        y: Math.sin(myAngle) * 6,
    };

    // Adding light weapon in weapons array
    weapons.push(new Weapon(
        canvas.width / 2,
        canvas.height / 2,
        6,
        'white',
        velocity,
        lightWeaponDamage
    )
    );
});

// Event listener for heavy weapon aka right click
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();



    if (playerScore <= 0) return;
    HeavyWeaponSound.play();

    // Decreasing playerscore for using heavy weapon
    playerScore -= 2;

    // Updating player score in score board in html;
    scoreBoard.innerHTML = `score : ${playerScore}`;

    // Finding angle between player position(center) and click co-ordinate
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    );

    // Making const speed for light weapon
    const velocity = {
        x: Math.cos(myAngle) * 3,
        y: Math.sin(myAngle) * 3,
    };

    // Adding light weapon in weapons array
    weapons.push(
        new Weapon(
            canvas.width / 2,
            canvas.height / 2,
            30,
            'cyan',
            velocity,
            heavyWeaponDamage
        )
    );
});

addEventListener("keypress", (e) => {

    if (e.key === " ") {
        if (playerScore < 20) return;
        // Decreasing playerscore for using huge weapon
        playerScore -= 20;

        // Updating player score in score board in html;
        scoreBoard.innerHTML = `score : ${playerScore}`;
        hugeWeaponSound.play();
        hugeweapons.push(
            new hugeweapon(0, 0)
        );
    }



});

addEventListener("contextmenu", (e) => {
    e.preventDefault()
});

addEventListener("resize", () => {
    window.location.reload();
})


animation();






