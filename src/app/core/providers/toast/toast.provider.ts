import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastProvider {

  constructor(
    private toastController: ToastController,
  ) {}

  async presentToast(
    message: string,
    duration = 2000,
    color: "danger" | "dark" | "light" | "medium" | "primary" | "secondary" | "success" | "tertiary" | "warning" = "medium",
    position: "top" | "bottom" | "middle" = "top",
    toastExist?: boolean
  ) {
    let icon = '';
    if (color == 'warning') {
      icon = 'alert-circle';
    }
    if (color == 'danger') {
      icon = 'close-circle-outline';
    }
    if (color == 'success') {
      icon = 'checkmark-circle-outline';
    }
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position,
      icon,
      cssClass: color,
      buttons: [
        {
          role: 'cancel',
          icon: 'close-outline'
        }
      ],
    });
    await toast.present();
  }
}
