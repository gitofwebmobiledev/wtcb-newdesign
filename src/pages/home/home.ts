import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import {BuildingProvider} from '../../providers/building';
import { UserService } from '../../providers/user-service';
import { Storage } from '@ionic/storage';
import { BuildingListPage } from '../building-list/building-list';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	offices: any;
    buildings: any;
    authUser: any;
    token: any;
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public userService:UserService, 
    	public buildingService: BuildingProvider, public storage: Storage) {
    	this.offices = [];
        this.buildings = this.buildingService.list();

        this.authUser = {
            level: 4
        };
  	}

  	ionViewDidEnter() {
       
        this.storage.get('userdata').then(val=>{
          console.log("userdata", val);
          this.token = val.token;
          this.authUser = val.user;
          let loading = this.loadingCtrl.create();
          loading.present();
          this.userService.getAllOffices(this.token)
            .subscribe(
              (data) => {
                loading.dismiss();
                console.log("Getting All Offices:", data);

                this.offices = data;
              },
              (data) => {
                loading.dismiss();
              });
        });
    }

    rentedOffices(buildingId) {
        let count = 0;
        for (let i = 0; i < this.offices.length; i ++) {
            if (this.offices[i]['buildingId'] == buildingId && this.offices[i]['is_rented']) {
                count ++;
            }
        }
        return count;
    }
    
    vacantOffices(buildingId) {
        let count = 0;
        for (let i = 0; i < this.offices.length; i ++) {
            if (this.offices[i]['buildingId'] == buildingId && !this.offices[i]['is_rented']) {
                count ++;
            }
        }
        return count;
    }

    occupancyOffices(buildingId) {
        let count = 0;
        let officeCount = 0;
        for (let i = 0; i < this.offices.length; i ++) {
            if (this.offices[i]['buildingId'] == buildingId) {
                officeCount ++;
                if (this.offices[i]['is_rented']) count ++;
            }
        }
        return count / officeCount * 100;
    }

    public viewBuildingList() {
        this.navCtrl.push(BuildingListPage);
    }
}
