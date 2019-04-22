import { EditorState, SelectionData } from './data-model';
import { isTag, isText } from './node-types';
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

export function getSelectionData(rootElement: Element) {
	const result: SelectionData = {
		blockNodeLevel: 1,
		blockNodeType: 'p',
		bold: false,
		italic: false,
		link: {
			href: '',
			present: false,
		},
		underline: false,
	};

	let container = getCurrentContainer(rootElement);
	while (container && !container.isSameNode(rootElement)) {

		if (isText(container)) { continue; }
		const element = container as Element;

		if (isTag(element, 'H1')) {
			result.blockNodeType = 'h';
			result.blockNodeLevel = 1;
		} else if (isTag(element, 'H2')) {
			result.blockNodeType = 'h';
			result.blockNodeLevel = 2;
		} else if (isTag(element, 'H3')) {
			result.blockNodeType = 'h';
			result.blockNodeLevel = 3;
		} else if (isTag(element, 'UL')) {
			result.blockNodeType = 'ul';
		} else if (isTag(element, 'OL')) {
			result.blockNodeType = 'ol';
		} else if (isTag(element, 'B')) {
			result.bold = true;
		} else if (isTag(element, 'I')) {
			result.italic = true;
		} else if (isTag(element, 'U')) {
			result.underline = true;
		} else if (isTag(element, 'A')) {
			result.link = {
				href: element.getAttribute('href'),
				present: true,
			};
		}

		container = container.parentNode;
	}

	return result;
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

function getCurrentContainer(rootElement: Element) {
	const selection = window.getSelection();
	if (selection === null) { return null; }
	const range = selection.getRangeAt(0);
	const container = range.startContainer;
	if (!rootElement.contains(container)) { return null; }
	return container;
}

function withCurrentContainer(rootElement: Element, fn: (node: Node) => void) {
	const container = getCurrentContainer(rootElement);
	if (container) { fn(container); }
}
