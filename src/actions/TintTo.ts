import * as PIXI from 'pixi.js';
import TargetedAction from './TargetedAction';
import Interpolation from '../Interpolation';
import Interpolations from '../Interpolations';

export default class TintTo extends TargetedAction {
	interpolation: Interpolation;
	tintableTarget: PIXI.Sprite | PIXI.BitmapText | PIXI.Graphics | PIXI.Mesh = null;
	startTint: Array<number> | Float32Array;
	tint: Array<number> | Float32Array;
	
	constructor(
		target: PIXI.DisplayObject,
		tint: number, 
		seconds: number, 
		interpolation: Interpolation = Interpolations.linear)
	{
		super(target, seconds);
		this.interpolation = interpolation;
		this.tint = PIXI.utils.hex2rgb(tint);
		
		if (this.target instanceof PIXI.Sprite) {
			this.tintableTarget = this.target;
		}
	}
	
	tick(delta: number): boolean {
		if (! this.tintableTarget) {
			return true;
		}

		if (this.time === 0) {
			this.startTint = PIXI.utils.hex2rgb(this.tintableTarget.tint);
		}
		
		this.time += delta;
		
		const factor: number = this.interpolation(this.timeDistance);
		const currentTint = [0, 0, 0];
		for (let i = 0; i < currentTint.length; i++) {
			currentTint[i] = this.startTint[i] + (this.tint[i] - this.startTint[i]) * factor;
		}
		this.tintableTarget.tint = PIXI.utils.rgb2hex(currentTint);
		return this.timeDistance >= 1;
	}
	
	reset() {
		super.reset();
		this.time = 0;
		return this;
	}
};