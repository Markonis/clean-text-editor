
export class HistoryStack<T>{
	private stack: T[] = [];
	private pointer: number = 0;

	pushState(state: T) {
		this.stack = this.stack.slice(0, this.pointer + 1);
		this.stack.push(state);
		this.pointer = this.stack.length - 1;
	}

	currentState() {
		return this.stack[this.pointer];
	}

	undo() {
		this.pointer = Math.max(this.pointer - 1, 0);
	}

	redo() {
		this.pointer = Math.min(this.pointer + 1, this.stack.length - 1);
	}
}
