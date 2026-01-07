export function createCalculationsWorker():Worker{return new Worker(new URL('./calculations.worker.ts',import.meta.url),{type:'module'});}
