import * as PIXI from 'pixi.js';

import Action from './Action';

export default abstract class TargetedAction extends Action {
	target: PIXI.DisplayObject;
	
	constructor(target: PIXI.DisplayObject) {
		super();
		this.target = target;
	}
};