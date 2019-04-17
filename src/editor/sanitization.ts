import { Config, sanitize } from 'dompurify';
import { blockTags, inlineTags, isDiv, isList, listTags } from './node-types';

export const allowedAttr = ['HREF', 'SRC'];

export function cleanUp(rootNode: Element) {
	sanitizeInnerHtml(rootNode, {
		ALLOWED_TAGS: ['div', ...blockTags, ...listTags, ...inlineTags],
		ALLOWED_ATTR: allowedAttr,
	});

	putTextsIntoParagraphs(rootNode);
	convertDivsIntoParagraphs(rootNode);
	cleanUpChildren(rootNode);
}

export function sanitizeInnerHtml(element: Element, config: Config) {
	element.innerHTML = sanitize(element.innerHTML, config) as string;
}

export function putTextsIntoParagraphs(parent: Node) {
	const children = nodeListToArray(parent.childNodes);
	children.forEach((child) => {
		if (child.nodeType === Node.TEXT_NODE) {
			const paragraph = document.createElement('p');
			parent.insertBefore(paragraph, child);
			paragraph.appendChild(child);
		}
	});
}

export function convertDivsIntoParagraphs(parent: Node) {
	const children = nodeListToArray(parent.childNodes);
	children.forEach((child) => {
		if (isDiv(child)) {
			const paragraph = document.createElement('p');
			parent.insertBefore(paragraph, child);
			const divChildren = nodeListToArray(child.childNodes);
			divChildren.forEach((divChild) => {
				paragraph.appendChild(divChild);
			});
			parent.removeChild(child);
		}
	});
}

export function cleanUpChildren(parent: Node) {
	const children = nodeListToArray(parent.childNodes);

	children.forEach((child) => {
		let allowedTags = inlineTags;
		if (isList(child)) { allowedTags = [...allowedTags, 'UL', 'OL', 'LI']; }

		const element = child as Element;
		sanitizeInnerHtml(element, {
			ALLOWED_TAGS: allowedTags,
			ALLOWED_ATTR: allowedAttr,
		});

		if (element.innerHTML === '') {
			element.innerHTML = '<br>';
		}
	});
}

export function nodeListToArray(list: NodeList) {
	const result: Node[] = [];
	list.forEach((node) => result.push(node));
	return result;
}
