import * as React from 'react';
import {FC} from "react";
import styled from "styled-components";

import {IComponent} from "~interfaces/component";
import {Link} from "~components/Link/Link";


export const Nav: IComponent<{
	items?: INavList;
	params?: {};
}> = ({items, className, params}) => {
	if (!items) {
		return null;
	}

	return (
		<NavElement className={className}>
			<NavList items={items} depth={1} />
		</NavElement>
	);
}
export const NavList: FC<{items?: INavList, depth?: number}> = ({items, depth}) => {
	if (!items || !items.length) {
		return null;
	}
	if (depth == null) {
		depth = 1;
	}

	const $items = items.map((item, index) => <NavItem key={index} item={item} />);

	return (
		<NavListElement className={`_depth-${depth}`}>
			{$items}
		</NavListElement>
	);
}
export const NavItem: FC<{item?: INavItem}> = ({item}) => {
	if (!item) {
		return null;
	}
	const {depth} = item;
	const className = [
		`_depth-${depth}`,
		item.items.length ? '_with-sub' : '',
		item.current ? '_current' : '',
		item.current_submenu && !item.current ? '_current_submenu' : '',
	].filter(Boolean).join(' ');
	return (
		<NavItemElement
			className={className}
		>
			<NavLink
				className={className}
				{
					...{
						href: item.current ? undefined : item.url
					}
				}
				as={item.current ? 'span' : NavLink}
			>
				{ item.text }
			</NavLink>
			<NavList items={item.items} depth={item.depth + 1} />
		</NavItemElement>
	);
}
export const NavElement	= styled.div``;
export const NavListElement = styled.div``;
export const NavItemElement = styled.div``;
export const NavLink = styled(Link)``;


export type INavList = INavItem[];
export interface INavItem {
	current: boolean;
	current_submenu: boolean;
	depth: number;
	items: INavList;
	text: string;
	url: string;
}