require("dotenv").config();

const getPrompt = (code) => {
  return `Please explain the following code as if someone was taking leetcode notes and wanted to remember how they did it at a later time. Just explain the high level code on how it works, keep it concise and to the point. Do not bother repeating the function signature. ${code}`;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const code = request.code;

  // to make sure some valid code is there
  if (code.length > 5) translateCode(code);

  sendResponse({ success: true });
});

let translatedCode = "";

const translateCode = async (code) => {
  const apiKey = "process.env.OPENAI_API_KEY;";
  console.log(apiKey);
  const model = "gpt-3.5-turbo";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    model: model,
    max_tokens: 300,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are a efficient note writer, who looks at code and writes an explanation of the code in coincise way. Don't explain the Class.",
      },
      { role: "user", content: getPrompt(code) },
    ],
  });

  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      translatedCode = data.choices[0].message.content;
      chrome.storage.sync.set(
        {
          translatedCode,
        },
        () => {
          console.log(`translatedCode is set to ${translatedCode}`);
          chrome.tabs.create({ url: "popup.html" });
        }
      );
    })
    .catch((error) => {
      console.error(error);
    });
};
