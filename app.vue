<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 min-h-screen p-8 flex flex-col gap-6"
    >
        <AppTopbar />

        <div class="flex flex-col w-full max-w-7xl mx-auto gap-6 flex-1">
            <div
                class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-700 w-full flex-1 flex gap-6"
            >
                <!-- Zone de texte -->
                <div class="flex-1">
                    <FloatLabel variant="on" class="w-full h-full">
                        <Textarea
                            id="input_text"
                            v-model="text"
                            style="resize: none"
                            class="w-full h-full"
                        />
                        <label for="input_text">Votre texte</label>
                    </FloatLabel>
                </div>

                <!-- Résultats et bouton -->
                <div class="w-1/3 flex flex-col">
                    <div class="flex-1 flex flex-col gap-6">
                        <!-- Affichage des résultats uniquement après calcul -->
                        <div
                            v-if="result !== null"
                            class="flex flex-col gap-2 items-center mt-5"
                        >
                            <span class="text-[3rem] font-bold">{{
                                result.score.toFixed(2)
                            }}</span>
                            <span
                                class="text-sm text-surface-500 text-center"
                                >{{ result.grade }}</span
                            >

                            <div class="flex flex-col gap-2 mt-4">
                                <span class="text-sm"
                                    >Nombre de mots : {{ result.wordsNb }}</span
                                >
                                <span class="text-sm"
                                    >Nombre de phrases :
                                    {{ result.sentencesNb }}</span
                                >
                                <span class="text-sm"
                                    >Nombre de syllabes :
                                    {{ result.syllNb }}</span
                                >
                            </div>
                        </div>

                        <!-- Message d'attente ou d’instruction -->
                        <div
                            v-else
                            class="text-sm text-surface-400 text-center mt-5"
                        >
                            Entrez un texte puis cliquez sur "Calculer"
                        </div>
                    </div>

                    <!-- Bouton de calcul -->
                    <Button
                        label="Calculer"
                        class="w-full"
                        :loading="calculating"
                        @click="startCalculate"
                    />
                </div>
            </div>
        </div>

        <AppFooter />
    </div>
</template>

<script setup>
// Texte entré par l'utilisateur
const text = ref("");

// État de chargement du bouton
const calculating = ref(false);

// Résultat du calcul, null au départ pour éviter l'hydration mismatch
const result = ref(null);

const lexique = ref(null);

onMounted(async () => {
    text.value = "";
    lexique.value = await getLexique();
});

/**
 * Calcule les indicateurs de lisibilité du texte et met à jour `result`
 */
const startCalculate = async () => {
    calculating.value = true;

    const { countableWords, phoneticWords } = extractWords(text.value);

    let syllTotal = 0;
    for (let i = 0; i < phoneticWords.length; i++) {
        const nb = countSyllabes(phoneticWords[i], lexique.value).nbsyll;
        console.log(nb);
        if (nb !== null) syllTotal += nb;
    }

    const sentencesTotal = countSentences(text.value);

    const score =
        206.835 -
        1.015 * (countableWords.length / sentencesTotal) -
        84.6 * (syllTotal / countableWords.length);

    // Attribuer une note en fonction du score
    let grade;
    if (score >= 90) {
        grade =
            "Très facile à lire. Facilement compréhensible par un élève moyen de 11 ans.";
    } else if (score >= 80) {
        grade =
            "Facile à lire. Anglais conversationnel pour les consommateurs.";
    } else if (score >= 70) {
        grade = "Plutôt facile à lire.";
    } else if (score >= 60) {
        grade =
            "En clair. Facilement compréhensible par les élèves de 13 à 15 ans.";
    } else if (score >= 50) {
        grade = "Plutôt difficile à lire.";
    } else if (score >= 30) {
        grade = "Difficile à lire. Université ou Grande Ecole.";
    } else {
        grade =
            "Très difficile à lire. Mieux compris par les diplômés universitaires.";
    }

    // Mise à jour des résultats
    result.value = {
        wordsNb: countableWords.length,
        sentencesNb: sentencesTotal,
        syllNb: syllTotal,
        score: score,
        grade: `"${grade}"`,
    };

    calculating.value = false;
};
</script>
