import * as React from 'react';
import {IComponent} from "../../interfaces/component";
import {NavMain} from "../NavMain/NavMain";
import {Wrapper} from "../Wrapper/Wrapper";
import styled from "styled-components";

export const Header: IComponent = () => {
	return (
		<HeaderElement>
			<Wrapper>
				<HeaderContent>
					<HeaderLogo>
						<a>
							<HeaderLogoImage>Logo</HeaderLogoImage>
						</a>
					</HeaderLogo>
					<NavMain />
				</HeaderContent>
			</Wrapper>
		</HeaderElement>
	);
}

export const HeaderElement = styled.div`
	color: #fff;
	background: #0A3A68;
`;
export const HeaderContent = styled.div`
	padding: 30px 0;
	display: flex;
	flex-direction: row;
	width: 100%;
`;
export const HeaderLogo = styled.div`
	margin: -30px 0;
	flex-grow: 0;
	flex-shrink: 0;
	a {
		display: block;
		text-decoration: none;
	}
`;
export const HeaderLogoImage = styled.span`
	width: 200px;
	height: 60px;
	background: #ccc;
	display: flex;
	align-items: center;
	justify-content: center;
`;