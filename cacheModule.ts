// cacheModule.d.ts
declare module 'cacheModule' {
    export function cache<T>(fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T>;
}
