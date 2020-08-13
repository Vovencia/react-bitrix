import {IComponent} from "~interfaces/component";
import {useGetPageStore} from "~src/PageStore";
import {useEffect} from "react";

export const Store: IComponent<{
	name: string;
	value: any;
}> = ({name, value}) => {
	const store = useGetPageStore();
	useEffect(() => {
		store.set(name as any, value);
	});
	return null;
}