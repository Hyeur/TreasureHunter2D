import { Container, Graphics } from 'pixi.js'

export default class HealthPointBar extends Container {
    constructor(x, y) {
        super();
        this.position.set(x, y);
        this.w = 128;
        this.h = 8;
        this.point = 100;

        //Create the black background rectangle
        let innerBar = new Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, this.w, this.h);
        innerBar.endFill();
        innerBar.x = 0;
        innerBar.y = 0;
        this.addChild(innerBar);

        //Create the front red rectangle
        let outerBar = new Graphics();
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, this.w, this.h);
        outerBar.endFill();
        outerBar.x = 0;
        outerBar.y = 0;
        this.addChild(outerBar);

        this.outer = outerBar;
    }

    updateHealthPoint(pointLoss) {
        this.point += pointLoss;
        this.outer.width = Math.floor(this.point / 100 * this.w);
    }
}