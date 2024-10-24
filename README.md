# Web-Agent-Interface Library

## Overview

The `web-agent-interface` library provides tools to LLM agents in browsers to interact with different websites.

**Note**: The project is still in development phase. It has limited coverage and its APIs may change.

## Supported Tools

- **General DOM Operations**: Get page content and user selection.
- **Overleaf**: Edit Overleaf documents.
- **Google Calendar (GCal)**: Read and create events on Google Calendar.
<!-- - **Google Docs (GDoc)**: Interact with text selections and modifications in Google Docs. -->

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

### 1. Initialize State

  ```javascript
  import { State } from '@mlc-ai/web-agent-interface';

  const state = new State();
  ```


### 2. Import Tools

  ```javascript
  import { tool, retriever, action } from '@mlc-ai/web-agent-interface';
  ```

### 3. Give Tool Description to Prompt

  ```javascript
  const system_prompt = `
  You are a helpful AI agent.

  You have the following tools to use:

  ${tools.map((t) => JSON.stringify(t.schema)).join(",\n")}
  `
  ```

### 3. Call Tool Function to Get Observation

  ```javascript
  const { tool_name, parameters } = extractToolCall(llm_response);
  const observation = tool[tool_name].implementation(state, parameters);
  console.log("Got observation:", observation);
  ```
