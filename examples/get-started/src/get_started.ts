import * as wai from "@mlc-ai/web-agent-interface";

function setLabel(id: string, text: string) {
  const label = document.getElementById(id);
  if (label == null) {
    throw Error("Cannot find label " + id);
  }
  label.innerText = text;
}

async function main() {
  const page = new wai.BasicPage({
    name: "My Page",
    environments: [
      wai.EnvironmentTypeEnum.Chat,
      wai.EnvironmentTypeEnum.DomTree,
    ],
    requiredAbilities: new Map<wai.AbilityType, wai.AbilityConfig>([
      [
        wai.AbilityTypeEnum.Editing,
        {
          modelId: "Llama-2-7b-chat-hf-q4f16_1-1k",
          worker: new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }),
          uiTriggers: [
            {
              eventType: "keydown",
              selector: "body",
              condition: (event: Event) => {
                const keyboardEvent: KeyboardEvent = event as KeyboardEvent;
                return (keyboardEvent.ctrlKey) && keyboardEvent.key === "w";
              }
            },
          ],
          initProgressCallback: (report) => {
            setLabel("init-label", report.text);
          },
        },
      ],
    ]),
  });

  await page.init();
}

main();
