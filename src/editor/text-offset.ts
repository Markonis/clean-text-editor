import { isImage, isText, isInline, isTag, blockTags } from "./node-types";
import { CaretGravity } from "./data-model";

export function getTextOffset(rootNode: Node): number {
	const selection = window.getSelection();
	if (selection === null) return 0;
	const range = selection.getRangeAt(0);

	let resultTextOffset = 0;
	let currentContainer = range.endContainer;
	let currentOffset = range.endOffset;

	while (true) {
		if (isText(currentContainer)) {
			resultTextOffset += currentOffset;
		} else {
			while (currentOffset > 0) {
				currentOffset--;
				const child = currentContainer.childNodes[currentOffset];
				if (isText(child)) {
					resultTextOffset += textLength(child);
				} else {
					resultTextOffset += parentTextLength(child);
				}
			}
		}

		if (currentContainer.isSameNode(rootNode)) break;
		if (currentContainer.parentNode === null) break;

		const parent = currentContainer.parentNode;

		for (let offset = 0; offset < parent.childNodes.length; offset++) {
			if (parent.childNodes[offset].isSameNode(currentContainer)) {
				currentOffset = offset;
				break;
			}
		}

		currentContainer = currentContainer.parentNode;
	}

	return resultTextOffset;
}


export function restoreTextOffset(rootNode: Node, offset: number = 0, gravity: CaretGravity) {
	let allChildren: Node[] = [];
	getAllChildren(rootNode, allChildren);

	let remainOffset = Math.max(offset, 0);

	for (let i = 0; i < allChildren.length; i++) {
		const child = allChildren[i];
		const childTextLength = textLength(child);

		if (childTextLength >= remainOffset) {
			placeCaret(rootNode, child, remainOffset, gravity);
			return;
		} else if (i < allChildren.length - 1) {
			remainOffset -= childTextLength;
		} else {
			placeCaret(rootNode, child, remainOffset, gravity)
		}
	}
}

export function getCaretGravity(): CaretGravity {
	const selection = window.getSelection();
	if (selection === null) return 'start';
	const range = selection.getRangeAt(0);
	return range.startOffset === 0 ? 'start' : 'end';
}

function placeCaret(rootNode: Node, targetNode: Node, offset: number, gravity: CaretGravity) {
	const selection = window.getSelection();
	if (selection === null) return;

	let calculatedNode = targetNode;
	let calculatedOffset = targetNode.childNodes.length;
	const range = document.createRange();
	const nextNode = nextStartNode(rootNode, targetNode);

	if (targetNode.nodeType === Node.TEXT_NODE) {
		const nodeTextLength = textLength(targetNode);
		calculatedOffset = Math.max(Math.min(nodeTextLength, offset), 0);
		if (calculatedOffset === nodeTextLength && nextNode && gravity === 'start') {
			calculatedNode = nextNode;
			calculatedOffset = 0;
		}
	} else {
		if (nextNode && gravity === 'start') {
			calculatedNode = nextNode;
			calculatedOffset = 0;
		}
	}

	range.setStart(calculatedNode, calculatedOffset);
	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
}

function nextStartNode(rootNode: Node, node: Node): Node | null {
	let currentNode: Node | null = node;
	while (currentNode && !currentNode.isSameNode(rootNode)) {
		const nextSibling = currentNode.nextSibling;
		if (nextSibling && isTag(nextSibling, ...blockTags))
			return currentNode.nextSibling
		currentNode = currentNode.parentNode;
	}
	return null;
}


function textLength(node: Node) {
	if (isImage(node)) {
		return 1;
	} else if (node.nodeType === Node.TEXT_NODE) {
		return (node.textContent || '').length;
	} else {
		return 0;
	}
}

function getAllChildren(parent: Node, allChildren: Node[] = []) {
	parent.childNodes.forEach(child => getAllChildren(child, allChildren));
	allChildren.push(parent);
}

function parentTextLength(parent: Node) {
	let length = 0;

	parent.childNodes.forEach(child => {
		if (isInline(child)) {
			length += textLength(child);
		} else {
			length += parentTextLength(child);
		}
	});

	return length;
}
