const exceptions = new Set(["a", "à", "y"]);

function isPhoneticallyRelevant(word) {
    return word.length > 1 || exceptions.has(word);
}

export function extractWords(text) {
    const matches = text.match(/[\p{L}\p{N}]+/gu) || [];

    const phoneticWords = [];
    for (let i = 0; i < matches.length; i++) {
        const word = matches[i];
        if (isPhoneticallyRelevant(word.toLowerCase())) {
            phoneticWords.push(word);
        }
    }

    return {
        countableWords: matches,
        phoneticWords,
    };
}
