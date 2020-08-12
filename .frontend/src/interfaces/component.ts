import {ReactElement} from 'react';
import {IHydrateDataComponent} from "./hydrateData";

export type IComponent<TProps extends {
	[key: string]: any;
} = {}> = (
	props: TProps & {
		children?: (IHydrateDataComponent['children'] | ReactElement | ReactElement[])
	},
	context?: any,
) => ReactElement<any, any> | null;