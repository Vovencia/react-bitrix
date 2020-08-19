import * as React from 'react';
import {IComponent} from "~interfaces/component";
import {Wrapper} from "~components/Wrapper/Wrapper";
import styled from "styled-components";
import {useMemo} from "react";

export const Footer: IComponent = () => {
	return useMemo(() => {
		const year = (new Date()).getFullYear().toString(10);
		return (
			<FooterElement>
				<Wrapper>React with bitrix © { year }</Wrapper>
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