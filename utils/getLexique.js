/**
 * Récupère et transforme un fichier TSV en une table de hachage où les clés sont des mots
 * en minuscule et les valeurs sont leur nombre de syllabes.
 *
 * @returns {object|null} - La table de hachage des mots avec leur nombre de syllabes, ou null en cas d'erreur.
 */
export async function getLexique() {
    try {
        const response = await fetch("/data/Lexique383.tsv"); // Récupération du fichier TSV
        const tsvText = await response.text(); // Lecture du contenu du fichier

        // Transformation du texte TSV en table de hachage
        const lexiqueTable = Object.create(null); // Crée une table de hachage vide
        tsvText
            .trim()
            .split("\n")
            .slice(1)
            .forEach((line) => {
                // Ignorer la première ligne (entêtes)
                const [ortho, nbsyll] = line.split("\t"); // Séparation des colonnes
                lexiqueTable[ortho.toLowerCase()] = parseInt(nbsyll); // Ajout du mot et de son nombre de syllabes
            });

        return lexiqueTable; // Retourne la table de hachage
    } catch (err) {
        console.error("Erreur de lecture du fichier :", err.message); // Gestion des erreurs
        return null; // Retourne null en cas d'erreur
    }
}
