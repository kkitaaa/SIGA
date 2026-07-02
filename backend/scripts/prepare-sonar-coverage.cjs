const fs = require("fs");
const path = require("path");

const coveragePath = path.resolve(__dirname, "../coverage/lcov.info");

if (!fs.existsSync(coveragePath)) {
  console.error(`No se encontró el reporte de cobertura en ${coveragePath}`);
  process.exit(1);
}

let content = fs.readFileSync(coveragePath, "utf8");
const original = content;
content = content.replace(/SF:src\\/g, "SF:backend/src/");
content = content.replace(/SF:src\//g, "SF:backend/src/");

if (content !== original) {
  fs.writeFileSync(coveragePath, content);
  console.log("Reporte LCOV normalizado para SonarQube.");
} else {
  console.log("El reporte LCOV ya estaba normalizado.");
}
