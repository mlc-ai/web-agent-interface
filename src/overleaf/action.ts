export function insertText(parameters: {
    textToInsert: string;
    position: 'beginning' | 'end' | 'cursor',
  }) {
    const { textToInsert, position = 'cursor' } = parameters;

    if (position === "beginning") {
        const editorElement = document.querySelector(".cm-content");
        if (editorElement) {
        const textNode = document.createTextNode(textToInsert);
        editorElement.prepend(textNode);

        // Scroll to bottom
        const scroller = document.querySelector(".cm-scroller");
            if (scroller) {
                scroller.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }
    else if (position === 'end') {
        const editorElement = document.querySelector(".cm-content");
        if (editorElement) {
        const textNode = document.createTextNode(textToInsert);
        editorElement.appendChild(textNode);

        // Scroll to start
        const scroller = document.querySelector(".cm-scroller");
            if (scroller) {
                scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
            }
        }
    } else if (position === "cursor") {
        const selection = window.getSelection();

        if (!selection?.rangeCount) {
            console.error("No cursor location available");
            return;
        }

        // Get the range of the current selection or cursor position
        const range = selection.getRangeAt(0);
    
        // Extract the currently selected content (if any)
        const selectedContent = range.cloneContents();
    
        // Create a document fragment to hold the new content
        const fragment = document.createDocumentFragment();
    
        // Create a text node for the text to insert before the selection
        if (textToInsert) {
            fragment.appendChild(document.createTextNode(textToInsert));
        }
    
        // Append the selected content to the fragment
        if (selectedContent) {
            fragment.appendChild(selectedContent);
        }
    
        // Insert the fragment into the range
        range.deleteContents(); // Remove the current selection
        range.insertNode(fragment);
    
        // Move the cursor to the end of the inserted content
        range.collapse(false); // Collapse the range to its end
    
        // Clear the selection and set the updated range
        selection.removeAllRanges();
        selection.addRange(range);
    }
}