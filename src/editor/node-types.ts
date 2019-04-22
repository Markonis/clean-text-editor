export const headingTags = ['H1', 'H2', 'H3'];
export const blockTags = [...headingTags, 'P', 'LI'];
export const listTags = ['UL', 'OL'];
export const styleTags = ['B', 'I', 'U', 'S'];
export const inlineTags = ['A', 'CODE', ...styleTags];

export function isText(node: Node) {
	return node.nodeType === Node.TEXT_NODE;
}

export function isInline(node: Node) {
	return isImage(node) || node.nodeType === Node.TEXT_NODE;
}

export function isTag(node: Node, ...tagNames: string[]) {
	if (node.nodeType !== Node.ELEMENT_NODE) { return false; }
	const element = node as Element;
	return tagNames.indexOf(element.tagName) > -1;
}

export function isImage(node: Node) {
	return isTag(node, 'IMG');
}

export function isDiv(node: Node) {
	return isTag(node, 'DIV');
}

export function isHeading(node: Node) {
	return isTag(node, ...headingTags);
}

export function isParagraph(node: Node) {
	return isTag(node, 'P');
}

export function isList(node: Node) {
	return isTag(node, ...listTags);
}

export function isLink(node: Node) {
	return isTag(node, 'A');
}
