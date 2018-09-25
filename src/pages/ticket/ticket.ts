import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the TicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {
  codeTicket:any="";
  affiche:boolean=false;
  item:string="";
  prixkollere:string=""
  prixboutique:string=""
  isticket:boolean=false;
  totalb:number;
  totalk:number

  listeitems : Array<{item: string,quantite:string,prixkollere:string,prixboutique:string}>=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private GblVariable:GlobalVariableProvider,private api:ApiProvider) {
    this.GblVariable.codeticket=""
    this.reload();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }
  chercherCode(){
    this.GblVariable.codeticket="";
    if(this.codeTicket.substring(0,2).toUpperCase()=="GT"){
      this.prixkollere=""
      this.prixboutique=""
      this.affiche=false;

      this.api.afficheloading();
      this.api.getpost(this.GblVariable.URL+"infosticket?ticket="+this.codeTicket+"&token="+this.GblVariable.token).then(data=>{
        this.api.dismissloadin();
        let val = JSON.parse(data.data);

        if(val.code=="0")
        {
          this.GblVariable.codeticket=this.codeTicket
          this.affiche=true;
          this.isticket=false;
          this.item= val.item;
          this.prixboutique=val.prixResto+"F CFA"
          this.prixkollere=val.montantKollere+"F CFA";

        }
        else this.api.showError(val.message);
      }).catch(err=>{
        this.api.dismissloadin();
        this.api.showError("Impossible de recuperer les infos du ticket")
        console.log("erreur "+JSON.stringify(err));

      })

    }
    else{
      let url =this.GblVariable.URL+"listpaniertemsresto?token="+this.GblVariable.token+"&codepanier="+this.codeTicket;
      this.api.afficheloading();
      this.api.getpost(url).then(data=>{
        this.api.dismissloadin();
        let val = JSON.parse(data.data);
        if(val.code=="0")
        {
          this.GblVariable.codeticket=this.codeTicket;
          this.listeitems=[];
          let valeur = val.paniers
          for(let i=0;i<valeur.length;i++)
            this.listeitems.push({item:valeur[i].item,quantite:valeur[i].quantite,prixkollere:valeur[i].prixsurkollere,prixboutique:valeur[i].prixrestaurant});
          this.totalb= +val.montantResto;
          this.totalk = +val.montantKollere;
          this.isticket=true;
          this.affiche=true;

        }
        else this.api.showAlert(val.message)

      }).catch(err=>{
        this.api.dismissloadin();
        this.api.showAlert("Impossible de d'afficher les details du ticket")
      })
    }
  }
  acheter(){

    let url =  this.isticket==false? this.GblVariable.URL+"payedticket?token="+this.GblVariable.token+"&ticket="+this.GblVariable.codeticket :this.GblVariable.URL+"payedpanier?token=" + this.GblVariable.token + "&codepanier=" + this.GblVariable.codeticket;
    this.api.afficheloading();
    this.api.getpost(url).then(d=>{
      let val = JSON.parse(d.data)
      if(val.code=="0")
      {
        this.api.getpost(this.GblVariable.URL+"ticketconsultation?token="+this.GblVariable.token+"&nfcid=2181e5b5&voucherid=1").then(sdata=>{
          let solde = JSON.parse(sdata.data);
          if(solde.code=="0")
          {
            this.api.getpost(this.GblVariable.URL+"bilan?agentid="+this.GblVariable.agentid+"&jour=jour&mois=mois&annee=annee").then(dcash=>{
              let cash = JSON.parse(dcash.data);
              if(cash.code=="0" )
              {
                this.api.dismissloadin();
                this.GblVariable.solde = solde.montantRestant;
                this.GblVariable.cash = cash.montantRecu;
                if(this.isticket)
                  this.api.imprimerRecu(this.listeitems,this.totalb,this.totalk,true);
                else  this.api.imprimerRecu([],this.totalb,this.totalk,false,this.item);


                this.reload();
                this.api.showAlert("Achat effectuée avec succès");
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
      }
      else{
        this.api.dismissloadin();
        this.api.showError(val.message)

      }
    }).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Impossible de valider l'achat")
    })
  }
  reload(){
    this.prixkollere=""
    this.prixboutique=""
    this.affiche=false;
    this.listeitems=[];
    this.codeTicket=""
    this.totalk=0;
    this.totalb=0;
    this.item=""
  }
}
