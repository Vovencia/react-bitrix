import * as React from 'react';
import {IComponent} from "~interfaces/component";
import {Header} from "~components/Header/Header";
import {Footer} from "~components/Footer/Footer";
import {Wrapper} from "~components/Wrapper/Wrapper";
import styled from "styled-components";

export const Layout: IComponent = ({children}) => {
	return (
		<LayoutElement>
			<Header />
			<LayoutContent>
				<Wrapper>
					{ children }
				</Wrapper>
			</LayoutContent>
			<Footer />
		</LayoutElement>
	);
}

const LayoutElement = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
`;
const LayoutContent = styled.div`
	flex-grow: 1;
	flex-shrink: 1;
`;