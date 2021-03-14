import * as PIXI from 'pixi.js';
import Action from './Action';
import Interpolation from '../Interpolation';
import Interpolations from '../Interpolations';

export default class Repeat extends Action {
	action: Action;
	times: number;
	n: number = 0;
	
	constructor(action: Action, times: number = -1) {
		super();
		this.action = action;
		this.times = times;
	}
	
	tick(delta: number): boolean {
		if (this.action.tick(delta)) {
			this.n++;
			if (this.times >= 0 && this.n >= this.times) {
				return true;
			} else {
				// reset delta!
				this.reset();
			}
		}
		return false;
	}
	
	reset() {
		super.reset();
		this.action.reset();
		return this;
	}
};