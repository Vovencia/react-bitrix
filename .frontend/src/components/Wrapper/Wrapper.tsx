import * as React from 'react';
import styled from "styled-components";
import {IComponent} from "~interfaces/component";
import {r} from "~utils/render";

export const Wrapper: IComponent = ({children}) => {
	return (
		<WrapperElement>
			{ r(children) }
		</WrapperElement>
	);
}

export const WrapperElement = styled.div`
	width: calc(100% - 40px);
	max-width: 1000px;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
`;