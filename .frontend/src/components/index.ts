import {IComponent} from "~interfaces/component";

import {Footer} from "./Footer/Footer";
import {Layout} from "./Layout/Layout";
import {Header} from "./Header/Header";
import {Html} from "./Html/Html";
import {Store} from "./Store/Store";
import {NavMain} from "./NavMain/NavMain";
import {Wrapper} from "./Wrapper/Wrapper";

const components: {[key: string]: IComponent<any>} = {
	Footer: Footer,
	Layout: Layout,
	Header: Header,
	Html: Html,
	Store: Store,
	NavMain: NavMain,
	Wrapper: Wrapper,
}

export default components;