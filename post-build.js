const fs = require("fs");

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
