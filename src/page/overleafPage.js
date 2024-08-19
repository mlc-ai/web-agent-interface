import { Page } from './page';
import { Action } from '../action';

/**
 * Implementation of getTextSelection, replaceSelectedText, etc for Overleaf
 * @class OverleafPage
 */
export class OverleafPage extends Page {
    static currentSelection = null;

    constructor() {
        super();
        // Listen for the selection change event
        document.addEventListener('selectionchange', this.handleSelectionChange);
    }

    handleSelectionChange = () => {
        const selection = window.getSelection();
        console.log('[handleSelectionChange] Selection object:', selection);
    
        if (selection && typeof selection.rangeCount !== 'undefined' && selection.rangeCount > 0) {
            this.currentSelection = selection;
            console.log('[handleSelectionChange] New selection:', this.currentSelection.toString());
        } else {
            console.log('[handleSelectionChange] No valid selection', this.currentSelection.toString());
        }
    }

    getTextSelectionImpl = () => {
        if (!this.currentSelection) {
            console.log('[getTextSelection] currentSelection is null');
            return '';
        }
        console.log('[getTextSelection] Selected text:', this.currentSelection.toString());
        return this.currentSelection.toString();
    }

    replaceSelectedTextImpl = (params) => {
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

    addTextToEndImpl = (params) => {
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
            // assuming params contains a key 'newText' for now
            return action.call(params);
        } else {
            console.log(`Action '${actionName}' not found.`);
        }
    }

    nameToAction = {
        'getTextSelection': new Action(this.getTextSelectionImpl),
        'replaceSelectedText': new Action(this.replaceSelectedTextImpl),
        'addTextToEnd': new Action(this.addTextToEndImpl)
    };

    availableActions = Object.keys(this.nameToAction);
}