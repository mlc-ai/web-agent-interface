import { Page } from './page';
import { Action } from '../action';

/**
 * Implementation of getTextSelection and replaceSelectedText for Google Docs
 * @class GoogleDocPage
 */
export class GoogleDocPage extends Page {
    // Private methods
    getTextSelectionImpl() { 
        if (! window.location.toString().includes("docs.google.com")) {
            console.log("Not on google doc page");
        }
        const selection = window.getSelection();
        if (selection.type === "Range") {
            console.log("Selected text:", selection.toString());
            return selection.toString();
        } else {
            console.log("No text selection");
            return "";
        }
    }

    replaceSelectedTextImpl(newText) {
        // the following implementation is from mlc-ai/mlc-assistant
        const nodes = Array.from(document.getElementsByClassName("cm-line")).filter( el => {
            const cleanText = el.innerHTML.replace(/<\/?[^>]+(>|$)/g, "");
            if (cleanText.length > 0) {
                if (selectedText.includes(cleanText)) {
                    return true;
                }
            }
            return false;
        });
        console.log("Replacing Selected Text", nodes)

        // Replace content of first node with new text, and remove all subsequent nodes
        if (nodes.length > 0) {
            nodes[0].innerHTML = newText;
            if (nodes.length > 1) {
                nodes.slice(1).forEach( node => {
                    node.remove();
                });
            }
        }
    }

    // use this method to execute actions: overleafPageInstance.executeAction('getTextSelection');
    executeAction(actionName, ...args) {
        const action = this.nameToAction[actionName];
        if (action) {
            return action.call(...args);
        } else {
            console.log(`Action '${actionName}' not found.`);
        }
    }

    nameToAction = {
        'getTextSelection': new Action(this.getTextSelectionImpl),
        'replaceSelectedText': new Action(this.replaceSelectedTextImpl)
    };
    availableActions = Object.keys(this.nameToAction);
}