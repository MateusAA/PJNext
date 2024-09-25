// Exemplo de uma função de cache básica
const cacheMap = new Map();

const cache = (fn) => {
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

// Exporta cache e cacheMap
export { cache, cacheMap };
