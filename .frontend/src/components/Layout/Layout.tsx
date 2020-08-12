import * as React from 'react';
import {IComponent} from "../../interfaces/component";
import {core} from "../../utils/core";
import {Header} from "../Header/Header";
import {Footer} from "../Footer/Footer";

export const Layout: IComponent = ({children}) => {
	return (
		<div className="Layout">
			<Header />
			{ core.render(children) }
			<Footer />
		</div>
	);
}