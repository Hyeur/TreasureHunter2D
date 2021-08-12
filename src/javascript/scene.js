import { Container } from 'pixi.js';

export default class Scene extends Container {
    constructor() {
        super();
    }

    setVisible(visible) {
        this.visible = visible;
    }

    addChild(child) {
        super.addChild(child);
    }
}