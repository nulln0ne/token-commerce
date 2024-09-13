export const truncateString = (str: string, tail: number, head: number): string => {
    return `${str.slice(0, tail)}...${str.slice(-head)}`;
};
