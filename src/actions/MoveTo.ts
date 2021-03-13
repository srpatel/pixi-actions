import * as PIXI from 'pixi.js';
import Action from './Action';
import Interpolation from '../Interpolation';
import Interpolations from '../Interpolations';

export default class MoveTo extends Action {
	time: number = 0;
	seconds: number;
	interpolation: Interpolation;
	startX: number;
	startY: number;
	x: number;
	y: number;
	
	constructor(
		target: PIXI.DisplayObject,
		x: number, 
		y: number, 
		seconds: number, 
		interpolation: Interpolation = Interpolations.linear)
	{
		super(target);
		this.seconds = seconds;
		this.interpolation = interpolation;
		this.x = x;
		this.y = y;
	}
	
	tick(delta: number): boolean {
		if (this.time === 0) {
			this.startX = this.target.x;
			this.startY = this.target.y;
		}
		
		this.time += delta;
		
		const factor: number = this.interpolation(Math.min(1, this.time/this.seconds));
		this.target.position.set(
			this.startX + (this.x - this.startX) * factor,
			this.startY + (this.y - this.startY) * factor,
		);
		return factor >= 1;
	}
	
	reset() {
		super.reset();
		this.time = 0;
	}
};