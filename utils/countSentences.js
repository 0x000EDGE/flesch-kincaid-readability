export function countSentences(texte) {
    let count = 0;
    let inSentence = false;

    for (let i = 0; i < texte.length; i++) {
        const char = texte[i];
        if (char !== " " && char !== "\n" && char !== "\t") {
            inSentence = true;
        }

        if (inSentence && (char === "." || char === "!" || char === "?")) {
            count++;
            inSentence = false;
        }
    }

    return count;
}
