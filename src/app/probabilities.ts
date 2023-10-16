type Item = {
    value: number;
    probability: number;
};

const items: Item[] = [
    { value: 16, probability: 0.45 },
    { value: 30, probability: 0.45 },
    { value: 60, probability: 0.10 },
];

const defaultMap = new Map(items.map(i => [i.value, i.probability]));

function generateCombinations(items: Item[], length: number): Map<number, number> {
    if (length <= 1) {
        return defaultMap;
    }
    const combinations: Map<number, number> = new Map();
    items.forEach((item) => {
        const smallerCombinations = generateCombinations(items, length - 1);
        smallerCombinations.forEach((probability, innerValue) => {
            const newValue = item.value + innerValue;
            const existingProbability = combinations.get(newValue) ?? 0;
            combinations.set(newValue, existingProbability + probability * item.probability);
        });
    });
    return combinations;
}

export function calculateProbabilityForSum(itemCount: number, targetSum: number): number {
    if (itemCount > 16) {
        return NaN;
    }

    const allCombinations = generateCombinations(items, itemCount);
    let cumulativeProbability = 0;

    allCombinations.forEach((probability, value) => {
        if (value >= targetSum) {
            cumulativeProbability += probability;
        }
    });

    return cumulativeProbability;
}