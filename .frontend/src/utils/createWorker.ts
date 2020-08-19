export function createWorker(fn: () => void): Worker {
	// ref: https://stackoverflow.com/a/10372280/387194
	const str = '(' + fn.toString() + ')()';
	const URL = window.URL || window.webkitURL;
	let blob: any;
	try {
		blob = new Blob([str], {type: 'application/javascript'});
	} catch (e) { // Backwards-compatibility
		const BlobBuilder = (window as any).BlobBuilder ||
			(window as any).WebKitBlobBuilder ||
			(window as any).MozBlobBuilder;
		blob = new BlobBuilder();
		blob.append(str);
		blob = blob.getBlob();
	}
	return new Worker(URL.createObjectURL(blob));
}