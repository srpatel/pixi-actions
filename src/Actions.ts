import * as PIXI from 'pixi.js';
import Action from './actions/Action';
import TargetedAction from './actions/TargetedAction';
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
import TintTo from './actions/TintTo';

import type { Target } from "./actions/TargetedAction";
import type { TintableTarget } from "./actions/TintTo";

export default class Actions {
	static actions: Array<Action> = [];

	static moveTo(
		target: Target,
		x: number,
		y: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return new MoveTo(target, x, y, seconds, interpolation);
	}

	static fadeTo(
		target: Target,
		alpha: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return new FadeTo(target, alpha, seconds, interpolation);
	}

	static fadeOut(
		target: Target,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return Actions.fadeTo(target, 0, seconds, interpolation);
	}

	static fadeOutAndRemove(
		target: Target,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return Actions.sequence(
			Actions.fadeOut(target, seconds, interpolation),
			Actions.remove(target)
		);
	}

	static fadeIn(
		target: Target,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return Actions.fadeTo(target, 1, seconds, interpolation);
	}

	static remove(target: Target): Action {
		return Actions.runFunc(() => {
			if (target.parent != null) target.parent.removeChild(target);
		});
	}

	static delay(seconds: number): Action {
		return new Delay(seconds);
	}

	static runFunc(fn: () => void): Action {
		return new RunFunc(fn);
	}

	static scaleTo(
		target: Target,
		x: number,
		y: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return new ScaleTo(target, x, y, seconds, interpolation);
	}

	static rotateTo(
		target: Target,
		rotation: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return new RotateTo(target, rotation, seconds, interpolation);
	}

	static angleTo(
		target: Target,
		degrees: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return Actions.rotateTo(
			target,
			PIXI.DEG_TO_RAD * degrees,
			seconds,
			interpolation
		);
	}

	static tintTo(
		target: TintableTarget,
		tint: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.pow2out
	): Action {
		return new TintTo(target, tint, seconds, interpolation);
	}

	static sequence(...actions: Array<Action>): Action {
		return new Sequence(...actions);
	}

	static parallel(...actions: Array<Action>): Action {
		return new Parallel(...actions);
	}

	static repeat(action: Action, times: number = -1): Action {
		return new Repeat(action, times);
	}

	static play(action: Action) {
		this.actions.push(action);
	}

	static pause(action: Action) {
		const index = this.actions.indexOf(action);
		if (index >= 0) {
			this.actions.splice(index, 1);
		}
	}

	static clear(target?: Target) {
		for (let i = this.actions.length - 1; i >= 0; i--) {
			const action: Action = this.actions[i];

			if (
				!target ||
				(action instanceof TargetedAction && action.target == target)
			) {
				this.actions.splice(i, 1);
			}
		}
	}

	static tick(delta: number) {
		for (let i = this.actions.length - 1; i >= 0; i--) {
			const action: Action = this.actions[i];

			if (action instanceof TargetedAction) {
				// If the action is targeted, but has no target, we remove the action
				// We also remove the action if the target has no parent to allow DisplayObjects outside the tree to be gc'd.
				if (action.target == null || !action.target.parent) {
					this.actions.splice(i, 1);
					continue;
				}
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
				action.queued = [];
			}
		}
	}
};