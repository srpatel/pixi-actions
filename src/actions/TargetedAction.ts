import * as PIXI from 'pixi.js';

import Action from './Action';

export type Target = PIXI.DisplayObject | PIXI.Container;
export default abstract class TargetedAction extends Action {
	time: number = 0;
	seconds: number;
	target: Target;
	
	constructor(target: Target, seconds: number) {
		super();
		this.seconds = seconds;
		this.target = target;
	}

	get timeDistance(): number {
		return Math.min(1, this.time / this.seconds)
	}
};
