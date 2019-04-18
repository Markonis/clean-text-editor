import { EditorState } from './data-model';
import { convertBlockElement, ConvertibleBlockType, findConvertibleBlockNode, restoreState } from './editing-operations';
import { HistoryStack } from './history-stack';
import { editorData } from './html-to-data';
import { oninput } from './input-handling';
import { getTextOffset } from './text-offset';

export class EditorApi {

	constructor(
		private element: HTMLElement,
		private history: HistoryStack<EditorState>,
	) { }

	public focus() {
		this.element.focus();
	}

	public undo() {
		this.history.undo();
		restoreState(this.element, this.history.currentState());
	}

	public redo() {
		this.history.redo();
		restoreState(this.element, this.history.currentState());
	}

	public convertBlock(to: ConvertibleBlockType) {
		const selection = window.getSelection();
		if (selection === null) { return; }
		const range = selection.getRangeAt(0);

		const container = range.startContainer;
		if (!this.element.contains(container)) { return; }

		const convertibleNode = findConvertibleBlockNode(this.element, container);
		if (convertibleNode === null) { return; }

		convertBlockElement(convertibleNode, to);
		oninput(this.element, this.history);
	}

	public createLink(href: string) {
		document.execCommand('createLink', false, href);
	}

	public unlink() {
		document.execCommand('unlink');
	}

	public indent() {
		document.execCommand('indent');
	}

	public outdent() {
		document.execCommand('outdent');
	}

	public toggleBold() {
		document.execCommand('bold');
	}

	public toggleItalic() {
		document.execCommand('italic');
	}

	public toggleUnderline() {
		document.execCommand('underline');
	}

	public insertUnorderedList() {
		document.execCommand('insertUnorderedList');
	}

	public insertOrderedList() {
		document.execCommand('insertOrderedList');
	}

	public getData() {
		return editorData(this.element);
	}

	public updateTextOffset() {
		const offset = getTextOffset(this.element);
		this.history.currentState().offset = offset;
	}
}
