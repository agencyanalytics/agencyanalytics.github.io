// Client ID and API key from the Developer Console
var CLIENT_ID =
	"428723751711-1vp68qosqu5ukhr86oghmrdun4sqd8p7.apps.googleusercontent.com";
var API_KEY = "AIzaSyAa7unnKY3QDwPUjqsZ__5qmiPKRfD8C8M";
var SPREADSHEET_ID = "104lH5fetykWt9j2dHnT4Wjm0_ANZasxMZUBoYPo7JsY";
var START_ROW_INDEX = 4;
var RANGE = `Sheet1!A${START_ROW_INDEX}:C100`;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
	"https://sheets.googleapis.com/$discovery/rest?version=v4",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
	gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
	gapi.client
		.init({
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES,
		})
		.then(
			function () {
				// Listen for sign-in state changes.
				gapi.auth2
					.getAuthInstance()
					.isSignedIn.listen(updateSigninStatus);

				// Handle the initial sign-in state.
				updateSigninStatus(
					gapi.auth2.getAuthInstance().isSignedIn.get()
				);
				authorizeButton.onclick = handleAuthClick;
				signoutButton.onclick = handleSignoutClick;
			},
			function (error) {
				appendButton(JSON.stringify(error, null, 2));
			}
		);
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
async function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.style.display = "none";
		signoutButton.style.display = "block";
		await getButtons(true);
		window.loggedIn = true;
	} else {
		authorizeButton.style.display = "block";
		signoutButton.style.display = "none";
		window.loggedIn = false;
	}

	showHideInsert();
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendButton(btn) {
	const { label, url, note } = btn;
	if (!label || !url) return;

	const buttonContainer = document.getElementById("buttons");
	const btnEl = document.createElement("div");

	btnEl.setAttribute("data-label", label);
	btnEl.setAttribute("data-url", url);
	btnEl.setAttribute("data-note", note);
	btnEl.classList.add("btn");
	btnEl.innerText = label;
	btnEl.addEventListener("click", function () {
		setSelectedBtn(label, url, note);
	});

	buttonContainer.appendChild(btnEl);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function getButtons(shouldAppend = false) {
	const buttonContainer = document.getElementById("buttons")
	if (shouldAppend) buttonContainer.innerText = "";
	const buttons = await gapi.client.sheets.spreadsheets.values
		.get({
			spreadsheetId: SPREADSHEET_ID,
			range: RANGE,
		})
		.then(
			function (response) {
				var range = response.result;
				return range.values ? range.values : [];
			},
			function (response) {
				console.error(response.result.error.message);
				return [];
			}
		);
	const buttonObj = buttons.map(function (btn) {
		var obj = { label: btn[0], url: btn[1], note: btn[2] };
		if (shouldAppend) appendButton(obj);
		return obj;
	});

	window.buttonList = buttonObj;
	window.loaded = true;
	showHideInsert();
	return buttonObj;
}

async function insertNewButton() {
	var inputLabel = document.getElementById('inputLabel');
	var inputURL = document.getElementById('inputURL');

	if (!inputLabel.value || !inputURL.value) return;

	var buttons = await getButtons();

	if (buttons) {
		for (i = 0; i < buttons.length; i++) {
			var btn = buttons[i];

			// button already exists, skip
			if (btn.label == inputLabel.value && btn.url == inputURL.value) {
				return;
			}
		}
	}

	var params = {
		spreadsheetId: SPREADSHEET_ID,
		range: RANGE,
		valueInputOption: "RAW",
		insertDataOption: "INSERT_ROWS",
		resource: {
			values: [[inputLabel.value, inputURL.value]],
		},
	};

	const success = await gapi.client.sheets.spreadsheets.values.append(params).then(
		function (response) {
			return true;
		},
		function (response) {
			return false;
		}
	);

	await getButtons(true);
	return success;
}

async function deleteButton() {
	var inputLabel = document.getElementById('inputLabel');
	var inputURL = document.getElementById('inputURL');

	if (!inputLabel.value || !inputURL.value) return;

	var buttons = await getButtons();

	var indexToDelete;

	if (buttons) {
		for (i = 0; i < buttons.length; i++) {
			var btn = buttons[i];
			if (btn.label == inputLabel.value && btn.url == inputURL.value) {
				indexToDelete = i + START_ROW_INDEX - 1;
				break;
			}
		}
	}


	if (indexToDelete){
		var params = {
			spreadsheetId: SPREADSHEET_ID
		};
		var requests = {
			requests: [
				{
					deleteDimension: {
						range: {
							sheetId: "0",
							dimension: "ROWS",
							startIndex: indexToDelete,
							endIndex: indexToDelete + 1
						}
					}
				}
			]
		};

		await gapi.client.sheets.spreadsheets.batchUpdate(params, requests);
		await getButtons(true);
	}
}


//
//
//
//
//
//