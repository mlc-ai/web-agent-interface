import chatboxCSS from "./chatbox.scss";
import chatboxIcon from "./chatbox.png";

export const chatBoxTemplate = document.createElement("template");

chatBoxTemplate.innerHTML = `
<style>
${chatboxCSS}
</style>
<div class="chatbox-container">
    <div class="chat-input-container">
        <input type="text" id="chat-input">
        <button id="chat-submit"><img src="${chatboxIcon}" alt="Submit"></button>
    </div>
    <div class="chat-output">
    </div>
    <div class="button-row">
        <button id="chat-accept">Accept</button>
        <button id="chat-discard">Discard</button>
    </div>
</div>
`;
