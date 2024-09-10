const fs = require("fs");
const path = require("path");

const sep = "/";

const clearDist = () => {
    try {
        fs.rmSync("dist", { recursive: true });
    } catch (e) {
        // ignore
    }
}

const createIndices = (dir) => {
    const files = fs.readdirSync(dir);

    const content = files.map((file) => {
        const imp = file.replace(dir, ".").replace(".ts", "");
        return `export * from "./${imp}";`
    }).join("\n");

    fs.writeFileSync(path.join(dir, "index.ts"), content);

    files
        .filter((it) => !it.startsWith("."))
        .map((it) => [dir, it].join(sep))
        .filter((it) => {
            return fs.lstatSync(it).isDirectory();
        })
        .forEach((it) => {
            createIndices(it);
        });
}

clearDist();
createIndices("src");
