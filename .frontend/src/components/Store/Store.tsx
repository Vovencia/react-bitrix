import {IComponent} from "../../interfaces/component";
import {store} from "../../utils/store";

export const Store: IComponent<{
	name: string;
	value: any;
}> = ({name, value}) => {
	store.set(name, value);
	return null;
}