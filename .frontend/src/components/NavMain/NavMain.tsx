import * as React from 'react';
import styled from "styled-components";

import {IComponent} from "~interfaces/component";
import {usePageStoreGet} from "~src/PageStore";
import {INavList, Nav, NavItemElement, NavLink, NavListElement} from "~components/Nav/Nav";

export const NavMain: IComponent = () => {
	const items = usePageStoreGet('nav:main') as INavList | undefined;
	if (!items || !items.length) return null;

	return (
		<NavMainElement items={items} />
	);
}

export const NavMainElement = styled(Nav)`
	color: #fff;
	font-size: 20rem;
	white-space: nowrap;
	user-select: none;
	a {
		color: inherit;
	}
	${NavListElement}._depth-1 {
		display: flex;
	}
	${NavListElement}._depth-2 {
		position: absolute;
		background: #fff;
		color: #000;
		top: 100%;
		left: -20px;
		padding: 20px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s;
		transition-property: opacity, visibility;
		&:before {
			content: '';
			position: absolute;
			top: -5px;
			left: 0;
			right: 0;
			height: 6px;
		}
	}
	${NavItemElement}._depth-1 {
		position: relative;
		margin-left: 20px;
	}
	${NavItemElement}._depth-1:hover > ${NavListElement} {
		opacity: 1;
		visibility: visible;
	}
	${NavItemElement}._depth-2 ~ ${NavItemElement}._depth-2 {
		margin-top: 10px;
	}
	${NavLink} {
		text-decoration: none;
		color: #000;
		transition: color 0.2s;
		&:hover {
			color: #0A3A68;
		}
		&._depth-1 {
			color: #fff;
			&:not(._current):hover {
				color: #ccc;
			}
		}
		&._current {
			color: #6f0b2d;
		}
	}
`;
