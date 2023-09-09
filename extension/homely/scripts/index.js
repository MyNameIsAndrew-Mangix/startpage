document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("workspaceForm");
  const successMessage = document.getElementById("successMessage");
  const submitButton = document.getElementById("submitButton");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!submitButton.disabled)
      submitButton.disabled = true;

    const workspaceName = document.getElementById("workspaceName").value;

    if (typeof chrome !== "undefined" && chrome.extension) {
      console.log("This code is running in a Chrome extension.");
      chrome.windows.getCurrent({ populate: true },  (currentWindow) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        const tabsInCurrentWindow = currentWindow.tabs.map((tab) =>({
          url: tab.url,
          title: tab.title
        }));
    
        const workspace = {
          title: workspaceName,
          sites: tabsInCurrentWindow,
        }
        sendWorkspaceToApi(workspace);
        sendSubmitSuccess(form, successMessage, submitButton);
      })
    } else if (typeof browser !== "undefined" && browser.extension) {
        console.log("This code is running in a Firefox extension.");
        const tabsInCurrentWindow = browser.tabs.query({ currentWindow: true }).map((tab) => ({
          url: tab.url,
          title: tab.title
        }));
    
      const workspace = {
        title: workspaceName,
        sites: tabsInCurrentWindow,
      }
      sendWorkspaceToApi(workspace)
      sendSubmitSuccess(form, successMessage, submitButton);
    
    }
  })
})


function sendSubmitSuccess(form, successMessage, submitButton) {
  setTimeout(() => {
    form.reset();
    successMessage.style.display = 'block';
    submitButton.disabled = false;
  }, 1000);
}

function sendWorkspaceToApi(workspace) {
  const apiUrl = "http://localhost:5000/api/category/workspace";

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workspace),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data sent successfully", data);
    })
    .catch((error) => {
      console.error("Error sending data to API", error);
    });
}

