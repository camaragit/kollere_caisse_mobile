import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NFC} from "@ionic-native/nfc";

/**
 * Generated class for the HistoriquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-historique',
  templateUrl: 'historique.html',
})
export class HistoriquePage {
  datesearch:any
  affiche:boolean=false

  listeitems : Array<{item: string,prixboutique:string,prixkollere:string,ticket:string}>=[];
  constructor(private GblVariable:GlobalVariableProvider,private api:ApiProvider,public navCtrl: NavController, public navParams: NavParams) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoriquePage');
  }

  chercherAchat(){
    this.affiche=false
    let jour = this.datesearch.substr(8,2);
    let mois = this.datesearch.substr(5,2);
    let annee = this.datesearch.substr(0,4);
   let url = this.GblVariable.URL+"achatfromsite?token="+this.GblVariable.token+"&jour="+jour+"&mois="+mois+"&annee="+annee;
   this.api.afficheloading();
   this.api.getpost(url).then(data=>{
     this.api.dismissloadin();
     let val = JSON.parse(data.data)
     if(val.code=="0")
     {
       let achats = val.lAchats
       if(achats.length>0)
       {
         this.affiche=true
         for(let i=0;i<achats.length;i++)
           this.listeitems.push({item:achats[i].item,prixboutique:achats[i].prixrestaurant,prixkollere:achats[i].prixkollere,ticket:achats[i].ticket});

       }
       else this.api.showError("Pas d'achats effectué pendant cette date")
     }
     else this.api.showError(val.message)

   }).catch(err=>{
     this.api.dismissloadin();
     this.api.showError("Impossible d'afficher l'historique")
   })

  }

}
