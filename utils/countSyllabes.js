export function countSyllabes(word, lexique) {
    const key = word.toLowerCase();
    const nbsyll = lexique[key] ?? null;
    return { word, nbsyll };
}
