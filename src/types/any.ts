import Context from '../ctx';

/**
 * Any
 */
export default class AnyContext<T = any> extends Context<T> {
	public getType(): string {
		return super.getType('any');
	}
}
