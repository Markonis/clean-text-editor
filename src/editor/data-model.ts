export interface EditorOptions {
	elementId: string;
	oninput?: (event: Event) => void;
	onfocus?: (event: FocusEvent) => void;
	onblur?: (event: FocusEvent) => void;
	onkeydown: (event: KeyboardEvent) => void;
}

export type CaretGravity = 'start' | 'end';
export type NodeType = 'h' | 'p' | 'ul' | 'ol' | 'li' | 'a' | 'b' | 'i' | 'u' | 'code' | 't';

export interface EditorState {
	html: string;
	gravity: CaretGravity;
	offset: number;
}

export interface SelectionData {
	blockNodeType: 'h' | 'p' | 'ul' | 'ol';
	blockNodeLevel: number;
	bold: boolean;
	italic: boolean;
	underline: boolean;
	link: {
		present: boolean;
		href: string | null
	};
}

export interface EditorData {
	version: number;
	children: EditorNode[];
}

export interface EditorNode {
	type: NodeType;
	blockText: string | null;
	inlineText: string | null;
	level: number | null;
	href: string | null;
	children: EditorNode[] | null;
}
