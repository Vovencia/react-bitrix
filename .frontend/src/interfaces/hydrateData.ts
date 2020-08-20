export interface IHydrateData {
	url?: string;
	content?: IHydrateDataComponent[];
	error?: {
		message?: string;
		code?: number | string;
	};
}

export interface IHydrateDataComponent {
	type: 'tag' | 'text';
	tag?: string;
	props?: {[key: string]: any};
	children?: Array<string | IHydrateDataComponent | null> | string;
}