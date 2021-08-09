window.buttonList = [];
window.loggedIn = false;
window.loaded = false;

const formEl = document.getElementById("form");
const ctaEl = document.getElementById("cta");

const inputLabel = document.getElementById('inputLabel');
const inputURL = document.getElementById('inputURL');

const btnInsertNew = document.getElementById('btnInsertNew');
const btnDelete = document.getElementById('btnDelete');

// Debounce helper
const debounce = (func, wait) => {
	let timeout;

	return function executedFunction(...args) {
		const later = () => {
			timeout = null;
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

// Render cta using Mustache and form data
let htmlString = '';
const render = debounce(() => {
	// Get form data as object and render
	const formData = Object.fromEntries(new FormData(formEl));
	ctaEl.innerHTML = Mustache.render(htmlString, formData);
	showHideInsert();
}, 50);


// Fetch template and setup listener
fetch("compiled.mustache.html")
	.then((response) => response.text())
	.then((html) => {
		htmlString = html;

		$("#form").on("input", function () {
			render();
		});

		// Initial render
		render();
	});

// Copy cta HTML data to clipboard
function copyToClip() {
	const str = ctaEl.innerHTML;

	function listener(e) {
		e.clipboardData.setData("text/plain", str);
		e.preventDefault();
	}

	document.addEventListener("copy", listener);
	document.execCommand("copy");
	document.removeEventListener("copy", listener);
}

function setSelectedBtn(label, url, note) {
	inputLabel.value = label;
	inputURL.value = url;

	if (htmlString) {
		render();
	}
}

function showHideInsert(){
	if (!window.loggedIn || !window.loaded || !inputLabel.value || !inputURL.value || window.buttonList.find((btn) => btn.label == inputLabel.value && btn.url == inputURL.value)){
		btnInsertNew.style.display = "none"
	}
	else {
		btnInsertNew.style.display = "inline-block"
	}

	if (window.loggedIn && window.loaded && inputLabel.value && inputURL.value && window.buttonList.find((btn) => btn.label == inputLabel.value && btn.url == inputURL.value)) {
		btnDelete.style.display = "inline-block"
	}
	else {
		btnDelete.style.display = "none"
	}
}

//
//
//
//