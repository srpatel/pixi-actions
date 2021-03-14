import * as PIXI from 'pixi.js';
import Action from './Action';
import Interpolation from '../Interpolation';
import Interpolations from '../Interpolations';

export default class Parallel extends Action {
	index: number = 0;
	actions: Array<Action>;
	
	constructor(...actions: Array<Action>) {
		super();
		this.actions = actions;
	}
	
	tick(delta: number): boolean {
		// Tick all elements!
		let allDone = true;
		for (let i = 0; i < this.actions.length; i++) {
			const action = this.actions[i];
			if (! action.done) {
				if (action.tick(delta)) {
					action.done = true;
				} else {
					allDone = false;
				}
			}
		}
		
		return allDone;
	}
	
	reset() {
		super.reset();
		this.index = 0;
		for (const i in this.actions) {
			this.actions[i].reset();
		}
		return this;
	}
};