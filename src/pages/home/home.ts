import { Component } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {TicketPage} from "../ticket/ticket";
import {HistoriquePage} from "../historique/historique";
import {CartePage} from "../carte/carte";
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";
import {NFC} from "@ionic-native/nfc";
import {ApiProvider} from "../../providers/api/api";
import {InscriptionPage} from "../inscription/inscription";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  menus=[{titre:'TICKET',component:TicketPage,nom:'assets/imgs/shop.png'},
    {titre:'CARTE',component:CartePage,nom:'assets/imgs/card.png' },{titre:'HISTORIQUE',component:HistoriquePage,nom:'assets/imgs/history.png' },
    {titre:'INSCRIPTION',component:InscriptionPage,nom:'assets/imgs/inscription.png'}]

  constructor(private api:ApiProvider,public navCtrl: NavController,public  vctr :ViewController,private GblVariable:GlobalVariableProvider,private nfc:NFC) {


  }
  ionViewWillEnter() {
    this.vctr.showBackButton(false);
  }
  onPage(page){
    if(page.component==CartePage || page.component==InscriptionPage)
    {
      this.nfc.enabled().then(ok=>{

        this.navCtrl.push(page.component);
      }).catch(err=>{
        if(err=="NO_NFC")
          this.api.showError("Cet appareil ne peut lire de carte ");
        else
          this.api.showError("Vous devez activer le lecteur de carte d'abord ");

      })
    }
    else this.navCtrl.push(page.component);
  }

}
