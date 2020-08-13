import {IHydrateDataComponent} from "~interfaces/hydrateData";
import {ReactElement} from "react";
import components from "~src/components";
import * as React from "react";

export function render(children?: IHydrateDataComponent['children'] | ReactElement | ReactElement[]): Array<ReactElement | null | string> | null | ReactElement | string {
	if (!children) {
		return null;
	}
	if (typeof children === 'string') {
		return children;
	}
	if ((children as any).$$typeof) {
		return children as ReactElement;
	}

	const result = (children as Array<any>).map((item, index) => {
		if (!item) {
			return null;
		}
		if (typeof item === 'string') {
			return item;
		}
		if ((item as any).$$typeof) {
			return item;
		}
		if (!item || !item.name || !(components as any)[item.name]) return null;
		const props = {
			...( item.props || {}),
			children: (item.children || (item.props || {children: []}).children),
		}
		return React.createElement((components as any)[item.name], props);
	}) as any;

	if (result.length === 0) {
		return null;
	}

	if (result.length === 1) {
		return result[0];
	}

	return React.createElement(React.Fragment, {}, ...result);
}
export function r(children?: IHydrateDataComponent['children'] | ReactElement | ReactElement[]) {
	return render(children);
}