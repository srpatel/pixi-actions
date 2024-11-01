import TargetedAction from "./TargetedAction";
import Interpolation from "../Interpolation";
import Interpolations from "../Interpolations";
import type { Target } from "./TargetedAction";

export default class RotateTo extends TargetedAction {
	time: number = 0;
	declare seconds: number;
	interpolation: Interpolation;
	startRotation: number;
	rotation: number;

	constructor(
		target: Target,
		rotation: number,
		seconds: number,
		interpolation: Interpolation = Interpolations.linear
	) {
		super(target, seconds);
		this.interpolation = interpolation;
		this.rotation = rotation;
		this.startRotation = target.rotation;
	}

	tick(delta: number): boolean {
		if (this.time === 0) {
			this.startRotation = this.target.rotation;
		}

		this.time += delta;

		const factor: number = this.interpolation(this.timeDistance);
		this.target.rotation =
			this.startRotation + (this.rotation - this.startRotation) * factor;
		return this.timeDistance >= 1;
	}

	reset() {
		super.reset();
		this.time = 0;
		return this;
	}
}
