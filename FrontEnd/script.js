document.getElementById("sendRequest").addEventListener("click", sendHomepageRequest);







async function sendHomepageRequest() {
    try {
        const response = await fetch("https://treasurehunt-25-3.onrender.com/", {
            method: "GET",
            credentials: "include" // in case backend sends cookies
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        console.log("Backend Response:", data);
        alert("Server says: " + data);
    } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch data from backend. Check console for details.");
    }
}

