import * as PIXI from 'pixi.js';

export default abstract class Action {
	done: boolean = false;
	target: PIXI.DisplayObject;
	queued: Array<Action> = [];
	abstract tick(progress: number):boolean;
	
	constructor(target: PIXI.DisplayObject) {
		this.target = target;
	}
	
	queue(after: Action) {
		this.queued.push(after);
	}
	
	reset() {
		this.done = false;
	}
};