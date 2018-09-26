import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {HomePage} from "../home/home";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";
import {ApiProvider} from "../../providers/api/api";
import {SplashScreen} from "@ionic-native/splash-screen";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  datalogin :FormGroup;
  type:string='password';
  selectedImp:any

  constructor(private splashScreen:SplashScreen,private platform:Platform,public navCtrl: NavController, public nav: NavController,private formBuilder:FormBuilder,private store:Storage,private GblVariable:GlobalVariableProvider,private api:ApiProvider) {
    this.platform.ready().then(()=>{
      this.splashScreen.hide();
    });
    this.datalogin = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]

    });
    ;
  }
  lier(){
    console.log(JSON.stringify(this.selectedImp))
    this.api.liaison(this.selectedImp.id)
  }
  chercherimprimante(){

    if(this.GblVariable.statusImpriamte==true){
      //this.GblVariable.statusImpriamte=false
      this.api.rechercheperiph();
    }
    else{

    }



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }
  connexion(){
    this.api.afficheloading();
    this.api.getpost(this.GblVariable.URL+"connection?pin="+encodeURI(this.datalogin.controls['password'].value)+"&imei="+encodeURI(this.datalogin.controls['login'].value))
      .then(data=>{

        let val = JSON.parse(data.data);

        console.log("okk "+JSON.stringify(val));

        if(val.code=="0")
        {
          this.api.getpost(this.GblVariable.URL+"ticketconsultation?token="+val.token+"&nfcid=2181e5b5&voucherid=1").then(sdata=>{
            let solde = JSON.parse(sdata.data);
            if(solde.code=="0")
            {
              this.api.getpost(this.GblVariable.URL+"bilan?agentid="+val.agentid+"&jour=jour&mois=mois&annee=annee").then(dcash=>{
                let cash = JSON.parse(dcash.data);
                if(cash.code=="0" )
                {
                  this.api.dismissloadin();
                  this.datalogin.reset();
                  this.store.set("token",val.token);
                  this.store.set("agentid",val.agentid);
                  this.store.set("nomresto",val.nomresto);
                  this.store.set("boutique",val.prenomagent);
                  this.store.set("solde",solde.montantRestant);
                  this.store.set("cash",cash.montantRecu);
                  this.GblVariable.solde = solde.montantRestant;
                  this.GblVariable.token = val.token;
                  this.GblVariable.agentid = val.agentid;
                  this.GblVariable.boutique=val.nomresto
                  this.GblVariable.cash = cash.montantRecu;
                  this.nav.push(HomePage);
                }
                else{
                  this.api.dismissloadin();
                  this.api.showError(cash.message);
                }

              })

              .catch(err=>{
                this.api.dismissloadin();
                this.api.showError("Impossible de recuperer le cash")
                console.log("erreur "+JSON.stringify(err));
              })

            }
            else {
              this.api.dismissloadin();
             this.api.showError(solde.message);
            }
          }).catch(err=>{
            this.api.dismissloadin();
            this.api.showError("Impossible de recuperer le solde")
            console.log("erreur "+JSON.stringify(err));

          })
/*          this.datalogin.controls['login'].setValue("");
          this.datalogin.controls['password'].setValue("");
          this.store.set("token",val.token);
          this.store.set("agentid",val.agentid);
          this.store.set("nomresto",val.nomresto);
          this.store.set("agentid",val.agentid);
          this.store.set("agentid",val.agentid);
          this.nav.push(HomePage);*/

        }
        else{
          this.api.dismissloadin();
          this.api.showError(val.message);
        }
      }).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Impossible de se connecter")

      console.log("erreur "+JSON.stringify(err));
    })
      // this.navCtrl.setRoot(HomePage);
   // this.navCtrl.push(HomePage)

  }
  affichemdp() {
    this.type="text";

    /*  setTimeout(function () {
       this.type ="password";
      },5000);*/
    setTimeout(() => {
      this.type ="password";
    }, 5000);
  }

}
