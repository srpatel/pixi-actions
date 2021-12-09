import * as PIXI from 'pixi.js';

import Action from './Action';

export default abstract class TargetedAction extends Action {
	time: number = 0;
	seconds: number;
	target: PIXI.DisplayObject;
	
	constructor(target: PIXI.DisplayObject, seconds: number) {
		super();
		this.seconds = seconds;
		this.target = target;
	}

	get timeDistance(): number {
		return Math.min(1, this.time / this.seconds)
	}
};