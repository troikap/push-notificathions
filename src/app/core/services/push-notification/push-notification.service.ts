import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StorageProvider } from '../../providers/storage/storage.provider';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private storageProvider: StorageProvider
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
          await this.storageProvider.setObject('TOKEN', r.token);
        }).catch((err) => console.log('Error getting token with FCM: ', err)); 
      } else await this.storageProvider.setObject('TOKEN', token);
    });
    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }
  
  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
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
}
