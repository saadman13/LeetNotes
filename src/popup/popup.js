const afterDOMLoaded = () => {
  const timeElement = document.getElementById("time");
  const currentDate = new Date().toLocaleTimeString();
  timeElement.textContent = `${currentDate}`;

  const textArea = document.getElementById("solution-code");
  const problemTitle = document.getElementById("problem-title");
  console.log(problemTitle);
  chrome.storage.sync.get(["translatedCode", "problemTitle"], (res) => {
    console.log(res);
    textArea.textContent = res.translatedCode;
    problemTitle.value = res.problemTitle;
  });
};

setTimeout(afterDOMLoaded, 2000);

const checkIfRowExists = (accessToken, spreadsheetId, searchValue) => {
  const range = "Sheet1!A:C";
  return new Promise((resolve, reject) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const rows = data.values;
        if (rows) {
          const rowExists = rows.some((row) => {
            if (row.length === 0) return false;
            return row[0].includes(searchValue);
          });
          resolve(rowExists);
        } else {
          resolve(false);
        }
      })
      .catch((error) => reject(error));
  });
};

const addToSheet = (e) => {
  e.preventDefault();
  const spreadsheetId = "1GYYxlaE16zhFeC3m3xsGar_iv42EDZnj1HWqlP85J1M";
  const range = "Sheet1!A1:C3";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

  chrome.storage.sync.get(["translatedCode", "problemTitle"], async (res) => {
    const translatedCode = res.translatedCode ?? "";
    const problemTitle = res.problemTitle ?? "";

    chrome.identity.getAuthToken(
      {
        interactive: true,
      },
      async (token) => {
        console.log(token);

        const rowExists = await checkIfRowExists(token, spreadsheetId, [
          problemTitle,
        ]);
        console.log(rowExists);
        if (rowExists) alert("already exists");
        else {
          fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              range: range,
              majorDimension: "ROWS",
              values: [[problemTitle, translatedCode]],
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
        }
      }
    );
  });
};

const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", addToSheet);
