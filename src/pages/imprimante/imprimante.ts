import {Component, Injector} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";

/**
 * Generated class for the ImprimantePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-imprimante',
  templateUrl: 'imprimante.html',
})
export class ImprimantePage {
  selectedImp:any;
  textaimprimer:any
  api:any
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,public GblVariable:GlobalVariableProvider,private injector:Injector) {
    this.api = this.injector.get(ApiProvider)
    this.textaimprimer = navParams.get("text");
    this.rechercher();
  }
  rechercher(){
    this.api.rechercheperiph();
  }
  lier(){
   this.api.linking(this.selectedImp.id).then(data=>{
     console.log("data vaut "+data)
     if(this.GblVariable.liaisonreussie==true)
     {
       this.api.imprimer(this.textaimprimer);
       this.viewCtrl.dismiss();
     }
   })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImprimantePage');
  }

}
