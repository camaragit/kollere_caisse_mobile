import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import {AlertController, App, LoadingController, ModalController} from "ionic-angular";
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";
import {GlobalVariableProvider} from "../gloabal-variable/gloabal-variable";
import {ImprimantePage} from "../../pages/imprimante/imprimante";
import {Toast} from "@ionic-native/toast";

@Injectable()
export class ApiProvider {
  loading: any;
//private nav:NavController
  constructor(private toast:Toast,private modalCrtl:ModalController,public http: HTTP,private app:App,private loadingCtrl: LoadingController, private alertCtrl: AlertController, private bluetooth: BluetoothSerial, private GblVariable: GlobalVariableProvider) {

  }

  getpost(url: string, body: any = {}, headers: any = {}): any {
    headers.withcard="0"

    console.log(headers);
    console.log(url);
    return this.http.post(url, body, headers);
  }

  getdata(url: string, parameters: any = {}, headers: any = {}) {
    return this.http.get(url, parameters, headers);
  }

    showToast(message){
      this.toast.showLongCenter(message).subscribe(value => {
        console.log(value)
      })
    }
  afficheloading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Veuillez patienter...'
      });
      this.loading.present();
    }
    else this.loading.present();
  }

  dismissloadin() {
    //this.loading.dismiss();
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  showAlert(message: string) {
    let alert = this.alertCtrl.create({
      title: 'AJIT',
      subTitle: message,
      cssClass: 'alertSucces',
      buttons: ['OK']
    });
    alert.present();

  }

  showError(message: string) {
    let alert = this.alertCtrl.create({
      title: 'AJIT',
      subTitle: message,
      cssClass: 'alertDanger',
      buttons: ['OK']
    });
    alert.present();
  }

  rechercheperiph() {
    this.bluetooth.isConnected().then(err => {
      this.GblVariable.notfound = true;
      this.GblVariable.message = "Vous êtes deja connecté à une imprimante"
    }).catch(err => {

      this.bluetooth.isEnabled().then(vall => {
        this.afficheloading();
        this.bluetooth.discoverUnpaired().then(data => {
          this.dismissloadin();
          console.log("liste imp " + JSON.stringify(data));

          if (data.length <= 0) {
            this.GblVariable.statusImpriamte = false;
            this.GblVariable.notfound = true;
            this.GblVariable.message = "Aucune imrpimante trouvée!"

          }
          else {
            this.GblVariable.listeImprimantes = this.listeimprimanteAutorisees(data);
            if(this.GblVariable.listeImprimantes.length <=0)
            {
              this.GblVariable.statusImpriamte = false;
              this.GblVariable.notfound = true;
              this.GblVariable.message = "Aucune imrpimante trouvée!"
            }
            else
              this.GblVariable.notfound = false;

          }

        })

      }).catch(err => {
        this.GblVariable.statusImpriamte=false;
        this.dismissloadin();
        this.bluetooth.enable().then(act => {
          this.GblVariable.statusImpriamte=false;
          this.GblVariable.notfound=true;
          this.GblVariable.message=""
        }).catch(err => {
          this.GblVariable.notfound=true;
          this.GblVariable.message=""
        })
      })
    })

  }

  imprimer(text) {
    this.bluetooth.isConnected().then(d => {
      this.bluetooth.write(text).then(data => {
        console.log("impression ok")

      }).catch(err => {
        this.showError("Erreur impression" + JSON.stringify(err))
      })
    }).catch(err=>{
    // let nav = this.app.getActiveNav();

      let mod= this.modalCrtl.create(ImprimantePage,{'text':text},{cssClass: "test"});
      mod.present();
      mod.onDidDismiss(d=>{

      })
    })

  }

  liaison(id) {
    this.GblVariable.liaisonreussie=false;
    this.afficheloading();
    this.bluetooth.connect(id).subscribe(data => {
      this.dismissloadin();
      this.GblVariable.liaisonreussie=true;
      console.log("impression ok " + JSON.stringify(data))
      this.showToast("Liaison à l'imprimante réussie")
    },error2 => {
      this.dismissloadin();
      this.showError("Erreur lors de la liaison à l'imprimante veuillez réessayer ")
    })

  }
  linking(id){
    return new Promise( (resolve, reject) => {

      this.bluetooth.connect(id).subscribe(data => {
        this.dismissloadin();
        this.GblVariable.liaisonreussie=true;
        console.log("impression ok " + JSON.stringify(data));
        resolve('ok')
        this.showToast("Liaison à l'imprimante réussie")
      },error2 => {
        this.dismissloadin();
        reject('nok')
        this.showError("Erreur lors de la liaison à l'imprimante veuillez réessayer ")
      })
    });
  }
  imprimerRecu(listeitems=[],totalb,totalk,isticket:boolean,item=""){
    let imp =""
    let dt = new Date();
    let m = dt.getMonth()*1 + 1
    let mois = m < 10 ?"0"+m:m;
    let d = dt.getDate()+"-"+mois+"-"+dt.getFullYear();

    let entete='           Kollere   \n\n';
    entete+='         Recu de transaction\n \n';
    let type='         Copie Caisse\n \n';
    let datet='Le            : '+d+'\n';
    let corps="         Commande:\n";
    corps+='******************************\n';
    if(isticket)
    {
      for(let i=0;i<listeitems.length;i++)
      {
        corps+='Produit       :'+listeitems[i].item+'\n';
        corps+='Quantite      :'+listeitems[i].quantite+'\n';
        corps+='Prix Boutique :'+listeitems[i].prixboutique+'F CFA\n';
        corps+='Prix Kollere  :'+listeitems[i].prixkollere+'F CFA\n'
        if(i+1<listeitems.length)
          corps+='------------------------------\n'

      }
    }
    else{
      corps+='Produit       :'+item+'\n';
    }

    corps+='******************************\n\n';
    corps+='Total Boutique:'+totalb+'F CFA\n\n';
    corps+='Total Kollere :'+totalk+'F CFA\n\n';
    corps+='Code Ticket   :'+this.GblVariable.codeticket+'\n\n';
    imp+= entete+type+datet+corps;
    imp+='xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n\n';
    imp+=entete;
    type='         Copie Client\n \n';
    imp+=type+datet+corps;

    imp+= "Kollere vous remercie. \n"
    imp+= "Pour assistance contactez :\n 33 950 29 74 / 77 415 31 99\n \n\n\n"
    console.log(imp);
    this.imprimer(imp);
  }

   listeimprimanteAutorisees(data) {
    var liste=[];

    for(let i=0;i<this.GblVariable.ImprimanteAutorisee.length;i++)
    {
      for(let j=0;j<data.length;j++)
      {
        if(data[j].name.indexOf(this.GblVariable.ImprimanteAutorisee[i])!=-1)
        {
          if(liste.indexOf(data[j])==-1)
            liste.push(data[j]);
        }
      }
    }

    return liste;
  }

}
