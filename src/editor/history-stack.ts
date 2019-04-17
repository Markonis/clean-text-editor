
export class HistoryStack<T> {
	private stack: T[] = [];
	private pointer: number = 0;

	public pushState(state: T) {
		this.stack = this.stack.slice(0, this.pointer + 1);
		this.stack.push(state);
		this.pointer = this.stack.length - 1;
	}

	public currentState() {
		return this.stack[this.pointer];
	}

	public undo() {
		this.pointer = Math.max(this.pointer - 1, 0);
	}

	public redo() {
		this.pointer = Math.min(this.pointer + 1, this.stack.length - 1);
	}
}
