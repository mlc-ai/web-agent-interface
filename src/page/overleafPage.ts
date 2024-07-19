import { Page } from './page';
import { Action } from '../action';

export class OverleafPage extends Page {
    constructor() {
        super();
        this.nameToAction = {
            'getSelectText': new Action(this.getSelectTextImpl),
            'replaceSelectedText': new Action(this.replaceSelectedTextImpl)
        };
        this.availableActions = [
            'getSelectText',
            'replaceSelectedText'
        ];
    }

    getSelectTextImpl(): string {
        const selection = window.getSelection();
        if (selection === null) {
            throw new Error("Overleaf Selection is null");
        }
        return selection.toString();
    }

    replaceSelectedTextImpl(text: string): void {
        const selection = window.getSelection();
        if (selection === null) {
            throw new Error("Overleaf Selection is null");
        }
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
    }
}