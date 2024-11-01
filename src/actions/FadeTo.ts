import TargetedAction from "./TargetedAction";
import Interpolation from "../Interpolation";
import Interpolations from "../Interpolations";
import type { Target } from "./TargetedAction";

export default class FadeTo extends TargetedAction {
	interpolation: Interpolation;
	startAlpha: number;
	alpha: number;

	constructor(
		target: Target,
		alpha: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.linear
	) {
		super(target, seconds);
		this.interpolation = interpolation;
		this.alpha = alpha;
		this.startAlpha = target.alpha;
	}

	tick(delta: number): boolean {
		if (this.time === 0) {
			this.startAlpha = this.target.alpha;
		}

		this.time += delta;

		const factor: number = this.interpolation(this.timeDistance);
		this.target.alpha =
			this.startAlpha + (this.alpha - this.startAlpha) * factor;
		return this.timeDistance >= 1;
	}

	reset() {
		super.reset();
		this.time = 0;
		return this;
	}
}
