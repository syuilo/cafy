export default function(target: any, key: string, descriptor: PropertyDescriptor) {
	const fn = descriptor.value || descriptor.get;

	return {
		configurable: true,

		get() {
			const bound = fn.bind(this);
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				value: bound
			});
			return bound;
		}
	};
};
