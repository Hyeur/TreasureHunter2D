import { Application, Text, TextStyle, utils } from 'pixi.js';
import SpriteObject from './sprite_objects.js';
import Scene from "./scene.js";
import HealthPointBar from './health_point_bar.js';
import Keyboard from './keyboard.js';
import { contain, hitTestRectangle, randomInt } from "./logics.js";


const TextureCache = utils.TextureCache;

export class Game extends Application {
    constructor() {
        super({
            width: 512,
            height: 512,
        });
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.top = "50%";
        this.renderer.view.style.left = "50%";
        this.renderer.view.style.transform = "translate(-50%,-50%)";
        document.body.appendChild(this.view);
    }

    load() {
        this.loader.add("./images/treasureHunter.json");
        this.loader.load(this.setup.bind(this));
    }


    setup() {
        //add Game Scene
        this.gameScene = new Scene();
        this.stage.addChild(this.gameScene);

        //add Game Over Scene
        this.gameOverScene = new Scene();
        this.gameOverScene.setVisible(false);
        this.stage.addChild(this.gameOverScene);

        //load texture and add Dungeon on Game Scene
        this.dungeon = new SpriteObject(
            TextureCache["dungeon.png"]
        );
        this.gameScene.addChild(this.dungeon);

        //load texture and add Player on Game Scene
        this.explorer = new SpriteObject(
            TextureCache["explorer.png"]
        );
        this.explorer.setPosition(
            68,
            this.stage.height / 2 - this.explorer.height / 2
        );
        this.gameScene.addChild(this.explorer);

        //load texture and add Chest(treasure) on Game Scene
        this.treasure = new SpriteObject(
            TextureCache["treasure.png"]
        );
        this.treasure.setPosition(
            this.stage.width - this.treasure.width - 48,
            this.stage.height / 2 - this.treasure.height / 2
        );
        this.gameScene.addChild(this.treasure);

        //load texture and add Door on Game Scene
        this.door = new SpriteObject(TextureCache["door.png"]);
        this.door.setPosition(this.door.width, 0);
        this.gameScene.addChild(this.door);

        this.setupBlobs();

        //add game over message on Game Over scene
        let style = new TextStyle({
            fontFamily: "Helvetica",
            fontSize: 64,
            fill: "white",
        });
        this.message = new Text("The End!", style);
        this.message.x = 120;
        this.message.y = this.stage.height / 2 - 32;
        this.gameOverScene.addChild(this.message);

        //load texture and add HealthBar on Game Scene
        this.healthBar = new HealthPointBar(this.stage.width - 170, 4);
        this.gameScene.addChild(this.healthBar);

        this.setupController();
        this.ticker.add(delta => this.gameLoop(delta));
    }

    //load texture and add Enemy(Blobs) on Game Scene
    setupBlobs(numberOfBlobs = 6) {
        this.blobs = [];
        let spacing = 48,
            xOffset = 150,
            speed = 2,
            direction = 1;

        for (let i = 0; i < numberOfBlobs; i++) {
            let blob = new SpriteObject(
                TextureCache["blob.png"]
            );
            let x = spacing * i + xOffset;
            let y = randomInt(
                this.door.height,
                this.stage.height - this.door.height - blob.height
            );
            this.gameScene.addChild(blob);

            blob.setPosition(x, y);
            blob.setVelocity(0, speed * direction);
            direction *= -1;
            this.blobs.push(blob);
        }

    }

    gameLoop(delta) {
        //Contain the explorer inside the area of the dungeon
        contain(this.explorer, {
            x: 28,
            y: 10,
            width: 488,
            height: 480
        });

        //Set `explorerHit` to `false` before checking for a collision
        let explorerHit = false;

        //Loop through all the sprites in the `enemies` array
        this.blobs.forEach((blob) => {

            //Move the blob
            blob.y += blob.vy;

            //Check the blob's screen boundaries
            let blobHitsWall = contain(blob, {
                x: 28,
                y: 10,
                width: 488,
                height: 480
            });

            //If the blob hits the top or bottom of the stage, reverse
            //its direction
            if (blobHitsWall === "top" || blobHitsWall === "bottom") {
                blob.vy *= -1;
            }

            //Test for a collision. If any of the enemies are touching
            //the explorer, set `explorerHit` to `true`
            if (hitTestRectangle(this.explorer, blob)) {
                explorerHit = true;
            }
        });

        //If the explorer is hit...
        if (explorerHit && !this.immune) {
            this.immune = true;
            this.healthBar.updateHealthPoint(-30);
            console.log(this.healthBar.x, this.healthBar.y, this.healthBar);
            console.log(this.dungeon.x, this.dungeon.y, this.dungeon);


            let interval = setInterval(() => {
                if (this.explorer.alpha == 1) this.explorer.alpha = 0.5;
                else this.explorer.alpha = 1;
            }, 200);

            setTimeout(() => {
                clearInterval(interval);
                this.explorer.alpha = 1;
                this.immune = false;
            }, 1200);
        }


        //Check for a collision between the explorer and the treasure
        if (hitTestRectangle(this.explorer, this.treasure)) {

            //If the treasure is touching the explorer, center it over the explorer
            this.treasure.setPosition(this.explorer.x + 8, this.explorer.y + 8);
        }

        //Does the explorer have enough health? If the width of the `innerBar`
        //is less than zero, end the game and display "You lost!"
        if (this.healthBar.point < 0) {
            this.end();
            this.message.text = "You lost!";
            this.ticker.stop();
        }

        //If the explorer has brought the treasure to the exit,
        //end the game and display "You won!"
        if (hitTestRectangle(this.treasure, this.door)) {
            this.end();
            this.message.text = "You won!";
            this.ticker.stop();
        }
        this.explorer.playerUpdate(delta);
    }

    end() {
        this.gameScene.setVisible(false);
        this.gameOverScene.setVisible(true);
    }

    setupController() {
        let left = new Keyboard(37),
            up = new Keyboard(38),
            right = new Keyboard(39),
            down = new Keyboard(40);

        //Left arrow key `press` method
        left.press = () => {

            //Change the explorer's velocity when the key is pressed
            this.explorer.vx = -2;

        };

        //Left arrow key `release` method
        left.release = () => {


            if (right.isDown) {
                this.explorer.vx = +2;
            } else {
                this.explorer.vx = 0;
            }
        };

        //Up
        up.press = () => {
            this.explorer.vy = -2;

        };
        up.release = () => {
            if (down.isDown) {
                this.explorer.vy = +2;
            } else {
                this.explorer.vy = 0;
            }

        };

        //Right
        right.press = () => {
            this.explorer.vx = +2;
        };
        right.release = () => {
            if (left.isDown) {
                this.explorer.vx = -2;
            } else {
                this.explorer.vx = 0;
            }
        };

        //Down
        down.press = () => {
            this.explorer.vy = +2;
        };
        down.release = () => {
            if (up.isDown) {
                this.explorer.vy = -2;
            } else {
                this.explorer.vy = 0;
            }
        };
    }





}