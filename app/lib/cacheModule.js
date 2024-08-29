// Exemplo de uma função de cache básica
const cache = (fn) => {
    const cacheMap = new Map();

    return async (...args) => {
        const key = JSON.stringify(args);
        if (cacheMap.has(key)) {
            return cacheMap.get(key);
        }

        const result = await fn(...args);
        cacheMap.set(key, result);
        return result;
    };
};

export { cache };
