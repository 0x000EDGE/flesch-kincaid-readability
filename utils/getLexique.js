/**
 * Charge un dictionnaire (objet) à partir d'un fichier TSV contenant des mots et leur nombre de syllabes.
 * Utilisé pour l'analyse phonétique des textes.
 *
 * @returns {Promise<Record<string, number> | null>} - Un objet { mot: nbSyllabes } ou null en cas d'erreur.
 */
export async function getLexique() {
    try {
        const response = await fetch("/data/Lexique383.tsv");
        const text = await response.text();

        const lines = text.trim().split("\n");
        const headers = lines[0].split("\t");

        const orthoIndex = headers.indexOf("ortho");
        const nbSyllIndex = headers.indexOf("nbsyll");

        // Vérifie la présence des colonnes essentielles
        if (orthoIndex === -1 || nbSyllIndex === -1) {
            throw new Error(
                "Colonnes 'ortho' ou 'nbsyll' manquantes dans le fichier TSV.",
            );
        }

        const lexicon = Object.create(null);

        // Parse les lignes une par une (on ignore la première, déjà traitée)
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].trim().split("\t");

            const word = values[orthoIndex]?.toLowerCase();
            const syllables = parseInt(values[nbSyllIndex], 10);

            // Ne conserve que les entrées valides
            if (word && Number.isInteger(syllables)) {
                lexicon[word] = syllables;
            }
        }

        return lexicon;
    } catch (error) {
        console.error("Erreur lors du chargement du lexique :", error.message);
        return null;
    }
}
