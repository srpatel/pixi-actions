import * as PIXI from 'pixi.js';
import Action from './Action';

export default class RunFunc extends Action {
	fn: () => void;
	
	constructor(fn: () => void) {
		super();
		this.fn = fn;
	}
	
	tick(delta: number): boolean {
		this.fn.call(this);
		return true;
	}
};