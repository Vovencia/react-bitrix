export function resolve(...paths: string[]): string {
	paths = paths.join('/').replace(/\\/g, '/').split('/');
	const result: string[] = [];

	if (!paths[0]) {
		paths[0] = '/';
	}
	for (const item of paths) {
		if (item === '..') {
			result.pop();
			continue;
		}
		if (/^\.*$/.test(item)) {
			continue;
		}
		result.push(item);
	}

	let resultStr = result.filter(Boolean).join('/') || '/';

	if (/^[a-zA-Z]:\//.test(resultStr)) {
		resultStr = resultStr.replace(/\//g, '\\');
	}

	return resultStr;
}