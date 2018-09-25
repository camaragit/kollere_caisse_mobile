import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";
import {NFC} from "@ionic-native/nfc";
import {HomePage} from "../home/home";

/**
 * Generated class for the CartePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-carte',
  templateUrl: 'carte.html',
})
export class CartePage {

famille:any;
familles:any;
produit:any;
produits:any;
quantite:any;
listeitems : Array<{item: string,quantite:string,prixkollere:string,prixboutique:string,id:number}>=[];
prixboutique:any;
prixkollere:any;
prixunitk:any;
prixunitb:any;
id:number=0;
tabvalid:boolean=false;
columns:any;
idnfc:any="";
totalb:number;
totalk:number;
  tablestyle = 'bootstrap';
  constructor(public navCtrl: NavController, private api:ApiProvider,private GblVariable:GlobalVariableProvider,private nfc:NFC) {

    this.reload();
    this.nfc.addTagDiscoveredListener(() => {
    }, (err) => {
      this.api.showError("Impossible de lire la carte: "+err)
    }).subscribe((event) => {
      //alert('received ndef message. the tag contains: '+ event.tag);
      //alert('decoded tag id'+ this.nfc.bytesToHexString(event.tag.id));
      this.api.showToast("L'id de la carte est recuperé avec succès .")
      this.idnfc=event.tag.id;

    })

  }
  reload(){
    this.famille="";
    this.produit="";
    this.quantite="";
    this.GblVariable.codepanier=0;
    this.GblVariable.codeticket="";
    this.listeitems=[];
    this.totalb=0;
    this.totalk=0;
    this.tabvalid=false;
    this.idnfc="";

  }
  supprimer(lst){
    let url = this.GblVariable.URL+"editingpanier?commerce="+encodeURI(this.GblVariable.boutique)+"&panier="+this.GblVariable.codeticket;
    url+="&item="+encodeURI(lst.item)+"&quantite=0";
    this.api.afficheloading();
    this.api.getpost(url).then(data=>{
      this.api.dismissloadin();
      let val = JSON.parse(data.data);
      if(val.code=="0")
      {
        let i=0;
        while(i<this.listeitems.length && this.listeitems[i].id!=lst.id)
          i++;
        this.listeitems.splice(i,1);
        if(this.listeitems.length==0)
          this.tabvalid=false;
        this.totalb=0;
        this.totalk=0;
        for(let i=0;i<this.listeitems.length;i++)
        {
          this.totalb+= +this.listeitems[i].prixboutique;
          this.totalk+= +this.listeitems[i].prixkollere;
        }
      }
      else this.api.showError(val.message)

    }).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Impossible de supprimer l'item du panier")
    })
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CartePage');
    this.api.afficheloading();
    this.api.getpost(this.GblVariable.URL+"listfamillescommerce?commerce="+encodeURI(this.GblVariable.boutique)).then(data=>{
      this.api.dismissloadin();
      this.familles =JSON.parse(data.data)

    }).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Impossoble de charger la liste des familles")
    })

  }
  selectionFamille(){
    this.api.afficheloading();
    this.api.getpost(this.GblVariable.URL+"listitemsfamillecommerce?famille="+encodeURI(this.famille)+"&commerce="+encodeURI(this.GblVariable.boutique)).then(
      data=>{
        this.api.dismissloadin();
        this.produits = JSON.parse(data.data)
      }
    ).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Impossible de recuperer la liste des items de la famille")
    })
  }
  ajouter(){
  this.api.afficheloading();
  let url =this.GblVariable.URL+"loadingpanier?commerce="+encodeURI(this.GblVariable.boutique)+"&panier="+ this.GblVariable.codepanier+"&item="+encodeURI(this.produit);
    url+="&prixresto="+this.prixboutique+"&prixkollere="+this.prixkollere+"&quantite="+this.quantite
  this.api.getpost(url).then(data=>{
    let val = JSON.parse(data.data);
    this.api.dismissloadin()
    if(val.code=="0"){
      console.log('Code panier avant '+this.GblVariable.codepanier)
      this.GblVariable.codepanier = val.panierid;
      console.log('Code panier apres '+this.GblVariable.codepanier)

      this.GblVariable.codeticket = val.codepanier;
      this.listeitems.push({item:this.produit,quantite:this.quantite,prixkollere:this.prixkollere,prixboutique:this.prixboutique,id:this.id++});

      if(this.listeitems.length>0)
      {
        this.tabvalid=true;
        this.totalb=0;
        this.totalk=0;
        for(let i=0;i<this.listeitems.length;i++)
        {
          this.totalb+= +this.listeitems[i].prixboutique;
          this.totalk+= +this.listeitems[i].prixkollere;
        }
        console.log(JSON.stringify(this.listeitems))
      }

    }
    else this.api.showError(val.message)
  }).catch(err=>{
    this.api.dismissloadin();
    this.api.showError("Impossible d'ajouter au panier")
  })

  }
  selectionquantite(){
    this.prixboutique = this.prixunitb*this.quantite;
    this.prixkollere = this.prixunitk*this.quantite;
  }

  selectionProduit(){
    this.api.afficheloading();
    this.api.getpost(this.GblVariable.URL+"tarifsrestoitem?item="+this.produit+"&commerce="+encodeURI(this.GblVariable.boutique)).then(data=>{
      this.api.dismissloadin();
      let val = JSON.parse(data.data)
      for(let i=0;i<val.length;i++)
      {
        if(val[i].item!=""){
          this.prixunitb = val[i].valeurItem.prixResto;
          this.prixunitk = val[i].valeurItem.prixKollere;
          this.prixkollere = this.prixunitb
          this.prixboutique = this.prixunitk
          this.quantite =1;
        }
      }

    }).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Impossible de charger les prix ")
    })
  }
  acheter(){
    if(this.idnfc==""){
      this.api.showError("Veuillez approcher une carte d'abord ")
    }
    else{
      this.api.afficheloading();
          let url = this.GblVariable.URL+"ticketachatpanier?token="+this.GblVariable.token+"&nfcid="+encodeURI(this.idnfc)+"&codepanier="+this.GblVariable.codeticket;
          this.api.getpost(url).then(data=>{
            let val = JSON.parse(data.data);
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
                      this.api.imprimerRecu(this.listeitems,this.totalb,this.totalk,true);
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
            this.api.showError("Impossible d'effectuer l'achat")
          })

    }
      }


}
