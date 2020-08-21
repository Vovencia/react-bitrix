const styles: IEjectStyle[] = [];

export interface IEjectStyle {
	path: string;
	content: string;
}
export function ejectStylesLoaderAdd(style: IEjectStyle) {
	styles.push(style);
}
export function ejectStylesLoaderGet() {
	return styles;
}