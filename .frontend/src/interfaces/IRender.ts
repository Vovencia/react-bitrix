import {IHydrateData} from "~interfaces/hydrateData";
import {IEjectStyle} from "../../webpack/eject-styles.loader/eject-styles.utils";

export type IServerRender = (data?: IHydrateData) => {
	html: string,
	styledStyles: string,
	styles: IEjectStyle[],
}