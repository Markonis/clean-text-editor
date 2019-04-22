import Editor from '../editor/editor';

const editor = new Editor({ elementId: 'editor' });

document.querySelectorAll('#toolbar button').forEach((element) => {
	const command = element.getAttribute('data-command');
	const button = element as HTMLButtonElement;
	button.onclick = () => {
		switch (command) {
			case 'toggleBold':
				editor.api.toggleBold();
				return;
			case 'toggleBtalic':
				editor.api.toggleItalic();
				return;
			case 'createLink':
				const href = prompt('Enter URL:');
				editor.api.createLink(href);
				return;
			case 'unlink':
				editor.api.unlink();
				return;
			case 'insertUnorderedList':
				editor.api.insertUnorderedList();
				return;
			case 'insertOrderedList':
				editor.api.insertOrderedList();
				return;
			case 'indent':
				editor.api.indent();
				return;
			case 'outdent':
				editor.api.outdent();
				return;
			case 'getData':
				const data = editor.api.getData();
				console.log(data);
				return;
			case 'H1':
				editor.api.convertBlock('H1');
				return;
			case 'H2':
				editor.api.convertBlock('H2');
				return;
			case 'H3':
				editor.api.convertBlock('H3');
				return;
			case 'P':
				editor.api.convertBlock('P');
				return;
			case 'getSelectionData':
				const selectionData = editor.api.getSelectionData();
				console.log(selectionData);
				return;
		}
	};
});
