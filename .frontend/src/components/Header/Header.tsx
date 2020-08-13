import * as React from 'react';
import styled from "styled-components";

import logoUrl from '~images/logo.png';

import {IComponent} from "~interfaces/component";
import {NavMain, NavMainElement} from "~components/NavMain/NavMain";
import {Wrapper} from "~components/Wrapper/Wrapper";
import {Link} from "~components/Link/Link";
import {useMemo} from "react";

export const Header: IComponent = () => {
	return useMemo(() => {
		return (
			<HeaderElement>
				<Wrapper>
					<HeaderContent>
						<HeaderLogo>
							<Link href="/">
								<HeaderLogoImage src={logoUrl} alt="Logo" />
							</Link>
						</HeaderLogo>
						<NavMain />
					</HeaderContent>
				</Wrapper>
			</HeaderElement>
		);
	}, []);
}

export const HeaderElement = styled.div`
	color: #fff;
	background: #0A3A68;
	flex-grow: 0;
	flex-shrink: 0;
	${NavMainElement} {
		margin-left: auto;
	}
`;
export const HeaderContent = styled.div`
	padding: 20px 0;
	display: flex;
	flex-direction: row;
	width: 100%;
	align-items: center;
`;
export const HeaderLogo = styled.div`
	flex-grow: 0;
	flex-shrink: 0;
	a,
	img {
		display: block;
		text-decoration: none;
	}
`;
export const HeaderLogoImage = styled.img`
	width: auto;
	height: 40px;
	display: block;
`;