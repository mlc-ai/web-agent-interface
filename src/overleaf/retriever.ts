export function getEditorContext() {
    // Identify the contenteditable container
    const contentEditableElement = document.querySelector('.cm-content');

    if (!contentEditableElement) {
        console.error('Editable area not found.');
        return null;
    }

    // Get the selection object
    const selection = window.getSelection();

    if (!selection?.rangeCount) {
        console.warn('No selection or cursor found.');
        return null;
    }

    // Get the active range (selection or cursor position)
    const range = selection.getRangeAt(0);

    // Check if the selection is within the editable area
    if (!contentEditableElement.contains(range.startContainer)) {
        console.warn('Selection is outside the editable area.');
        return null;
    }

    // Get the selected text (if any)
    const selectedText = selection.toString();

    // Get text content before the cursor/selection
    const beforeCursorRange = document.createRange();
    beforeCursorRange.setStart(contentEditableElement, 0);
    beforeCursorRange.setEnd(range.startContainer, range.startOffset);
    const textBeforeCursor = beforeCursorRange.toString();

    // Get text content after the cursor/selection
    const afterCursorRange = document.createRange();
    afterCursorRange.setStart(range.endContainer, range.endOffset);
    afterCursorRange.setEnd(contentEditableElement, contentEditableElement.childNodes.length);
    const textAfterCursor = afterCursorRange.toString();

    return {
        selectedText: selectedText,
        textBeforeCursor: textBeforeCursor,
        textAfterCursor: textAfterCursor,
        cursorPosition: range.startOffset // Cursor offset in the start container
    };
}