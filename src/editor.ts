import { EditorOptions, EditorState } from './editor/data-model';
import { HistoryStack } from './editor/history-stack';
import { oninput, onkeydown } from './editor/input-handling';
import { cleanUp } from './editor/sanitization';

export default class Editor {
	private element: HTMLElement;
	private history: HistoryStack<EditorState> = new HistoryStack();

	constructor(options: EditorOptions) {
		const el = document.getElementById(options.elementId);
		if (el) {
			this.element = el;
		} else {
			throw new Error(`The element with id=${options.elementId} does not exist.`);
		}
		this.init();
	}

	private init() {
		this.element.setAttribute('contenteditable', '');
		cleanUp(this.element);

		this.history.pushState({
			html: this.element.innerHTML,
			offset: 0,
			gravity: 'end',
		});

		this.element.onkeydown = (event) => {
			onkeydown(event, this.element, this.history);
		};

		this.element.oninput = () => {
			oninput(this.element, this.history);
		};
	}
}
