import Interpolation from './Interpolation';

export default class Interpolations {
	static linear: Interpolation = (x: number) => x;
	
	static smooth: Interpolation = (x: number) => x * x * (3 - 2 * x);
	static smooth2: Interpolation = (x: number) => Interpolations.smooth(Interpolations.smooth(x));
	static smoother: Interpolation = (a: number) => a * a * a * (a * (a * 6 - 15) + 10);
	static fade: Interpolation = Interpolations.smoother;
	
	static pow2out: Interpolation = (x: number) => Math.pow(x - 1, 2) * (-1) + 1;
};