export interface EditorOptions {
	elementId: string
}

export type CaretGravity = 'start' | 'end';
export type NodeType = 'h' | 'p' | 'ul' | 'ol' | 'li' | 'b' | 'i' | 'em' | 'strong' | 'u' | 'code' | 't';

export interface EditorState {
	html: string
	nodes: EditorNode[]
	gravity: CaretGravity
	offset: number
}

export interface EditorNode {
	type: NodeType
	blockText: string | null
	inlineText: string | null
	level: number | null
	href: string | null
	children: EditorNode[] | null
}
