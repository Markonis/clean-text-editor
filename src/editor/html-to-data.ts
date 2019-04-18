import { EditorData, EditorNode, NodeType } from './data-model';
import { blockTags, isHeading, isLink, isParagraph, isTag, isText } from './node-types';

export function editorData(node: Node): EditorData {
	return {
		children: childrenData(node),
		version: 1,
	};
}

export function childrenData(node: Node): EditorNode[] {
	const nodes: EditorNode[] = [];
	node.childNodes.forEach((child) => {
		nodes.push({
			blockText: blockText(child),
			children: childrenData(child),
			href: nodeHref(child),
			inlineText: inlineText(child),
			level: nodeLevel(child),
			type: nodeType(child),
		});
	});
	return nodes;
}

function nodeType(node: Node): NodeType {
	if (isText(node)) {
		return 't';
	} else {
		const element = node as Element;
		if (isHeading(node)) {
			return 'h';
		} else if (isParagraph(node)) {
			return 'p';
		} else {
			return element.tagName.toLowerCase() as NodeType;
		}
	}
}

function blockText(node: Node): string | null {
	if (isTag(node, ...blockTags)) {
		return node.textContent;
	} else {
		return null;
	}
}

function inlineText(node: Node): string | null {
	return isText(node) ? node.textContent : null;
}

function nodeHref(node: Node): string | null {
	if (isLink(node)) {
		const element = node as Element;
		return element.getAttribute('href');
	} else {
		return null;
	}
}

function nodeLevel(node: Node): number | null {
	if (isHeading(node)) {
		const match = (node as Element).tagName.match(/\d+/);
		return match ? parseInt(match[0], 10) : null;
	} else {
		return null;
	}
}
