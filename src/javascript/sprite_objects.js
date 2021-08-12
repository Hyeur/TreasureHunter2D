import { Sprite } from 'pixi.js';

export default class SpriteObject extends Sprite {

    constructor(textureCache) {
        super(textureCache);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }
    update(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }
    playerUpdate(delta) {
        let addX = this.vx * delta;
        let addY = this.vy * delta;

        if (this.x + addX >= 28 && this.x + addX <= 512 - 50)
            this.x += addX;
        if (this.y + addY >= 20 && this.y + addY <= 512 - 65)
            this.y += addY;
    }

}