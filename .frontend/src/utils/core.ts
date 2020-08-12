import * as React from 'react';
import components from '../components';
import {ReactElement} from "react";
import {IHydrateDataComponent} from "../interfaces/hydrateData";

class Core {
	public render(children?: IHydrateDataComponent['children'] | ReactElement | ReactElement[]): Array<ReactElement | null | string> | null | ReactElement | string {
		if (!children) {
			return null;
		}
		if (typeof children === 'string') {
			return children;
		}
		console.log('children', children);
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
				key: index,
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

		return result;
	}
}

export const core = new Core;

export function r(children?: IHydrateDataComponent['children'] | ReactElement | ReactElement[]) {
	return core.render(children);
}