import { Component } from '@angular/core';
import { StorageProvider } from './core/providers/storage/storage.provider';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private storageProvider: StorageProvider
  ) {
    this.storageProvider.init();
  }
}
