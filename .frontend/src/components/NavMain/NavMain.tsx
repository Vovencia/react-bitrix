import * as React from 'react';
import {IComponent} from "../../interfaces/component";
import {useStore} from "../../utils/store";

export const NavMain: IComponent = () => {
	const mainNavItems = useStore('nav:main');
	console.log('mainNavItems', mainNavItems);

	return (
		<div className="nav-main">

		</div>
	);
}