import { EditorState } from './data-model';
import { isTag } from './node-types';
import { restoreTextOffset } from './text-offset';

export type ConvertibleBlockType = 'H1' | 'H2' | 'H3' | 'P';

export function restoreState(element: Element, state: EditorState) {
	element.innerHTML = state.html;
	restoreTextOffset(element, state.offset, state.gravity);
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
