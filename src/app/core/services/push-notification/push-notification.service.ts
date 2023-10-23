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
    console.log('TOKEN ?? ', token);
    if (!token) await this.registerNotifications();
    await this.addListeners();
    await this.getDeliveredNotifications();
  }

  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
      console.log('registerNotifications permStatus ', permStatus);

    }
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }

  addListeners = async () => {
    await PushNotifications.addListener('registration', async token => {
      console.info('Registration token: ', token);
      console.info('Registration token.value: ', token.value);
      if (Capacitor.getPlatform() === 'ios') {
        console.log('111111111111111111111111111');
        
        await this.getTokenIos();
    console.log('5555555555555555555555555555555555555555555');

      } else await this.storageProvider.setObject('TOKEN_DATA', token);
    console.log('66666666666666666666666666666666666');

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

  getTokenIos(): Promise<any> {
    console.log('2222222222222222222222222222');

    return new Promise( (resolve, reject) => {
      FCM.getToken().then( async (r) => {
    console.log('3333333333333333333333333333');

        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ', r.token);
        await this.storageProvider.setObject('TOKEN_DATA', r.token);
    console.log('444444444444444444444444444444444');

        resolve(true);
      }).catch((err) => {
    console.log('444444444444444 eeeeeerrror 444444444444444444');

        console.log('Error getting token with FCM: ', err);
        reject(false);
      }); 
    })
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
