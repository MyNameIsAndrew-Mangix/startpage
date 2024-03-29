const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    loadInitialContent();
});

async function loadInitialContent(user) {
    const appContainer = document.getElementById('app');
    try {
        if (user === null || user === undefined) {
            user = await fetchLoggedInUser();
        }
        if (user && !user.error) {
            renderNormalContent(appContainer);
        } else renderLoginForm(appContainer);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function renderNormalContent(appContainer) {
    const normalContent = createWorkspaceForm();
    appContainer.innerHTML = normalContent;

    const form = document.getElementById('workspaceForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = document.getElementById('submitButton');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!submitButton.disabled) submitButton.disabled = true;

        const workspaceName = document.getElementById('workspaceName').value;

        if (typeof chrome !== 'undefined' && chrome.extension) {
            console.log('This code is running in a Chrome extension.');
            chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    return;
                }
                const tabsInCurrentWindow = currentWindow.tabs.map((tab) => ({
                    url: tab.url,
                    title: tab.title,
                }));

                const workspace = {
                    title: workspaceName,
                    sites: tabsInCurrentWindow,
                };
                sendWorkspaceToApi(workspace);
                sendSubmitSuccess(form, successMessage, submitButton);
            });
        } else if (typeof browser !== 'undefined' && browser.extension) {
            console.log('This code is running in a Firefox extension.');
            const tabsInCurrentWindow = browser.tabs.query({ currentWindow: true }).map((tab) => ({
                url: tab.url,
                title: tab.title,
            }));

            const workspace = {
                title: workspaceName,
                sites: tabsInCurrentWindow,
            };
            sendWorkspaceToApi(workspace);
            sendSubmitSuccess(form, successMessage, submitButton);
        }
    });
}

function createWorkspaceForm() {
    return `
  <div>
    <h1>Hello world!</h1>
    <h1>this is my very epic web extension!!!!!</h1>
    <form id="workspaceForm">
      <label for="workspaceName">Name this workspace:</label>
      <input type="text" id="workspaceName" required>
      <button type="submit" id="submitButton">Add workspace</button>
    </form>
    <div id="successMessage" style="display: none; color:green;">
      <h2>Form submitted successfully!</h2>
    </div>
  </div>
  `;
}

function renderLoginForm(appContainer) {
    const loginForm = createLoginForm();
    appContainer.innerHTML = '';
    appContainer.appendChild(loginForm);
}

function createLoginForm() {
    const form = document.createElement('form');
    form.id = 'loginForm';

    const html = `
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" required><br>
    <label for="password">Password:</label>
    <input type="password" id="password" required><br>
    <button type="submit" id="submitButton">Log In</button>
  </div>
  `;

    form.innerHTML = html;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (event.submitter && event.submitter.id === 'submitButton') {
            const submitButton = document.getElementById('submitButton');
            if (!submitButton.disabled) submitButton.disabled = true;

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = await sendLogin(username, password);
            loadInitialContent(user);
        }
    });
    return form;
}

async function fetchLoggedInUser() {
    try {
        const user = await getLoggedInUser();
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getLoggedInUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            credentials: 'include',
        });
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

async function sendLogin(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    } catch (error) {
        console.error(error);
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            submitButton.disabled = false;
        }
        throw error;
    }
}

function sendSubmitSuccess(form, successMessage, submitButton) {
    setTimeout(() => {
        form.reset();
        successMessage.style.display = 'block';
        submitButton.disabled = false;
    }, 1000);
}

async function sendWorkspaceToApi(workspace) {
    const apiUrl = `"${API_BASE_URL}/category/workspace"`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workspace),
        });

        const data = await response.json();
        console.log('Data sent successfully', data);
    } catch (error) {
        console.error('Error sending data to API', error);
    }
}
