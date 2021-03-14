import * as PIXI from 'pixi.js';

import Actions from '../Actions';

export default abstract class Action {
	done: boolean = false;
	queued: Array<Action> = [];
	abstract tick(progress: number):boolean;
	
	queue(after: Action) {
		this.queued.push(after);
	}
	
	play() {
		Actions.play(this);
	}
	
	pause() {
		Actions.pause(this);
	}
	
	reset() {
		this.done = false;
	}
	
	stop() {
		this.pause();
		this.reset();
	}
};