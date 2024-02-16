// let scrapeEmails = document.getElementById("scrapeEmails");
let list = document.getElementById("emailList");
let phoneNumberList = document.getElementById("numberList");

// Handler to receive emails from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Get emails
    let emails = request.emails;
    let phoneNumbers = request.phoneNumbers;

    // Display emails on popup window
    displayData(emails, list);

    // Display phone numbers on popup window
    displayData(phoneNumbers, phoneNumberList);
});

// Function to display data in the popup
function displayData(data, listElement) {
    if (data == null || data.length == 0) {
        // No data
        let li = document.createElement("li");
        li.innerHTML = "No data found";
        listElement.appendChild(li);
    } else {
        // Display data
        data.forEach((item) => {
            let li = document.createElement("li");
            li.innerHTML = item;
            listElement.appendChild(li);
        });
    }
}

// Buttons click event listener
// scrapeEmails.addEventListener("click", async () => {
//     // Get current active tab
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     // Execute script to parse emails on page
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: scrapeEmailsFromPage
//     })
// });

// Get current active tab 
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    let tab = tabs[0];

    // Execute script to parse emails on page
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scrapeEmailsFromPage
    })
});

// Function to scrape emails
function scrapeEmailsFromPage() {
    // RegEx to parse email from html code
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;
    // const phoneRegEx = /(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})([\s.-]?\d{3}[\s.-]?\d{4})/;

    // Parse emails from the HTML of the page
    let emails = document.body.innerHTML.match(emailRegEx);

    // Parse phone numbers from the HTML of the page
    // let phoneNumbers = document.body.innerHTML.match(phoneRegEx);

    // Send emails to popup
    chrome.runtime.sendMessage({ emails });
}