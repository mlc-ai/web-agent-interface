# Web-Agent-Interface Library

## Overview

The `web-agent-interface` library provides an API to interact with text selections, modifications, and other functionalities across different web platforms like Overleaf, Google Docs, and Google Calendar. This library makes it easier to customize your tools.

## Supported Platforms

- **Overleaf**: Manipulate text selections and content within Overleaf documents.
<!-- - **Google Docs (GDoc)**: Interact with text selections and modifications in Google Docs.
- **Google Calendar (GCal)**: Integrate and manage events on Google Calendar. -->

## Installation

To install and build the library, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repository/web-agent-interface.git
    cd web-agent-interface
    ```

2. Install dependencies and build the project:
    ```bash
    npm install
    npm run build
    ```

3. Import the necessary modules into your project. For example, if the dependency is named `@mlc-ai/web-agent-interface`:
  ```javascript
  import { OverleafPage } from '@mlc-ai/web-agent-interface';
  ```

## Usage

### 1. Creating a Page Instance

Depending on the platform you're working with, you can create an instance of the corresponding page class:

- For **Overleaf**:
  ```javascript
  const overleafPage = new OverleafPage();
  ```
<!-- 
- For **Google Docs**:
  ```javascript
  const gdocPage = new GoogleDocPage();
  ```

- For **Google Calendar**:
  ```javascript
  const gcalPage = new GCalPage();
  ``` -->

### 2. Handling Text

- Get the selected text:
  ```javascript
  const selectedText = overleafPage.executeAction('getTextSelection');
  console.log('Selected text:', selectedText);
  ```

- Replace selected text:
  ```javascript
  overleafPage.executeAction('replaceSelectedText', { newText: 'Your new text here' });
  ```

- Adding Text to the End of the Document:
  ```javascript
  overleafPage.executeAction('addTextToEnd', { newText: 'Text to append' });
  ```