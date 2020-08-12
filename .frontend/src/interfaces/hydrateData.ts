export interface IHydrateData {
	components?: IHydrateDataComponent[];
}

export interface IHydrateDataComponent {
	name: string;
	props?: {[key: string]: any};
	children?: Array<string | IHydrateDataComponent | null> | string;
}