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
   git clone https://github.com/mlc-ai/web-agent-interface.git
   cd web-agent-interface
   ```

2. Install dependencies and build the project:

   ```bash
   npm install
   npm run build
   ```

## Usage

### 1. Initialize the page handler in content script

  ```javascript
  import { initHandler } from '@mlc-ai/web-agent-interface';

  const handler = initHandler();
  ```


### 2. Get Available Tools

    ```javascript
  import { getTools } from '@mlc-ai/web-agent-interface';

  const availableTools = getTools();
  ```

### 3. Handling Tool Use

  ```javascript
  const observation = handler.handleToolCall(toolName, parameters);
  console.log("Got observation:", observation);
  ```
