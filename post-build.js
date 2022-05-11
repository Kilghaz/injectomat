const fs = require("fs");
const path = require("path");

const createPackageJson = () => {
    const packageJson = JSON.parse(fs.readFileSync("./package.json").toString());

    const result = {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        repository: packageJson.repository,
        keywords: packageJson.keywords,
        author: packageJson.author,
        license: packageJson.license,
        homepage: packageJson.homepage,
        bugs: packageJson.bugs,
        dependencies: packageJson.dependencies,
    }

    fs.writeFileSync("dist/package.json", JSON.stringify(result, null, 4));
}

const deleteIndices = (dir) => {
    const files = fs.readdirSync(dir);

    const indexPath = path.join(dir, "index.ts");

    if(fs.existsSync(indexPath)) {
        fs.rmSync(indexPath);
    }

    files
        .filter((it) => !it.startsWith("."))
        .map((it) => path.join(dir, it))
        .filter((it) => fs.existsSync(it))
        .filter((it) => fs.lstatSync(it).isDirectory())
        .forEach((it) => {
            deleteIndices(it);
        })
}

createPackageJson();
deleteIndices("src");
