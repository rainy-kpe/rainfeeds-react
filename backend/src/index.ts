import * as express from "express";
import * as path from "path";
import axios from "axios";

const app = express();
const port = 9000;
const distPath = path.resolve("../frontend/dist");

app.get("/", (req, res) => res.sendFile(path.join(distPath, "index.html")));
app.get("/feed", async (req, res) => {
    const decoded = decodeURIComponent(req.query.url);
    console.log(decoded);
    const content = await axios.get(decoded);
    res.send(content.data);
});
app.use(express.static(distPath));
app.listen(port, () => {
    console.log(`Server started on port ${port} (${distPath})`);
});
