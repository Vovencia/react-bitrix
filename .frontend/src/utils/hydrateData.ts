import {IHydrateData} from "~interfaces/hydrateData";

let _hydrateData: IHydrateData | {} = {};

export function setHydrateData(hydrateData: IHydrateData) {
	if (!hydrateData) {
		return;
	}
	_hydrateData = hydrateData;
}
export function getHydrateData(): IHydrateData | {} {
	return _hydrateData || {};
}

try {
	(window as any).__setHydrateData = setHydrateData;
} catch (e) {}