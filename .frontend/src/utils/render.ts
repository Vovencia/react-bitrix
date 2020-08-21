import {IHydrateDataComponent} from "~interfaces/hydrateData";
import {ReactElement} from "react";
import components from "~src/components";
import * as React from "react";
import {IComponent} from "~interfaces/component";
import {base64} from "~utils/base64";
import {prepareProps} from "~utils/prepareProps";

type IElement = ReactElement | null | string;

enum IGNORE_TAG {
	script = 1,
}

export function render(children?: IHydrateDataComponent['children'] | ReactElement | ReactElement[]): Array<IElement> | IElement {
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
		item = item as IHydrateDataComponent;
		if (!item) return null;
		if (!item.tag && !item.type) return null;

		item = item as IHydrateDataComponent;

		let tag: string | IComponent = '';

		if (item.type === "text") {
			if (typeof item.children === 'string') {
				return item.children;
			}
			if (Array.isArray(item.children) && typeof item.children[0] === 'string') {
				return item.children[0];
			}
			return null;
		}

		if (typeof item.tag !== 'string') {
			return null;
		}

		if (IGNORE_TAG[item.tag]) {
			return null;
		}

		if (/^[A-Z]/.test(item.tag)) {
			tag = components[item.tag];
		} else {
			tag = item.tag;
		}

		if (!tag) return null;

		if (!item.props) {
			item.props = {};
		}

		if (item.props[':props']) {
			let _props: any = item.props[':props'];
			delete item.props[':props'];
			try {
				_props = base64.decode(_props);
				_props = JSON.parse(_props);
				item.props = {
					..._props,
					...item.props,
				}
			} catch (e) {}
		}

		item.props = prepareProps(item.props);

		let children = render(item.children || item.props.children);
		if (Array.isArray(children) && children.length == 0) {
			children = null;
		}
		const props = {
			...( item.props || {}),
			children: children == null ? undefined : children,
		}
		return React.createElement(tag, props);
	}).filter(Boolean) as any;

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