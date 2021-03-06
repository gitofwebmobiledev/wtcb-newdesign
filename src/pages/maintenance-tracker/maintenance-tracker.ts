import {Component} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {LoadingController, AlertController, ModalController} from 'ionic-angular';
import {BuildingProvider} from '../../providers/building';
import { PushServiceProvider } from '../../providers/push-service';
import { UserService } from '../../providers/user-service';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer';
import { DatePicker } from '@ionic-native/date-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PopupPage } from '../popup/popup';
import { OtrsRequestPage } from '../otrs-request/otrs-request';
/**
 * Generated class for the MaintenanceTrackerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-maintenance-tracker',
  templateUrl: 'maintenance-tracker.html',
})
export class MaintenanceTrackerPage {
  requestKey: any;
  request: any;
  office: any;
  user: any;
  authUser: any;
  viewRequest: any;
  requestDetail: any;
  requestDetailKey: any;

  //step 1
  showQuote: any;
  quote = {date: '', time: '', comment: '', company: '', name: '', phone: ''};

  scheduleAccept1: any;
  scheduleReject1: any;
  reschedule1: any;
  //step 2
  quoteAccept: any;
  quoteDeny: any;
  showSchedule: any;
  technician_date: any;
  technician_time: any;
  technician_name: any;
  technician_company: any;
  technician_phone: any;

  //step 3
  scheduleAccept: any;
  scheduleReject: any;
  reschedule: any;

  is_completed: any;

  //step 4
  is_paid: any;

  //step 5
  showInvoice: any;
  rate: any;
  comment: any;

  token:any;

  show1 = false;
  show2 = false;
  show3 = false;
  show4 = false;
  show5 = false;
    
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public loadingCtrl: LoadingController, 
    private buildingService: BuildingProvider, 
    public pushService: PushServiceProvider,
    public userService: UserService,
    public storage: Storage,
    public emailComposer: EmailComposer,
    public datePicker: DatePicker,
    public iab: InAppBrowser,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {
      
    this.requestKey = this.navParams.get('requestKey');
    this.request = {};
    this.requestDetail = {
            token: '',
            status1: 0,
            quote: {
              date: '',
              time: '',
              name: '',
              company: '',
              phone: '',
              comment: ''
            },
            updated_at1: '',
        
            statue1_5: 0,
            updated_at1_5: '',

            status2: 0,
            technician_info:{
                date: '',
                time: '',
                name: '',
                company: '',
                phone: ''
            },
            updated_at2: '',
        
       
            status3: 0,
            is_completed: false,
            updated_at3: '',
        
            is_paid: false,
            status4: 0,
            updated_at4: '',
        
            star: '',
            comment: '',
            status5: 0,
            updated_at5: '', 
            created_by: '',
            updated_at6: '',
    };
    this.office = {};
    this.user = {};
    this.authUser = {
        level: 4
    };
    this.viewRequest = false;
    
    this.requestDetailKey = '';

    //step1
    this.showQuote = true;
    this.scheduleAccept1 = false;
    this.scheduleReject1 = false;
    this.reschedule1 = false;
    //step2
    this.quoteAccept = false;
    this.showSchedule = false;
    this.technician_date = '';
    this.technician_time = '';
    this.technician_name = '';
    this.technician_company = '';
    this.technician_phone = '';

    //step 3
    this.scheduleAccept = false;
    this.scheduleReject = false;
    this.reschedule = false;

    this.is_completed = false;

    //step 4
    this.is_paid = false;

    //step 5
    this.showInvoice = false;
    this.rate = 5;
    this.comment = '';
  }

  ionViewWillEnter(){

    this.storage.get('userdata').then(val=>{
      if (val != null){
        this.authUser = val.user;
        this.token = val.token;

        let loading = this.loadingCtrl.create();
        loading.present();
        this.userService.getRequestsById(this.requestKey, this.token)
          .subscribe(
            (data) => {
              loading.dismiss();
              // let steps = [
              //   {
              //       current: 'Received',
              //       next: 'SEND QUOTE'
              //   }, {
              //       current: 'Quote',
              //       next: 'TECHNICIAN'
              //   }, {
              //       current: 'Tech',
              //       next: 'COMPLETED'
              //   }, {
              //       current: 'Completed',
              //       next: 'INVOICE'
              //   }, {
              //       current: 'Paid',
              //       next: 'CLOSE'
              //   }, {
              //       current: 'Closed',
              //       next: ''
              //   }
              //  ];

               this.request = data[0];
               if (this.request.step == 1 || this.request.step == 1.5){
                 this.show1 = true;
                 this.show2 = false;
                 this.show3 = false;
                 this.show4 = false;
                 this.show5 = false;
               }
               else if(this.request.step == 2){
                 this.show1 = false;
                 this.show2 = true;
                 this.show3 = false;
                 this.show4 = false;
                 this.show5 = false;
               }
               else if(this.request.step == 3){
                 this.show1 = false;
                 this.show2 = false;
                 this.show3 = true;
                 this.show4 = false;
                 this.show5 = false;
               }
               else if(this.request.step == 4){
                 this.show1 = false;
                 this.show2 = false;
                 this.show3 = false;
                 this.show4 = true;
                 this.show5 = false;
               }
               else if(this.request.step == 5){
                 this.show1 = false;
                 this.show2 = false;
                 this.show3 = false;
                 this.show4 = false;
                 this.show5 = true;
               }

                
                this.request.stepText = 'Step ' + this.request.step;

                // if (this.authUser['level'] != 4) {
                //     this.request.stepText += ' - ' + steps[this.request.step - 1].current;
                //     this.request.stepNext = steps[this.request.step - 1].next;
                // }

                this.loadStepDetail();
                this.loadUser();
                this.loadOffice();
            },
            (data) => {
              loading.dismiss();
              
            });
      }
    });
  }

  ionViewDidLoad() {
  }

  onShow1(){
    this.show1 = !this.show1;
  }

  onShow2(){
    this.show2 = !this.show2;
  }

  onShow3(){
    this.show3 = !this.show3;
  }

  onShow4(){
    this.show4 = !this.show4;
  }

  onShow5(){
    this.show5 = !this.show5;
  }

  private loadStepDetail() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.getStepById(this.requestKey, this.token)
    .subscribe(
      (data) => {
        loading.dismiss();
        this.requestDetailKey = data._id;
        this.requestDetail = data;

        if (this.requestDetail['status1'] == 1) {
          this.quoteAccept = true;
        }

        if (this.requestDetail['status1'] == 2) {
          this.quoteDeny = true;
        }

        if (this.requestDetail['status1_5'] == 1){
          this.scheduleAccept1 = true;
        } else if (this.requestDetail['status1_5'] == 2){
          this.scheduleReject1 = true;
        } else if (this.requestDetail['status1_5'] == 3){
          this.reschedule1 = true;
        }

        if (this.requestDetail['status2'] == 1) {
          this.scheduleAccept = true;
        } else if (this.requestDetail['status2'] == 2) {
          this.scheduleReject = true;
        } else if (this.requestDetail['status2'] == 3) {
          this.reschedule = true;
        }

        if (this.requestDetail['status3'] == 1) {
          this.is_paid = true;
        }
      },
      (data) => {
        loading.dismiss();
      });
  }

  private loadUser() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.getUserById(this.request['userKey'])
    .subscribe(
      (data) => {
        loading.dismiss();
        this.user = data;
      },
      (data) => {
        loading.dismiss();
        
      });
  }

  private loadOffice() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.getOfficesById(this.request['officeKey'], this.token)
    .subscribe(
      (data) => {
        loading.dismiss();
        this.office = data[0];

        let buildings = this.buildingService.list();
        for (let i = 0; i < buildings.length; i ++) {
          if (buildings[i].id == this.office.buildingId) {
            this.office.buildingName = buildings[i].name;

            for (let j = 0; j < buildings[i].floors.length; j ++) {
              if (this.office.floorId == buildings[i].floors[j].id) {
                this.office.floorName = buildings[i].floors[j].name;
              }
            }
          }
        }
      },
      (data) => {
        loading.dismiss();
      });
  }
  
  public goToStep1_5(){
    if (this.quote.company == '' || this.quote.date == '' || this.quote.name == '' || 
      this.quote.phone == '' || this.quote.time == ''){
      let alert = this.alertCtrl.create({
        title: "Error", subTitle: "Please fill in the blanks", buttons: ['OK']
      });
      alert.present();
    }
    else{
      this.requestDetail.token = this.token;
      this.requestDetail.quote = this.quote;
      this.requestDetail.step = 1.5;
      this.requestDetail.updated_at1 = new Date();
      let loading = this.loadingCtrl.create();
      loading.present();
   
      this.userService.updateStep(this.requestDetailKey, this.requestDetail)
      .subscribe(
        (data1) => {
          let params = {
              token: this.token,
              step: 1.5
          }
          this.userService.updateRequest(this.requestKey, params)
          .subscribe(
            (data) => {
                loading.dismiss();
                this.request.step = 1.5;
                let alert = this.alertCtrl.create({
                  title: "", subTitle: "Enviaste el tiempo de visita con éxito.", buttons: ['OK']
                });
                alert.present();
            },
            (data) => {
              loading.dismiss();
            });
        },
        (data1) => {
          loading.dismiss();
        });
        
        // this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "Building manager scheduled the time of first meeting for quote.", this.token);
        this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "EG ha programado una visita inicial para hacerle una cotización.", this.token);
    }
  }

  acceptSchedule1(){
    this.requestDetail.status1_5 = 1;
    this.requestDetail.token = this.token;
    this.requestDetail.updated_at1_5 = new Date();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.scheduleAccept1 = true;
      },
      (data1) => {
        loading.dismiss();
        this.scheduleAccept1 = false;
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.company + " aceptó la visita programada.", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee accepted your schedule", this.token);
  }

  rejectSchedule1(){
    this.requestDetail.status1_5 = 2;
    this.requestDetail.token = this.token;
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.scheduleReject1 = true;
      },
      (data1) => {
        loading.dismiss();
        this.scheduleReject1 = false;
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.company + " rechazó la visita programada.", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee accepted your schedule", this.token);
  }

  re_schedule1() {
    this.requestDetail.status1_5 = 3;
    this.requestDetail.token = this.token;
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.reschedule1 = true;
        this.scheduleAccept1 = true;
      },
      (data1) => {
        loading.dismiss();
        this.reschedule1 = false;
        this.scheduleAccept1 = false;
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.company + " reprogramado la visita.", this.token);
  }

  public goToStep2() {
    this.show1=false;
    this.show2=true;
    this.show3=false;
    this.show4=false;
    this.show5=false;
    let email = {
      to: this.user.email,
      //cc: 'erika@mustermann.de',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      // attachments: [
      //   'file://img/logo.png',
      //   'res://icon.png',
      //   'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
      //   'file://README.pdf'
      // ],
      subject: 'Attached Quote',
      body: "<p>Asunto: Cotización solicitud</p><br/><p>Buen día,</p><br/><p>Muy atentamente adjuntamos la cotización a su solicitud de mantenimiento.</p><br/><p>Si esta de acuerdo por favor acepte la cotización desde la aplicación o haciendo click  en este link: www.xxxxx.co/urlxxxxx</p><br/><p>Reciba un cordial saludo,</p><br/><p>Mantenimiento EG Colombia</p><br /><p>PBX: +(57) 1 6420092</p>",
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);

    this.requestDetail.token = this.token;
    this.requestDetail.quote = this.quote;
    this.requestDetail.step = 2;

    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        let params = {
            token: this.token,
            step: 2
        }
        this.userService.updateRequest(this.requestKey, params)
        .subscribe(
          (data) => {
              loading.dismiss();
              this.request.step = 2;
          },
          (data) => {
            loading.dismiss();
          });
      },
      (data1) => {
        loading.dismiss();
      });
    
    // this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "Building manager scheduled the time of first meeting for quote.", this.token);
    this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "EG ha programado una visita inicial para hacerle una cotización.", this.token);
  }

  acceptQuote(){
    this.requestDetail.status1 = 1;
    this.requestDetail.token = this.token;

    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.quoteAccept = true;
      },
      (data1) => {
        loading.dismiss();
        this.quoteAccept = false;
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.company + " aceptó la cotización.", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee accepted your quote", this.token);
  }

  denyQuote1(){

    let modal = this.modalCtrl.create(PopupPage);
    modal.present();

    modal.onDidDismiss(data =>{
      this.requestDetail.status1 = 2;
      this.requestDetail.quote.comment = data.comment;
      this.requestDetail.token = this.token;

      let loading = this.loadingCtrl.create();
      loading.present();
      this.userService.updateStep(this.requestDetailKey, this.requestDetail)
      .subscribe(
        (data1) => {
          loading.dismiss();
          this.quoteDeny = true;
          this.navCtrl.push(OtrsRequestPage);
        },
        (data1) => {
          loading.dismiss();
          this.quoteDeny = false;
        });
      
      this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.company + " rechazo la cotización.", this.token);
      // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee denied your quote", this.token);
    });
  }

  denyQuote(){
    let alert = this.alertCtrl.create({
      title: '',
      message: '¿Esta seguro que desea cancelar su ticket?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.denyQuote1();
          }
        }
      ]
    });
    alert.present();
  }

  public goToStep3() {
    // let appointment_date;
    // this.datePicker.show({
    //   date: new Date(),
    //   mode: 'datetime',
    //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    // }).then(
    //   (date) => {
    //     console.log("appointment_date", date + "asdaf");
        
    //   },
    //   (err) => {
    //     console.log('Error occurred while getting date: ', err);
    //   }
    // );

    this.show1=false;
    this.show2=false;
    this.show3=true;
    this.show4=false;
    this.show5=false;

    this.requestDetail.token = this.token;
    this.requestDetail.step = 3;

    this.requestDetail.technician_info={
        company : this.technician_company,
        date : this.technician_date,
        name : this.technician_name,
        phone : this.technician_phone,
        time : this.technician_time
    }

    if (this.requestDetail.technician_info.company == '' || this.requestDetail.technician_info.date == '' || this.requestDetail.technician_info.name == '' || 
       this.requestDetail.technician_info.phone == '' || this.requestDetail.technician_info.time == ''){
      let alert = this.alertCtrl.create({
        title: "Error", subTitle: "Please fill in the blanks", buttons: ['OK']
      });
      alert.present();
    }
    else{
      this.requestDetail.step = 3;
      let loading = this.loadingCtrl.create();
      loading.present();
      this.userService.updateStep(this.requestDetailKey, this.requestDetail)
      .subscribe(
        (data1) => {
          let params = {
              token: this.token,
              step: 3
          }
          this.userService.updateRequest(this.requestKey, params)
          .subscribe(
            (data) => {
                loading.dismiss();
                this.request.step = 3;
                this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "EG programó la visita del técnico para el día y hora a continuación: " + this.technician_date + " " + this.technician_time, this.token);
            
                // this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "Building manager scheduled technician time to " + this.technician_date + " " + this.technician_time, this.token);
            },
            (data) => {
              loading.dismiss();
            });
        },
        (data1) => {
          loading.dismiss();
        });
    }
  }

  acceptSchedule(){
    this.requestDetail.status2 = 1;
    this.requestDetail.token = this.token;
    this.requestDetail.updated_at2 = new Date();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.scheduleAccept = true;
      },
      (data1) => {
        loading.dismiss();
        this.scheduleAccept = false;
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.name + " aceptó la visita programada.", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee accepted your schedule", this.token);
  }

  rejectSchedule(){
    this.requestDetail.status2 = 2;
    this.requestDetail.token = this.token;
    this.requestDetail.updated_at2 = new Date();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.scheduleReject = true;
      },
      (data1) => {
        loading.dismiss();
        this.scheduleReject = false;
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.name + " rechazó la visita programada.", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee accepted your schedule", this.token);
  }

  re_schedule(){
    this.requestDetail.status2 = 3;
    this.requestDetail.token = this.token;
    this.requestDetail.updated_at2 = new Date();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.reschedule = true;
        this.scheduleAccept = true;
      },
      (data1) => {
        loading.dismiss();
        this.scheduleAccept = false;
        this.reschedule = false
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.name + " reprogramado la visita.", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee accepted your schedule", this.token);
  }

  public goToStep4() {
    // let appointment_date;
    // this.datePicker.show({
    //   date: new Date(),
    //   mode: 'datetime',
    //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    // }).then(
    //   date => console.log('Got date: ', date),
    //   err => console.log('Error occurred while getting date: ', err)
    // );
    this.show1=false;
    this.show2=false;
    this.show3=false;
    this.show4=true;
    this.show5=false;

    this.requestDetail.token = this.token;
    this.requestDetail.step = 4;

    this.requestDetail.token = this.token;
    this.requestDetail.is_completed = true;
    this.requestDetail.step = 4;
    this.requestDetail.updated_at3 = new Date();

    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        let params = {
            token: this.token,
            step: 4
        }
        this.userService.updateRequest(this.requestKey, params)
        .subscribe(
          (data) => {
              loading.dismiss();
            this.request.step = 4;
          },
          (data) => {
            loading.dismiss();
          });
      },
      (data1) => {
        loading.dismiss();
      });
    
     this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "EG ha finalizado los trabajos. Su factura està disponible para pago.", this.token);
     // this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "Building manager completed your request", this.token);   
  }

  public payInvoice() {
    this.requestDetail.status3 = 1;
    this.requestDetail.token = this.token;
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
        this.is_paid = true;
      },
      (data1) => {
        loading.dismiss();
        this.is_paid = false;
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.name + " pagó su factura", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee paid to your invoice", this.token);
    this.iab.create('https://www.mipagoamigo.com/MPA_WebSite/');
  }

  public paidInvoice() {
    this.show1=false;
    this.show2=false;
    this.show3=false;
    this.show4=false;
    this.show5=true;
    
    this.requestDetail.token = this.token;
    this.requestDetail.is_paid = true;
    this.requestDetail.updated_at4 = new Date();
    this.requestDetail.step = 5;
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        let params = {
            token: this.token,
            step: 5
        }
        this.userService.updateRequest(this.requestKey, params)
        .subscribe(
          (data) => {
            loading.dismiss();
            this.request.step = 5;
          },
          (data) => {
            loading.dismiss();
          });
      },
      (data1) => {
        loading.dismiss();
      });
     
      this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "EG recibió su pago", this.token);
      // this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "Building manager accepted your payment", this.token);
  }

  public viewInvoice() {
    this.showInvoice = !this.showInvoice;
  }

  public leaveReview() {
    this.show5 = false;
    this.requestDetail.token = this.token;
    this.requestDetail.star = this.rate;
    this.requestDetail.comment = this.comment;
    this.requestDetail.status5 = 1;
    let loading = this.loadingCtrl.create();
    loading.present();
    this.userService.updateStep(this.requestDetailKey, this.requestDetail)
    .subscribe(
      (data1) => {
        loading.dismiss();
      },
      (data1) => {
        loading.dismiss();
      });
    
    this.pushService.notiBuildingManagerForRequest(this.request._id, this.office.name + " ha calificado el servicio", this.token);
    // this.pushService.notiBuildingManagerForRequest(this.request._id, "Employee provided feedback", this.token);
  }

  public archiveRequest() {
    this.show5 = false;
    let loading = this.loadingCtrl.create();
    loading.present();
    let params = {
        token: this.token,
        step: 6
    }

    this.requestDetail.token = this.token;
    this.requestDetail.step = 6; 
    this.requestDetail.updated_at6 = new Date();

    this.userService.updateRequest(this.requestKey, params)
    .subscribe(
      (data) => {
        loading.dismiss();
        this.request.step = 6;
        this.userService.updateStep(this.requestDetailKey, this.requestDetail)
          .subscribe(
            (data1) => {
              //this.request.step = 6;
            },
            (data1) => {
              
            });
      },
      (data) => {
        loading.dismiss();
      });
    
    this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "EG ha archivado su solicitud", this.token);
    // this.pushService.notiUserForRequest(this.request.userKey, this.request._id, "Building manager archived your request", this.token);
  }
}
