import { Injectable } from '@angular/core';
import { ToastProvider } from '../toast/toast.provider';

@Injectable({
  providedIn: 'root'
})
export class ErrorProvider {

  constructor(
    private toastProvider: ToastProvider 
  ) { }

  async errorHandler(data: any) {
    let message: string = '';
    if (!data || (!data.error && !data.message) || data.status == 0) return this.toastProvider.presentToast('Ya detectamos el error, estamos trabajando para poder brindarle la respuesta que necesita, agradecemos su paciencia.', 5000, 'danger');
    let error;
    if (typeof data.error == 'object') {
      try {
        error = JSON.parse(await data.error.text());
      } catch {
        error = data.error;
      }
    } else {
      error = JSON.parse(data.error);
    } 
    if (typeof error.message === 'object') {
      const entries = Object.values(error.message);
      let firstTime = true;
      for (let entry of entries) {
        if (!firstTime) message += ' ';
        message += entry;
        firstTime = false;
      }
    } else message = error.message;
    let text: string = '';
    if (error.validations) {
      if (typeof error.validations === 'object') {
        const entries = Object.values(error.validations);
        let firstTime = true;
        for (let entry of entries) {
          if (!firstTime) text += ' ';
          text += `${entry}</br>`
          firstTime = false;
        }
      } else text = error.validations;
    }
    message = `<h3>${message}</h3>`
    message += `<i>${text}</i>`;
    if (error.error_code) message += ` <h5 class="text-end fs-6 mt-2"> Código: ${error.error_code}</h5>`;
    if (!message) message = 'Problemas al obtener resultados';
    await this.toastProvider.presentToast(message, 3500, 'danger');
  }
}
