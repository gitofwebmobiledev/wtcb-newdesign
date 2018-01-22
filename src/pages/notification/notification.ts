import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Storage } from '@ionic/storage';
import { MaintenanceTrackerPage } from '../maintenance-tracker/maintenance-tracker';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  
  notifications = [];
  token: any;
  authUser: any;

  constructor(public navCtrl: NavController,
  	public navParams: NavParams,
  	public userService: UserService,
  	public loadingCtrl: LoadingController,
  	public storage: Storage,
    public events: Events) {

  }

  ionViewWillEnter(){
    this.storage.get('userdata').then(val=>{
      console.log("userdata", val);
      if (val != null){
        this.authUser = val.user;
        this.token = val.token;
        this.getNotifications(this.token);
      }
    });
  }

  getNotifications(token){
  	let loading = this.loadingCtrl.create();
    loading.present();
  	this.userService.getNotifications(token)
	  .subscribe(
	    (data) => {
	      loading.dismiss();
	      this.notifications = data;
	      console.log("notifications", data);
	    },
	    (data) => {
	      loading.dismiss();
	      
	    });
  }

  gotoMaintenanceView(requestId){
    let data = {
      token: this.token,
      read: true
    }
    console.log("update noti data", requestId, data);
    this.userService.updateNotification(requestId, data)
    .subscribe(
      (data) => {
        this.events.publish("noti1:changed");
        this.events.publish("noti2:changed");
        this.events.publish("notification:changed");
        this.navCtrl.push(MaintenanceTrackerPage, {requestKey: requestId});
      },
      (data) => {

      });
  }
}
