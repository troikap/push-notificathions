import { Component } from '@angular/core';
import { GenericService } from '../core/services/generic/generic.service';
import { PushNotificationService } from '../core/services/push-notification/push-notification.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private genericService: GenericService,
    private pushNotificationService: PushNotificationService
  ) {}

  async onClickSignUp() {
    console.log('REGISTRANDO TOKEN');
    try {
      const response = await this.pushNotificationService.registerPush();
      console.log('TOKEN ', response);
      this.genericService.setToken(response);
    } catch (err) {
      console.log('ERROR ', err);
    }
  }

  async onClickGetToken() {
    console.log('OBTENIENDO TOKEN');
    try {
      const response = await this.genericService.getToken();
      console.log('REPSONSE ', response);
      
    } catch (err) {
      console.log('ERROR ', err);
    }
  }


  

}
