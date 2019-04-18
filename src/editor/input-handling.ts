import { EditorApi } from './api';
import { EditorState } from './data-model';
import { HistoryStack } from './history-stack';
import { cleanUp } from './sanitization';
import { getCaretGravity, getTextOffset, restoreTextOffset } from './text-offset';

export function oninput(
	element: Element,
	history: HistoryStack<EditorState>) {

	const state = history.currentState();
	const offset = getTextOffset(element);
	const gravity = getCaretGravity();

	cleanUp(element);
	const html = element.innerHTML;

	if (html !== state.html) {
		history.pushState({ html, offset, gravity });
		restoreTextOffset(element, offset, gravity);
	}
}

export function onkeydown(event: KeyboardEvent, api: EditorApi) {
	if (isUndoEvent(event)) {
		event.preventDefault();
		api.undo();
	} else if (isRedoEvent(event)) {
		event.preventDefault();
		api.redo();
	} else if (isIndentEvent(event)) {
		event.preventDefault();
		api.indent();
	} else if (isOutdentEvent(event)) {
		event.preventDefault();
		api.outdent();
	} else {
		api.updateTextOffset();
	}
}

function isCtrlKey(event: KeyboardEvent) {
	return event.ctrlKey || event.metaKey;
}

function isUndoEvent(event: KeyboardEvent) {
	return isCtrlKey(event) && event.keyCode === 90;
}

function isRedoEvent(event: KeyboardEvent) {
	return isCtrlKey(event) && event.keyCode === 89;
}

function isIndentEvent(event: KeyboardEvent) {
	return event.keyCode === 9 && !event.shiftKey;
}

function isOutdentEvent(event: KeyboardEvent) {
	return event.keyCode === 9 && event.shiftKey;
}
