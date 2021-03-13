import * as PIXI from 'pixi.js';
import Action from './Action';

export default class RunFunc extends Action {
	fn: () => void;
	
	constructor(
		target: PIXI.DisplayObject,
		fn: () => void)
	{
		super(target);
		this.fn = fn;
	}
	
	tick(delta: number): boolean {
		this.fn.call(this.target);
		return true;
	}
};