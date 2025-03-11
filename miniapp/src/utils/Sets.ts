export const areSetsEqual   = (setA: Set<number>, setB: Set<number>): boolean => {
    if (setA.size !== setB.size) return false;
    for (const value of setA) {
        if (!setB.has(value)) return false;
    }
    return true;
};
export const getIdSet = (arr: { id: number }[]) =>
    new Set(arr.map(item => item.id));