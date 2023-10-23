import { Component } from '@angular/core';
import { GenericService } from '../core/services/generic/generic.service';
import { PushNotificationService } from '../core/services/push-notification/push-notification.service';
import { StorageProvider } from '../core/providers/storage/storage.provider';
import { ToastProvider } from '../core/providers/toast/toast.provider';
import { ErrorProvider } from '../core/providers/error/error.provider';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public message: string = '';
  public title: string = '';
  public image: string = '';
  public tokens: any[] = [];

  constructor(
    private genericService: GenericService,
    private pushNotificationService: PushNotificationService,
    private storageProvider: StorageProvider,
    private toastProvider: ToastProvider,
    private errorProvider: ErrorProvider,
    private alertController: AlertController
  ) {}

  async onClickSignUp() {
    try {
      await this.pushNotificationService.registerPush();
      const token = await this.storageProvider.getObject('TOKEN');
      if (!token) return this.toastProvider.presentToast('Problemas al obtener token', 3000, 'warning');
      const alert = await this.alertController.create({
        header: 'Usuario',
        subHeader: 'Ingrese el nombre de su usuario',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'alert-button-primary'
          },
          {
            text: 'Continuar',
            role: 'confirm',
            cssClass: 'alert-button-secondary'
          },
        ],
        inputs: [
            {
              name: 'name',
              placeholder: 'Nombre',
            },
          ]
      });
      await alert.present();
      const alertResult = await alert.onDidDismiss();
      const userName = alertResult.data.values['name'];
      const response = await this.genericService.setToken(token, userName);
      if (response) {
        this.toastProvider.presentToast('Token registrado correctamente', 3000, 'success');
        this.tokens = response.data.map((element: any) => {
          element.checked = false;
          return element;
        });
      }
    } catch (err) {
      console.log('ERROR ', err);
      this.errorProvider.errorHandler(err);
    }
  }

  async onClickGetTokens() {
    try {
      const response = await this.genericService.getToken();
      if (response) {
        this.toastProvider.presentToast('Token obtenidos correctamente', 3000, 'success');
        this.tokens = response.data.map((element: any) => {
          element.checked = false;
          return element;
        });
        console.log('TOKKEN SETEADOS ', this.tokens);

      }
    } catch (err) {
      console.log('ERROR ', err);
      this.errorProvider.errorHandler(err);
    }
  }

  async onClickGetToken() {
    const token = await this.storageProvider.getObject('TOKEN');
    if (token) this.toastProvider.presentToast('Tenes seteado el token', 3000, 'success');
    else this.toastProvider.presentToast('No tenes seteado el token', 3000, 'warning');
  }

  async onClickHello() {
    try {
      const resposne = await this.genericService.getHello();
      await this.storageProvider.setObject('HELLO', 'STORAGE');
      if (resposne) return this.toastProvider.presentToast('HELLO registrado correctamente', 3000, 'success');
    } catch (err) {
      console.log('ERROR ', err);
      this.errorProvider.errorHandler(err);
    }
  }

  async onClickSendMessage() {
    const checkedTokens = this.tokens.filter(element => element.checked === true)
    if (!checkedTokens || checkedTokens.length == 0) return this.toastProvider.presentToast('No se encontro el token', 3000, 'warning');
    if (!this.title) return this.toastProvider.presentToast('Ingresa titulo del mensaje', 3000, 'warning');
    if (!this.message) return this.toastProvider.presentToast('Ingresa contenido del mensaje', 3000, 'warning');
    const payload = {
      tokens: checkedTokens,
      title: this.title,
      message: this.message,
      image: this.image
    }
    try {
      const response = await this.genericService.setMessage(payload);
      if (response) return this.toastProvider.presentToast('Mensaje enviado correctamente', 3000, 'success');
      console.log('REPSONSE ', response);
    } catch (err) {
      console.log('ERROR ', err);
      this.errorProvider.errorHandler(err);
    }
  }

  onClickPermission() {
    this.pushNotificationService.onlyGetPermission();
  }
}
