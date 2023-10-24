import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoadingProvider {
  private loading: HTMLIonLoadingElement;

  constructor(
    private loadingController: LoadingController
  ) {}

  async showLoading( message: string, duration?: number) {
    if (!duration) duration = 60000;
    this.loading = await this.loadingController.create({
      message,
      duration,
      cssClass: 'custom-loading'
    });
    this.loading.present();
    return this.loading;
  }

  async dismissLoading( loading?: HTMLIonLoadingElement) {
    await this.closeLoader(loading);
  }

  async closeLoader(loading?: HTMLIonLoadingElement) {
    await this.checkAndCloseLoader(loading);
  }

  async checkAndCloseLoader(loading?: HTMLIonLoadingElement) {
    if (!loading) loading = await this.loadingController.getTop();
    if (loading !== undefined) await loading.dismiss();
  }
}
