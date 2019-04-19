import { EditorData, EditorNode } from './data-model';

export default function render(element: Element, data: EditorData) {
	element.innerHTML = '';
	renderChildren(element, data.children);
}

function renderChildren(parent: Node, children: EditorNode[]) {
	children.forEach((child) => {
		const node = createNode(child);
		parent.appendChild(node);
		renderChildren(node, child.children || []);
	});
}

function createNode(data: EditorNode): Node {
	switch (data.type) {
		case 'a':
			const element = document.createElement('a');
			element.setAttribute('href', data.href || '');
			return element;
		case 'h':
			return document.createElement('h' + data.level);
		case 't':
			return document.createTextNode(data.inlineText || '');
		default:
			return document.createElement(data.type);
	}
}
