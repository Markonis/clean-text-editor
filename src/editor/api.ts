import { EditorData, EditorState, SelectionData } from './data-model';
import { convertBlock, ConvertibleBlockType, getSelectionData, insertOrderedList, insertUnorderedList, restoreState } from './editing-operations';
import { HistoryStack } from './history-stack';
import { editorData } from './html-to-data';
import { oninput } from './input-handling';
import render from './render';
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
		convertBlock(this.element, to);
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
		insertUnorderedList(this.element);
	}

	public insertOrderedList() {
		insertOrderedList(this.element);
	}

	public getData() {
		return editorData(this.element);
	}

	public updateTextOffset() {
		const offset = getTextOffset(this.element);
		this.history.currentState().offset = offset;
	}

	public render(data: EditorData) {
		render(this.element, data);
	}

	public getSelectionData(): SelectionData | null {
		return getSelectionData(this.element);
	}
}
