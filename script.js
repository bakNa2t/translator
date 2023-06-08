const dropdowns = document.querySelectorAll(".dropdown-container");
const inputLanguageDropdown = document.querySelector("#input-language");
const outputLanguageDropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
    dropdown.querySelector("ul").innerHTML = "";
    options.forEach((option) => {
        const li = document.createElement("li");
        const title = option.name + " (" + option.native + ")";
        li.innerHTML = title;
        li.dataset.value = option.code;
        li.classList.add("option");
        dropdown.querySelector("ul").appendChild(li);; 
    });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
        dropdown.classList.toggle("active");
    });
    
    dropdown.querySelectorAll(".option").forEach((item) => {
        item.addEventListener("click", (e) => {
            //remove active class from other options
            dropdown.querySelectorAll(".option").forEach((item) => {
                item.classList.remove("active");
            });
            //add active class to clicked option
            item.classList.add("active");
            const selected = dropdown.querySelector(".selected");
            selected.innerHTML = item.innerHTML;
            selected.dataset.value = item.dataset.value;
            translate();
        });
    });
});

document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
});

//Translate text function

const inputTextElem = document.querySelector("#input-text");
const outputTextElem = document.querySelector("#output-text");
const inputLanguage = inputLanguageDropdown.querySelector(".selected");
const outputLanguage = outputLanguageDropdown.querySelector(".selected");
const swapBtn = document.querySelector(".swap-position");

function translate() {
    const inputText = inputTextElem.value;
    const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
    const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
    
    //api url
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;

    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            // console.log(json);
            outputTextElem.value = json[0].map((item) => item[0]).join(" ");
        })
        .catch((error) => {
            console.log(error);
        });
}

inputTextElem.addEventListener("input", (e) => {
    if (inputTextElem.value.length > 5000) {
        inputTextElem.value = inputTextElem.value.slice(0, 5000);
    }
    translate();
});

//swap language position
swapBtn.addEventListener("click", (e) => {
    const temp = inputLanguage.innerHTML;
    inputLanguage.innerHTML = outputLanguage.innerHTML;
    outputLanguage.innerHTML = temp;

    const tempValue = inputLanguage.dataset.value;
    inputLanguage.dataset.value = outputLanguage.dataset.value;
    outputLanguage.dataset.value = tempValue;

    const tempInputText = inputTextElem.value;
    inputTextElem.value = outputTextElem.value;
    outputTextElem. value = tempInputText;

    translate();
});

//add file upload to translate
const uploadDocument = document.querySelector("#upload-document");
const uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (
        file.type === "application/msword" ||
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain"
    ) {
        uploadTitle.innerHTML = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            inputTextElem.value = e.target.result;
            translate();
        }
    }
    else {
        alert("Format not supported. Please upload a valid file");
    }
});

//Download translated file
const downloadDocument = document.querySelector("#download-document");

downloadDocument.addEventListener("click", (e) => {
    const outputText = outputTextElem.value;
    const outputLanguage = outputLanguageDropdown.querySelector(".selected").innerHTML;
    if (outputText) {
        const blob = new Blob([outputText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `translated-to-${outputLanguage}.txt`;
        a.href = url;
        a.click();
    }
});

//Counter for chars in text
const inputChars = document.querySelector("#input-chars");
inputTextElem.addEventListener("input", (e) => {
    inputChars.innerHTML = e.target.value.length;
});

//Switch dark/light mode
const darkModeBtn = document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("change", (e) => {
    document.body.classList.toggle("dark");
});