export abstract class Factory<T>{abstract create(...args:any[]):T;createMany(count:number,...args:any[]):T[]{return Array.from({length:count},()=>this.create(...args));}}
