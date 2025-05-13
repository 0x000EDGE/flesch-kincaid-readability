function tsvToJson(tsv) {
    const lines = tsv.split("\n");
    const headers = lines[0].split("\t");
    const headersLen = headers.length;
    const result = new Array(lines.length - 1);

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split("\t");
        const obj = {};
        for (let j = 0; j < headersLen; j++) {
            obj[headers[j]] = values[j];
        }
        result[i - 1] = obj;
    }

    return result;
}

async function readTsvFile() {
    try {
        const res = await fetch("/data/Lexique383.tsv");
        const text = await res.text();
        return tsvToJson(text.trim());
    } catch (err) {
        console.error("Erreur de lecture du fichier :", err.message);
        return null;
    }
}

export async function getLexique() {
    const lexiqueArray = await readTsvFile();

    const lexiqueMap = Object.create(null);

    // On prépare une table de hachage (clé = mot en minuscule)
    for (let i = 0; i < lexiqueArray.length; i++) {
        const entry = lexiqueArray[i];
        lexiqueMap[entry.ortho.toLowerCase()] = parseInt(entry.nbsyll);
    }

    return lexiqueMap;
}
