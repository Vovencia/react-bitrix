import {ReactElement} from 'react';
import {IHydrateDataComponent} from "~interfaces/hydrateData";

export type IComponent<TProps extends {
	[key: string]: any;
} = {}> = (
	props: TProps & {
		className?: string;
		style?: any;
		children?: (IHydrateDataComponent['children'] | ReactElement | ReactElement[])
	},
	context?: any,
) => ReactElement<any, any> | null;