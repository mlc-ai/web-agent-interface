import { Page } from './page';
import { Action } from '../action';

// () -> string
function getTextSelectionImpl() { 
    if (! window.location.toString().includes("google.com/docs")) {  // If not on the correct page, return empty string
        console.log("Not on google doc page");
    }
    const selection = window.getSelection();
    if (selection.type == "Range") {
        console.log("Selected text:", selection.toString());
        return selection.toString();
    } else {
        console.log("No text selection");
        return "";
    }
}

// string -> void
function replaceSelectedTextImpl(newText) {
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

nameToAction = {
    'getTextSelection': new Action(getTextSelectionImpl),
    'replaceSelectedText': new Action(replaceSelectedTextImpl)
};

availableActions = [
    'getTextSelection',
    'replaceSelectedText'
];

GoogleDocPage = new Page(nameToAction, availableActions);

export { GoogleDocPage };