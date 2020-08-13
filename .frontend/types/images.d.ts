declare module "*.png" {
	const content: string;
	export default content;
}
declare module "*.jpg" {
	const content: string;
	export default content;
}
declare module "*.gif" {
	const content: string;
	export default content;
}
// // Some do it the other way around.
// declare module "json!*" {
// 	const value: any;
// 	export default value;
// }