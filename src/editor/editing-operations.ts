import { EditorState } from './data-model';
import { isTag } from './node-types';
import { restoreTextOffset } from './text-offset';

export type ConvertibleBlockType = 'H1' | 'H2' | 'H3' | 'P';
export type ListType = 'ul' | 'ol';

export function restoreState(element: Element, state: EditorState) {
	element.innerHTML = state.html;
	restoreTextOffset(element, state.offset, state.gravity);
}

export function convertBlock(rootElement: Element, to: ConvertibleBlockType) {
	withCurrentContainer(rootElement, (node) => {
		const convertibleNode = findConvertibleBlockNode(rootElement, node);
		if (convertibleNode === null) { return; }
		convertBlockElement(convertibleNode, to);
	});
}

export function findConvertibleBlockNode(rootElement: Element, node: Node) {
	while (!node.isSameNode(rootElement)) {
		if (isTag(node, 'H1', 'H2', 'H3', 'P')) { return node as Element; }
		if (!node.parentElement) { return null; }
		node = node.parentElement;
	}
	return null;
}

export function convertBlockElement(element: Element, to: ConvertibleBlockType) {
	if (element.tagName === to) { return; }

	const newElement = document.createElement(to);
	const parent = element.parentElement;
	if (parent === null) { return; }

	parent.insertBefore(newElement, element);
	element.childNodes.forEach((child) => {
		newElement.appendChild(child);
	});

	parent.removeChild(element);
}

export function insertUnorderedList(rootElement: Element) {
	insertList(rootElement, 'ul');
}

export function insertOrderedList(rootElement: Element) {
	insertList(rootElement, 'ol');
}

function insertList(rootElement: Element, tagName: ListType) {
	withCurrentContainer(rootElement, (node: Node) => {
		const convertibleNode = findConvertibleBlockNode(rootElement, node);
		if (convertibleNode === null) { return; }
		convertToList(convertibleNode, tagName);
	});
}

function convertToList(node: Node, tagName: ListType) {
	const parent = node.parentElement;
	if (parent === null) { return; }

	const list = document.createElement(tagName);
	const li = document.createElement('li');
	list.appendChild(li);

	parent.insertBefore(list, node);
	node.childNodes.forEach((child) => { li.appendChild(child); });

	parent.removeChild(node);

	placeCaretAtEnd(li);
}

function placeCaretAtEnd(node: Node) {
	const selection = window.getSelection();
	if (selection === null) { return; }

	const range = document.createRange();
	range.setStart(node, node.childNodes.length);
	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
}

function withCurrentContainer(rootElement: Element, fn: (node: Node) => void) {
	const selection = window.getSelection();
	if (selection === null) { return; }
	const range = selection.getRangeAt(0);

	const container = range.startContainer;
	if (!rootElement.contains(container)) { return; }
	fn(container);
}
