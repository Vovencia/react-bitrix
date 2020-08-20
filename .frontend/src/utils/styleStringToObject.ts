import {toCameCase} from "~utils/toCameCase";
import {IObject} from "~utils/IObject";

export function styleStringToObject(style: string | IObject) {
	if (typeof style === 'string') {
		style = style.split(';').reduce(function (ruleMap: {[key: string]: any}, ruleString: string) {
			let [name, value] = ruleString.split(':');
			name = name.trim();
			value = value.trim();
			ruleMap[name] = value.trim();
			return ruleMap;
		}, {} as {[key: string]: any});
	}

	for (let name in style) {
		if (!Object.prototype.hasOwnProperty.call(style, name)) {
			continue;
		}
		if (typeof (name as any) !== 'string') {
			continue;
		}
		const value = style[name];
		delete style[name];
		name = toCameCase(name);
		style[name] = value;
	}

	return style;
}