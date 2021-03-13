import * as PIXI from 'pixi.js';
import Action from './actions/Action';
import Interpolation from './Interpolation';
import Interpolations from './Interpolations';

import MoveTo from './actions/MoveTo';
import ScaleTo from './actions/ScaleTo';
import RotateTo from './actions/RotateTo';
import Sequence from './actions/Sequence';
import Parallel from './actions/Parallel';
import Repeat from './actions/Repeat';
import FadeTo from './actions/FadeTo';
import Delay from './actions/Delay';
import RunFunc from './actions/RunFunc';

export default class Actions {
	static actions: Array<Action> = [];
	
	static moveTo(
		target: PIXI.DisplayObject, 
		x: number, 
		y: number, 
		seconds: number, 
		interpolation: Interpolation = Interpolations.pow2out): Action
	{
		return new MoveTo(target, x, y, seconds, interpolation);
	}
	
	static fadeTo(
		target: PIXI.DisplayObject, 
		alpha: number,
		seconds: number, 
		interpolation: Interpolation = Interpolations.pow2out): Action
	{
		return new FadeTo(target, alpha, seconds, interpolation);
	}
	
	static fadeOut(
		target: PIXI.DisplayObject,
		seconds: number, 
		interpolation: Interpolation = Interpolations.pow2out): Action
	{
		return Actions.fadeTo(target, 0, seconds, interpolation);
	}
	
	static fadeOutAndRemove(
		target: PIXI.DisplayObject,
		seconds: number, 
		interpolation: Interpolation = Interpolations.pow2out): Action
	{
		return Actions.sequence(
			target,
			Actions.fadeOut(target, seconds, interpolation),
			Actions.remove(target)
		);
	}
	
	static fadeIn(
		target: PIXI.DisplayObject,
		seconds: number, 
		interpolation: Interpolation = Interpolations.pow2out): Action
	{
		return Actions.fadeTo(target, 1, seconds, interpolation);
	}
	
	static remove(
		target: PIXI.DisplayObject): Action
	{
		return Actions.runFunc(target, () => {
			if (target.parent != null)
				target.parent.removeChild(target);
		});
	}
	
	static delay(
		target: PIXI.DisplayObject, 
		seconds: number): Action
	{
		return new Delay(target, seconds);
	}
	
	static runFunc(
		target: PIXI.DisplayObject, 
		fn: () => void): Action
	{
		return new RunFunc(target, fn);
	}
	
	static scaleTo(
		target: PIXI.DisplayObject, 
		x: number, 
		y: number, 
		seconds: number, 
		interpolation: Interpolation = Interpolations.pow2out): Action
	{
		return new ScaleTo(target, x, y, seconds, interpolation);
	}
	
	static rotateTo(
		target: PIXI.DisplayObject, 
		rotation: number,
		seconds: number, 
		interpolation: Interpolation = Interpolations.pow2out): Action
	{
		return new RotateTo(target, rotation, seconds, interpolation);
	}
	
	static sequence(
		target: PIXI.DisplayObject, 
		...actions: Array<Action>): Action
	{
		return new Sequence(target, ...actions);
	}
	
	static parallel(
		target: PIXI.DisplayObject, 
		...actions: Array<Action>): Action
	{
		return new Parallel(target, ...actions);
	}
	
	static repeat(
		target: PIXI.DisplayObject, 
		action: Action,
		times: number = -1): Action
	{
		return new Repeat(target, action, times);
	}
	
	static play(action: Action) {
		this.actions.push(action);
	}
	
	static tick(delta: number) {
		for (let i = this.actions.length - 1; i >= 0; i--) {
			const action: Action = this.actions[i];
			
			// If action is null, or has no parent, we remove the action
			if (action.target == null || ! action.target.parent) {
				this.actions.splice(i, 1);
				continue;
			}
			
			// Otherwise, we tick the action
			const done = action.tick(delta);
			if (done) {
				action.done = true;
				this.actions.splice(i, 1);
				
				// Are there any queued events?
				for (let j = 0; j < action.queued.length; j++) {
					Actions.play(action.queued[j]);
				}
			}
		}
	}
};