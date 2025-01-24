
export const truncateText = (text, maxLength = 180, ending = '...') => {
    if (!text) {
        return '';
    }
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength - ending.length) + ending;
};