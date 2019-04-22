import { EditorApi } from './api';
import { EditorOptions, EditorState } from './data-model';
import { HistoryStack } from './history-stack';
import { oninput, onkeydown } from './input-handling';
import { cleanUp } from './sanitization';

export default class Editor {
	public api: EditorApi;
	private element: HTMLElement;
	private history: HistoryStack<EditorState> = new HistoryStack();

	constructor(private options: EditorOptions) {
		const el = document.getElementById(this.options.elementId);
		if (el) {
			this.element = el;
			this.api = new EditorApi(this.element, this.history);
			this.init();
		} else {
			throw new Error(`The element with id=${this.options.elementId} does not exist.`);
		}
	}

	public focus() {
		this.element.focus();
	}

	private init() {
		this.element.setAttribute('contenteditable', '');
		cleanUp(this.element);

		this.history.pushState({
			gravity: 'end',
			html: this.element.innerHTML,
			offset: 0,
		});

		if (this.options.onfocus) {
			this.element.onfocus = this.options.onfocus;
		}

		if (this.options.onblur) {
			this.element.onblur = this.options.onblur;
		}

		this.element.onkeydown = (event) => {
			onkeydown(event, this.api);
		};

		this.element.oninput = () => {
			oninput(this.element, this.history);
			if (this.options.oninput) {
				this.options.oninput();
			}
		};
	}
}
