import { EditorNode, NodeType } from "./data-model";
import { blockTags, isHeading, isLink, isParagraph, isTag, isText } from "./node-types";

export default function childrenDataNodes(node: Node): EditorNode[] {
	let nodes: EditorNode[] = [];
	node.childNodes.forEach(child => {
		nodes.push({
			type: nodeType(child),
			blockText: blockText(child),
			inlineText: inlineText(child),
			href: nodeHref(child),
			level: nodeLevel(child),
			children: childrenDataNodes(child)
		})
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
		return match ? parseInt(match[0]) : null;
	} else {
		return null;
	}
}
