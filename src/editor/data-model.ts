export interface EditorOptions {
	elementId: string;
}

export type CaretGravity = 'start' | 'end';
export type NodeType = 'h' | 'p' | 'ul' | 'ol' | 'li' | 'a' | 'b' | 'i' | 'em' | 'strong' | 'u' | 'code' | 't';

export interface EditorState {
	html: string;
	gravity: CaretGravity;
	offset: number;
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
