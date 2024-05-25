export const sentenceCase = (input: string): string => {
    if (!input) {
        return input;
    }
    input = input.trim();
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};
