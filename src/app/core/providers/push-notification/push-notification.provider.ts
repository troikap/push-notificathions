import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StorageProvider } from '../storage/storage.provider';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationProvider {

  constructor(
    private storageProvider: StorageProvider,
    private alertController: AlertController,
    private navController: NavController,
  ) {}

  async registerPush(): Promise<any>{
    const token = await this.storageProvider.getObject('TOKEN');
    if (!token) await this.registerNotifications();
    await this.addListeners();
    await this.getDeliveredNotifications();
  }

  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }

  addListeners = async () => {
    await PushNotifications.addListener('registration', async token => {
      console.info('Registration token.value: ', token.value);
      if (Capacitor.getPlatform() === 'ios') {    
        FCM.getToken().then( async (r) => {
          console.log('TOKEN FCM ----------> ', r);
          await this.storageProvider.setObject('TOKEN', r.token);
        }).catch((err) => console.log('Error getting token with FCM --------: ', err)); 
      } else {
        console.log('TOKEN ----------> ', token);
        await this.storageProvider.setObject('TOKEN', token);
      }
    });
    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });
    await PushNotifications.addListener('pushNotificationReceived', async notification => {
      console.log('Push notification received: ', notification);
      const accepted = await this.alertPresentation();
      if (!accepted) return;
      this.navController.navigateForward(['notification'], {queryParams: {key: notification.data['notification-value'], type: notification.data['notification-type']}});
    });
    await PushNotifications.addListener('pushNotificationActionPerformed', notificationData => {
      console.log('Push notification action performed', notificationData);
      if (notificationData.actionId == 'tap') {
        if (notificationData.notification?.data) {
          this.navController.navigateForward(['notification'], {queryParams: {key: notificationData.notification.data['notification-value'], type: notificationData.notification.data['notification-type']}});
        }
      }
    });
  }
  
  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
    return notificationList.notifications;
  }

  async onlyGetPermission() {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
      console.log('onlyGetPermission permStatus ', permStatus);
    }
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
  }

  async alertPresentation() {
    const alert = await this.alertController.create({
      header: 'Push notification recibida',
      subHeader: 'Deseas visualizar información recibida?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-primary'
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'alert-button-secondary'
        },
      ],
    });
    await alert.present();
    const alertResult = await alert.onDidDismiss();
    console.log('RESULT ', alertResult);
    return alertResult.role == 'confirm' ? true : false;
  }
}
