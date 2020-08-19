// https://github.com/jcubic/favloader/blob/master/favloader-src.js
import {warn} from "~utils/warn";
import {BaseClass} from "~utils/BaseClass";
import {ready} from "~utils/ready";
import {BackgroundInterval} from "~utils/BackgroundInterval";
import {noop} from "~utils/noop";

const INITIAL_TURNS = -0.25;

export class FaviconLoader extends BaseClass<IFaviconLoaderOptions> {
	protected static _instance: FaviconLoader;
	public static get instance(): FaviconLoader {
		if (!this._instance) {
			this._instance = new FaviconLoader;
		}
		return this._instance;
	}

	protected defaultOptions = {
		size: 16,
		radius: 6,
		thickness: 2,
		color: '#0F60A8',
		duration: 5000,
	};
	protected $link!: HTMLElement;
	protected defaultHref!: string;
	protected defaultType!: string;
	protected canvas!: HTMLCanvasElement;
	protected canvasContext!: CanvasRenderingContext2D;

	protected intervalId: number | null = null;
	protected interval!: BackgroundInterval;
	protected progress = 0;

	protected initialized = false;

	public get animating() {
		return !!this.intervalId;
	}

	constructor() {
		super({
			size: 16,
			radius: 6,
			thickness: 2,
			color: '#0F60A8',
			duration: 5000,
		});
		if (!FaviconLoader._instance) {
			FaviconLoader._instance = this;
			this.init();
		}
		return FaviconLoader._instance;
	}

	public init() {
		ready(() => {
			this.$link = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
			if (!this.$link) {
				warn("No default icon found");
				return
			}
			this.defaultHref = this.$link.getAttribute('href') || '';
			this.defaultType = this.$link.getAttribute('type') || '';
			this.canvas = document.createElement('canvas');

			this.canvas.width = this.canvas.height = this.options.size;
			this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
			this.canvasContext.lineCap = "round";
			this.canvasContext.lineWidth = this.options.thickness;
			this.canvasContext.strokeStyle = this.options.color;

			this.interval = new BackgroundInterval;

			this.initialized = true;
		});
	}

	public clear() {
		if (!this.initialized) return;
		if (!this.intervalId) return;
		if (this.intervalId) {
			this.interval.remove(this.intervalId).then(noop);
			this.intervalId = null;
		}
	}
	public restore() {
		if (!this.initialized) return;
		this.clear();
		this.$link.setAttribute('href', this.defaultHref + '?' + Date.now());
		this.$link.setAttribute('type', this.defaultType);
	}
	public animate() {
		if (!this.initialized) return;
		if (this.animating) return;
		this.progress = 0;
		const {id} = this.interval.set(this.draw, 20);
		this.intervalId = id;
	}
	public turn(x: number) {
		return (x + INITIAL_TURNS) * 2 * Math.PI;
	}
	public arcStart(pos: number) {
		return this.turn(pos + INITIAL_TURNS) + this.turn(Math.max(0, pos * 2 - 1));
	}
	public arcEnd(pos: number) {
		return this.turn(pos + INITIAL_TURNS) + this.turn(Math.min(1, pos * 2));
	}
	public update(dataURI: string) {
		if (!this.initialized) return;
		const $icon = this.$link;
		const $newIcon = $icon.cloneNode(true) as HTMLLinkElement;
		$newIcon.setAttribute('href', dataURI);
		if ($icon.parentNode) {
			$icon.parentNode.replaceChild($newIcon, $icon);
		}
		this.$link = $newIcon;
	}
	public draw = () => {
		if (!this.initialized) return;
		this.canvasContext.clearRect(0, 0, this.options.size, this.options.size);
		if (typeof this.options.frame === 'function') {
			this.options.frame(this.canvasContext);
		} else {
			const position = this.progress % this.options.duration / this.options.duration;
			this.canvasContext.beginPath();
			const center = Math.round(this.options.size / 2);
			this.canvasContext.arc(center, center, this.options.radius, this.arcStart(position), this.arcEnd(position));
			this.canvasContext.stroke();
		}
		this.update(this.canvasContext.canvas.toDataURL());
		this.progress += this.options.duration / 100;
	}
}

export interface IFaviconLoaderOptions {
	size: number;
	radius: number;
	thickness: number;
	color: string;
	duration: number;
	frame?: (canvasContext: CanvasRenderingContext2D) => void;
}
