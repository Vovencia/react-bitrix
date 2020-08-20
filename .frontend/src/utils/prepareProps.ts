import {IObject} from "~utils/IObject";
import {safe} from "~utils/safe";
import {styleStringToObject} from "~utils/styleStringToObject";

export function prepareProps(props: IObject = {}): IObject {
	safe(() => {
		if (props.style && typeof props.style === 'string') {
			props.style = styleStringToObject(props.style);
		}
	});

	safe(() => {
		for (let name in props) {
			if (!Object.prototype.hasOwnProperty.call(props, name)) {
				continue;
			}
			if (typeof (name as any) !== 'string') {
				continue;
			}
			if (!/^on/.test(name)) {
				continue;
			}
			let value = props[name];
			if (typeof value !== 'string') {
				continue;
			}
			delete props[name];
			name = name.replace(/on([a-z])/g, function (g) { return "on" + g[2].toUpperCase(); });
			value = new Function(`event`, value);
			props[name] = value;
		}
	});

	return props;
}