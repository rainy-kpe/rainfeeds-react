import * as express from "express";
import * as path from "path";
import axios from "axios";

interface ICachedFeed {
    time: number;
    feed: string;
}

const app = express();
const port = 9000;
const distPath = path.resolve("../frontend/dist");
const cache: {[url: string]: ICachedFeed} = {};

app.get("/", (req, res) => res.sendFile(path.join(distPath, "index.html")));
app.get("/feed", async (req, res) => {
    const decoded = decodeURIComponent(req.query.url);
    try {
        const cached = cache[decoded];
        if (cached && new Date().valueOf() < cached.time + 15 * 60 * 1000) {
            res.send(cached.feed);
        } else {
            const content = await axios.get(decoded);
            cache[decoded] = {
                time: new Date().valueOf(),
                feed: content.data
            };
            res.send(content.data);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
app.use(express.static(distPath));
app.listen(port, () => {
    console.log(`Server started on port ${port} (${distPath})`);
});
