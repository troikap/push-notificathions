import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.page.html',
  styleUrls: ['notification.page.scss']
})
export class NotificationPage implements OnInit {
  public key: string;
  public type: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
  ) {}
  
  ngOnInit(): void {
    const algo = this.activatedRoute.snapshot;
    this.key = algo.queryParams['key'];
    this.type = algo.queryParams['type'];
  }

  onClickBack() {
    this.navController.back();
  }
}
