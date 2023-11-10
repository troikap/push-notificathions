import { Component } from '@angular/core';
import { PushNotificationProvider } from '../../core/providers/push-notification/push-notification.provider';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public lastPushNotifications: {title: string, body: string, type: string, value: string}[] = [];

  constructor(
    private pushNotificationProvider: PushNotificationProvider,
  ) {}

  async onClickGetPushNotifications() {
    const deliveredNotifications: any[] = await this.pushNotificationProvider.getDeliveredNotifications() as any;
    this.lastPushNotifications = [];
    deliveredNotifications?.forEach(element => {
      if (element.title && element.body) {
        this.lastPushNotifications.push( {title: element.title, body: element.body, type: element.data['notification-type'], value: element.data['notification-value']} )
      }
    });
  }
}