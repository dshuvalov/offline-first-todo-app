declare interface IDBObjectStore {
  add(value: any, key?: any): IDBRequest;
  autoIncrement: boolean;
  clear(): IDBRequest;
  createIndex(
    indexName: string,
    keyPath: string | string[],
    optionalParameter?: {
      unique?: boolean,
      multiEntry?: boolean,
      ...
    },
  ): IDBIndex;
  count(keyRange?: any | IDBKeyRange): IDBRequest;
  delete(key: any): IDBRequest;
  deleteIndex(indexName: string): void;
  get(key?: any): IDBRequest;
  getAll(key: any, count?: number): IDBRequest;
  index(indexName: string): IDBIndex;
  indexNames: string[];
  name: string;
  keyPath: any;
  openCursor(range?: any | IDBKeyRange, direction?: IDBDirection): IDBRequest;
  openKeyCursor(range?: any | IDBKeyRange, direction?: IDBDirection): IDBRequest;
  put(value: any, key?: any): IDBRequest;
  transaction: IDBTransaction;
}
