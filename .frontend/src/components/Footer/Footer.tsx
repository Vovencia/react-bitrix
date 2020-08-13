import * as React from 'react';
import {IComponent} from "~interfaces/component";
import {Wrapper} from "~components/Wrapper/Wrapper";
import styled from "styled-components";
import {useMemo} from "react";

export const Footer: IComponent = () => {
	return useMemo(() => {
		return (
			<FooterElement>
				<Wrapper>React with bitrix © 2020</Wrapper>
			</FooterElement>
		);
	}, []);
}
export const FooterElement = styled.div`
	background: #0c6590;
	color: #fff;
	padding: 30px 0;
	flex-grow: 0;
	flex-shrink: 0;
`;