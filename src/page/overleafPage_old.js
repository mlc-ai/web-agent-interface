import { Page } from './page';
import { Action } from '../action';

/**
 * Implementation of getTextSelection, replaceSelectedText, etc for Overleaf
 * @class OverleafPage
 */
export class OverleafPage extends Page {
    // return the selected text
    getTextSelectionImpl() { 
        if (! window.location.toString().includes("overleaf")) {
            console.log("Not on overleaf page");
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

    // if no text is selected, the newText will be added to place of the cursor
    // if text is selected, the newText (array of strings, can be empty) will replace the selected text
    replaceSelectedTextImpl(newText) {
        if (! window.location.toString().includes("overleaf")) {
            console.log("Not on overleaf page");
        }
        var selection = window.getSelection();
        var selectedText = "";
        if (selection.type === "Range") {
            console.log("Selected text for replacement:", selection.toString());
            selectedText = selection.toString();
            selection.deleteFromDocument();
        } else {
            console.log("No text selection for replacement");
            if (selection.rangeCount === 0) {
                console.log("Selection.rangeCount is 0");
                return;
            }
        }
        var range = selection.getRangeAt(0);
        var fragment = document.createDocumentFragment();
        newText.forEach(function (value, i) {
            var newNode = document.createElement("div");
            newNode.className = "cm-line";
            newNode.innerHTML = value;
            fragment.appendChild(newNode);
        });
        range.insertNode(fragment);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        var lastInsertedNode = fragment.lastChild;
        if (lastInsertedNode) {
            lastInsertedNode.scrollIntoView();
        }
    }

    // add text to the end of the document of the current editor
    addTextToEndImpl(newText) {
        if (! window.location.toString().includes("overleaf")) {
            console.log("Not on overleaf page");
        }
        var contentContainer = document.querySelector(".cm-content");
        if (!contentContainer) {
            console.error("Content container not found");
            return;
        }
        var contentNodes = Array.from(document.getElementsByClassName("cm-content")[0].childNodes)
        var lastNodeIdx = contentNodes.flatMap( (el, idx) => {
            if (el.className != "cm-line") {
                return null;
            }
            var cleanText = el.innerHTML;
            if (cleanText.length > 0) {
                return idx;
            }
            return null;
        }).filter(x=>x).pop();
        var lastInlineNode = contentNodes[lastNodeIdx];

        var firstNode = document.createElement("div");
        firstNode.className = "cm-line";
        lastInlineNode.insertAdjacentElement("afterend", firstNode);
        lastInlineNode = firstNode;
        var inlineAnswerNodes = [firstNode];

        if (newText.length > inlineAnswerNodes.length) {
            var nextNode = document.createElement("div");
            nextNode.className = "cm-line";
            lastInlineNode.insertAdjacentElement("afterend", nextNode);
            lastInlineNode = nextNode;
            inlineAnswerNodes.push(nextNode);
            lastInlineNode.scrollIntoView();
        }
        newText.forEach(function (value, i) {
            inlineAnswerNodes[i].innerHTML = value;
        });
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
        'replaceSelectedText': new Action(this.replaceSelectedTextImpl),
        'addTextToEnd': new Action(this.addTextToEndImpl)
    };
    availableActions = Object.keys(this.nameToAction);
}