import * as React from 'react';
import ReactHtmlParser from 'react-html-parser';
import {IComponent} from "../../interfaces/component";

export const Html: IComponent = ({children}) => {
	if (Array.isArray(children)) {
		children = (children[0] as any) || null;
	}
	if (typeof children === 'string') {
		return ReactHtmlParser(children) as any;
	}
	return null;
}