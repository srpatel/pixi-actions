import Interpolation from './Interpolation';

export default class Interpolations {
	static linear: Interpolation = (x: number) => x;
	static pow2out: Interpolation = (x: number) => Math.pow(x - 1, 2) * (-1) + 1;
};