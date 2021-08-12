export default class Keyboard {

    constructor(keyCode) {
        this.keyCode = keyCode;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;
        this.handle();
    }

    //The `downHandler`
    downHandler(event) {
        if (event.keyCode === this.keyCode) {
            if (this.isUp && this.press) this.press();
            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    upHandler(event) {
        if (event.keyCode === this.keyCode) {
            if (this.isDown && this.release) this.release();
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    handle() {
        window.addEventListener(
            "keydown", this.downHandler.bind(this), false
        );
        window.addEventListener(
            "keyup", this.upHandler.bind(this), false
        );
    }
}