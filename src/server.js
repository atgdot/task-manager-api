const app = require("./app"); // ✅ Import the app (without initializing again)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server; // ✅ Export server for Jest cleanup
