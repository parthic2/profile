// Get current user's email address
chrome.identity.getProfileUserInfo((userInfo) => {
    // Send the user's email address to the popup script
    chrome.runtime.sendMessage({ userEmail: userInfo.email }, (response) => {
        if (!chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log("User email sent successfully");
        }
    });
});