import { Page } from './page';
import { Action } from '../action';

/**
 * Implementation of getTextSelection and replaceSelectedText for Google Docs
 * @class GoogleDocPage
 */
export class GoogleDocPage extends Page {
    getTextSelectionImpl() { 
        // if (! window.location.toString().includes("docs.google.com")) {
        //     console.log("Not on google doc page");
        // }
        // use Google Add-on script to get selected text
        // https://developers.google.com/apps-script/reference/document/text#gettext
        const selection = DocumentApp.getActiveDocument().getSelection();
        if (selection) {
            const text = selection.getText();
            console.log("Selected text:", text);
            return text;
        } else {
            console.log("No text selection");
            return "";
        }
    }

    replaceSelectedTextImpl(newText) {
        if (! window.location.toString().includes("docs.google.com")) {
            console.log("Not on google doc page");
        }
        // use Google Add-on script to replace selected text
        // https://developers.google.com/apps-script/reference/document/text#settexttext
        const selection = DocumentApp.getActiveDocument().getSelection();
        if (selection) {
            selection.replaceText(newText);
        } else {
            console.log("No text selection for replacement");
        }
    }

    // use this method to execute actions: gdocPageInstance.executeAction('getTextSelection');
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