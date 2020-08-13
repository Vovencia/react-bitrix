import * as React from 'react';
import {AnchorHTMLAttributes} from "react";
import styled from "styled-components";
import {IComponent} from "~interfaces/component";
import {r} from "~utils/render";
import {useRouter} from "~utils/Router";

export const Link: IComponent<AnchorHTMLAttributes<HTMLAnchorElement>> = ({children, onClick, ...props}) => {
	const router = useRouter();

	return (
		<LinkElement {...props} onClick={handlerOnClick}>{ r(children) }</LinkElement>
	);

	function handlerOnClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		const href = (e.target as HTMLAnchorElement).href || location.origin;
		const isSameOrigin = href.indexOf(location.origin) === 0;
		if (isSameOrigin) {
			e.preventDefault();
			router.go(href).then(() => {});
		}

		if (onClick) {
			onClick(e);
		}
	}
};

export const LinkElement = styled.a``;