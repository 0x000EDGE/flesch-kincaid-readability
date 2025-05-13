<template>
    <!-- Conteneur principal de la page -->
    <div
        class="min-h-screen bg-surface-50 dark:bg-surface-950 p-8 flex flex-col gap-6"
    >
        <!-- Composant Toast pour afficher les messages (erreurs, succès, etc.) -->
        <Toast />

        <!-- Barre de navigation en haut de la page -->
        <AppTopbar />

        <!-- Contenu central -->
        <div class="flex flex-col flex-1 w-full max-w-7xl mx-auto gap-6">
            <!-- Section principale contenant l’entrée utilisateur et les résultats -->
            <div
                class="flex flex-1 gap-6 w-full p-6 rounded-2xl border bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700"
            >
                <!-- Zone de saisie de texte -->
                <div class="flex-1">
                    <FloatLabel variant="on" class="w-full h-full">
                        <Textarea
                            id="input-text"
                            v-model="inputText"
                            class="w-full h-full"
                            :invalid="hasTextError"
                            style="resize: none"
                            @value-change="resetResults"
                        />
                        <label for="input-text">Votre texte</label>
                    </FloatLabel>
                </div>

                <!-- Zone d'affichage des résultats et du bouton de calcul -->
                <div class="w-1/3 flex flex-col">
                    <div class="flex flex-1 flex-col gap-6 mt-5">
                        <!-- Affichage des résultats si disponibles -->
                        <div
                            v-if="readabilityResult"
                            class="flex flex-col gap-2 items-center"
                        >
                            <span class="text-[3rem] font-bold">{{
                                readabilityResult.score
                            }}</span>
                            <span
                                class="text-sm text-surface-500 text-center"
                                >{{ readabilityResult.grade }}</span
                            >
                            <div class="flex flex-col gap-2 mt-4 text-sm">
                                <span
                                    >Nombre de mots :
                                    {{ readabilityResult.wordsNb }}</span
                                >
                                <span
                                    >Nombre de phrases :
                                    {{ readabilityResult.sentencesNb }}</span
                                >
                                <span
                                    >Nombre de syllabes :
                                    {{ readabilityResult.syllNb }}</span
                                >
                            </div>
                        </div>

                        <!-- Message par défaut si aucun résultat n’est encore affiché -->
                        <div
                            v-else
                            class="text-sm text-surface-400 text-center"
                        >
                            Entrez un texte puis cliquez sur "Calculer"
                        </div>
                    </div>

                    <!-- Bouton pour déclencher l'analyse -->
                    <Button
                        label="Calculer"
                        class="w-full mt-6"
                        :loading="isCalculating"
                        :disabled="!inputText"
                        @click="analyzeReadability"
                    />
                </div>
            </div>
        </div>

        <!-- Pied de page -->
        <AppFooter />
    </div>
</template>

<script setup>
// Importation du système de notifications (toast)
import { useToast } from "primevue/usetoast";
const toast = useToast();

// Texte saisi par l'utilisateur
const inputText = ref("");

// Booléen indiquant si le texte saisi est invalide (par ex. vide ou mal formé)
const hasTextError = ref(false);

// Indique si le système est en train de calculer les résultats
const isCalculating = ref(false);

// Résultats du calcul de lisibilité (score, niveau, nombre de mots, etc.)
const readabilityResult = ref(null);

// Dictionnaire phonétique pour la détection des syllabes
const phoneticLexicon = ref(null);

// Chargement initial : récupération du dictionnaire phonétique
onMounted(async () => {
    inputText.value = "";
    phoneticLexicon.value = await getLexique(); // getLexique() est une fonction externe supposée renvoyer un lexique
});

/**
 * Réinitialise les erreurs et les résultats affichés
 */
const resetResults = () => {
    hasTextError.value = false;
    readabilityResult.value = null;
};

/**
 * Calcule le score de lisibilité Flesch-Kincaid
 * @param {number} sentences - Nombre de phrases
 * @param {number} words - Nombre de mots
 * @param {number} syllables - Nombre de syllabes
 * @returns {string} - Score avec deux décimales
 */
const calculateReadabilityScore = (sentences, words, syllables) => {
    const score =
        206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return score.toFixed(2);
};

/**
 * Retourne un niveau de lecture basé sur le score Flesch
 * @param {number} score
 * @returns {string} - Description du niveau de difficulté
 */
const getReadingLevelFromScore = (score) => {
    if (score >= 90) return "Très facile à lire. Élève moyen de 11 ans.";
    else if (score >= 80) return "Facile à lire. Niveau conversationnel.";
    else if (score >= 70) return "Plutôt facile à lire.";
    else if (score >= 60) return "Clair. Pour les 13–15 ans.";
    else if (score >= 50) return "Plutôt difficile à lire.";
    else if (score >= 30) return "Difficile. Niveau universitaire.";
    else return "Très difficile. Pour diplômés universitaires.";
};

/**
 * Analyse le texte saisi et calcule les statistiques de lisibilité
 */
const analyzeReadability = async () => {
    const totalSentences = countSentences(inputText.value); // Fonction externe pour compter les phrases

    // Gestion d'erreur si aucun point final détecté
    if (totalSentences === 0) {
        hasTextError.value = true;
        toast.add({
            severity: "error",
            summary: "Erreur",
            detail: "Votre texte doit contenir au moins une phrase.",
            life: 3000,
        });
        return;
    }

    isCalculating.value = true;

    // Extraction des mots et de leur forme phonétique
    const { countableWords, phoneticWords } = extractWords(inputText.value); // Fonction externe à définir

    // Calcul du nombre total de syllabes à partir du lexique
    const totalSyllables = phoneticWords.reduce((sum, word) => {
        const syllableCount = countSyllabes(
            word,
            phoneticLexicon.value,
        )?.nbsyll; // Fonction externe
        return syllableCount ? sum + syllableCount : sum;
    }, 0);

    // Calcul du score Flesch
    const score = calculateReadabilityScore(
        totalSentences,
        countableWords.length,
        totalSyllables,
    );

    // Enregistrement du résultat
    readabilityResult.value = {
        wordsNb: countableWords.length,
        sentencesNb: totalSentences,
        syllNb: totalSyllables,
        score,
        grade: getReadingLevelFromScore(score),
    };

    isCalculating.value = false;
};
</script>
