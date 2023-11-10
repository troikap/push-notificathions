import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const parametric: any = {
  TOKENS: 'tokens',
  TOKEN: 'token',
  HELLO: 'hello',
  TOKEN_DATA: 'token-data',
  NOTIFICATION: 'notfiication'
};
type StorageData = | "TOKENS" | "TOKEN" | "HELLO" | "TOKEN_DATA" | "NOTIFICATION";

@Injectable({
  providedIn: 'root'
})

export class StorageProvider {
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
  ) { }

  async init() {
    const storage = await this.storage.create(); 
    this._storage = storage;
  }

  public async setObject(record: StorageData, value: any) {
    return await this._storage?.set(parametric[record], value);
  }

  public async getObject(record: StorageData): Promise<any> {
    if (!this._storage) return;
    return await this._storage.get(parametric[record]);
  }

  public clearObject(record: StorageData): Promise<any> {
    if (!this._storage) return Promise.resolve();
    return this._storage?.remove(parametric[record]);
  }

  public async clearAllObjects() {
    await this._storage?.clear();
  }
}
