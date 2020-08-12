import * as React from 'react';
import {IHydrateData} from "../../interfaces/hydrateData";
import {r} from "../../utils/core";
import styled, {createGlobalStyle} from "styled-components";

export const App: React.FC<{hydrateData: IHydrateData}> = ({hydrateData}) => {
	if (!hydrateData) {
		hydrateData = {};
	}
	return (
		<AppElement>
			<GlobalStyle />
			{ r(hydrateData.components) }
		</AppElement>
	);
}

export const AppElement = styled.div``;
const GlobalStyle = createGlobalStyle`
	*,
	*:after,
	*:before {
		box-sizing: border-box;
		outline: none;
	}
	html,
	body,
	#root,
	${AppElement} {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	body,
	#root,
	${AppElement} {
		min-height: 100%;
		flex-grow: 1;
		flex-shrink: 1;
	}
	html,
	body {
		margin: 0;
		padding: 0;
	}
	html {
		flex-grow: 0;
		flex-shrink: 0;
		height: 100%;
		font-size: 1px;
		line-height: 1.2;
		font-family: Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif;
		cursor: default;
		user-select: none;
	}
	body {
		font-size: 16rem;
	}
	a {
		color: #0A3A68;
	}
	a,
	button,
	input[type="button"],
	input[type="submit"] {
		cursor: pointer;
	}
`;