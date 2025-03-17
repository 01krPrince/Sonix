setInterval(() => {
    fetch('https://sonix-s830.onrender.com/api/health')
         .then(response => console.log("Pinged Render backend:", response.status))
         .catch(error => console.error("Error pinging Render:", error));
}, 300000);
