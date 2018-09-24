import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';

import {AlertController, LoadingController} from "ionic-angular";
import {Toast} from "@ionic-native/toast";
@Injectable()
export class ApiProvider {
  loading:any;
  constructor(public http: HTTP,private loadingCtrl:LoadingController,private alertCtrl:AlertController,private toast:Toast) {

  }
  getpost(url:string,body:any={},headers:any={}):any{

    console.log(headers);
    return this.http.post(url,body,headers);
  }
  getdata(url:string,parameters:any={},headers:any={})
  {
    return this.http.get(url,parameters,headers);
  }
  showToast(message){
    this.toast.showLongCenter(message).subscribe(value => {
      console.log(value)
    })
  }
  afficheloading(){
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: 'Veuillez patienter...'
      });
      this.loading.present();
    }
    else this.loading.present();
  }

  dismissloadin(){
    //this.loading.dismiss();
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }
  showAlert(message :string){
    let alert = this.alertCtrl.create({
      title: 'AJIT',
      subTitle: message,
      cssClass:'alertSucces',
      buttons: ['OK']
    });
    alert.present();

  }
  showError(message:string){
    let alert = this.alertCtrl.create({
      title: 'AJIT',
      subTitle: message,
      cssClass:'alertDanger',
      buttons: ['OK']
    });
    alert.present();
  }
}
