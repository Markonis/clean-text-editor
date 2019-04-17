import { EditorState } from "./data-model";
import { HistoryStack } from "./history-stack";
import { cleanUp } from "./sanitization";
import { getCaretGravity, getTextOffset, restoreTextOffset } from "./text-offset";

export function oninput(
	editorElement: Element,
	editorHistory: HistoryStack<EditorState>) {

	const state = editorHistory.currentState();
	const offset = getTextOffset(editorElement);
	const gravity = getCaretGravity();

	cleanUp(editorElement);
	const html = editorElement.innerHTML;

	if (html !== state.html) {
		editorHistory.pushState({ html, offset, gravity });
		restoreState(editorElement, editorHistory.currentState());
	}
}

export function onkeydown(event: KeyboardEvent, editorElement: Element, editorHistory: HistoryStack<EditorState>) {
	if (isUndoEvent(event)) {
		event.preventDefault();
		undo(editorElement, editorHistory);
	} else if (isRedoEvent(event)) {
		event.preventDefault();
		redo(editorElement, editorHistory);
	} else {
		setCurrentOffset(getTextOffset(editorElement), editorHistory)
	}
}

export function undo(editorElement: Element, editorHistory: HistoryStack<EditorState>) {
	editorHistory.undo();
	restoreState(editorElement, editorHistory.currentState());
}

export function redo(editorElement: Element, editorHistory: HistoryStack<EditorState>) {
	editorHistory.redo();
	restoreState(editorElement, editorHistory.currentState());
}

function setCurrentOffset(offset: number, editorHistory: HistoryStack<EditorState>) {
	editorHistory.currentState().offset = offset;
}

function restoreState(editorElement: Element, state: EditorState) {
	editorElement.innerHTML = state.html;
	restoreTextOffset(editorElement, state.offset, state.gravity);
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

