import * as PIXI from 'pixi.js';

import Actions from '../Actions';

export default abstract class Action {
	done: boolean = false;
	queued: Array<Action> = [];
	abstract tick(progress: number):boolean;
	
	queue(after: Action) {
		this.queued.push(after);
		return this;
	}
	
	play() {
		Actions.play(this);
		return this;
	}
	
	pause() {
		Actions.pause(this);
		return this;
	}
	
	reset() {
		this.done = false;
		return this;
	}
	
	stop() {
		this.pause().reset();
		return this;
	}
};