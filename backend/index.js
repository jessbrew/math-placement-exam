const logger = require("./logger.js");
const app = require("../backend/server");

//Specifying ports
PORT = 3000;
app.listen(PORT, () => {
    logger.info("Server is running on port:" + PORT);
});
