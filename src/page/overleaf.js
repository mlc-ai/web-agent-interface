/**
 * Implementation of getTextSelection, replaceSelectedText, etc for Overleaf
 * @class OverleafPage
 */
class Handler {
    currentSelection = null;

    constructor() {
        // Listen for the selection change event
        document.addEventListener('selectionchange', this.handleSelectionChange);
    }

    handleSelectionChange = () => {
        const selection = window.getSelection();

        if (selection && typeof selection.rangeCount !== 'undefined' && selection.rangeCount > 0) {
            this.currentSelection = selection;
        }
    }
}

    getSelectionImpl = () => {
        if (!this.currentSelection) {
            console.log('[getTextSelection] currentSelection is null');
            return '';
        }
        const selectedText = this.currentSelection.toString();
        console.log('[getTextSelection] Selected text:', selectedText);
        return selectedText;
    }

    replaceSelectionImpl = (params) => {
        console.log('params', params);
        const newText = params.newText;
        const selection = this.currentSelection;
        if (!selection) {
            console.log('[replaceSelectedTextImpl] Selection is null');
            return;
        }
        console.log('[replaceSelectedTextImpl] Selection:', selection);
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            if (Array.isArray(newText)) {
                const fragment = document.createDocumentFragment();
                newText.forEach(text => fragment.appendChild(document.createTextNode(text)));
                range.insertNode(fragment);
            } else {
                range.insertNode(document.createTextNode(newText));
            }
            selection.removeAllRanges();
        } else {
            console.log('[replaceSelectedTextImpl] No text selection');
            return;
        }
    }

    appendTextImpl = (params) => {
        const newText = params.newText;
        const editorElement = document.querySelector(".cm-content");
        if (editorElement) {
            const textNode = document.createTextNode(newText);
            editorElement.appendChild(textNode);
        }
    }

    executeAction = (actionName, params) => {
        const action = this.nameToAction[actionName];
        if (action) {
            const response = action(params);
            return response;
        } else {
            console.log(`Action '${actionName}' not found.`);
        }
    }

    nameToAction = {
        'getSelection': this.getSelectionImpl,
        'replaceSelection': this.replaceSelectionImpl,
        'appendText': this.appendTextImpl,
    };
}
export const nameToDisplayName = {
    'getSelection': "Get Selected Text",
    'replaceSelection': "Replace Selected Text",
    'appendText': "Add Text to Document",
}
export const actions = Object.keys(nameToDisplayName);
export const createHandler = () => new Handler();
