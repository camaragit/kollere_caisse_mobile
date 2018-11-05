import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NFC} from "@ionic-native/nfc";
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the InscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html',
})


export class InscriptionPage {
  datauser : FormGroup;
  phoneinvalid:any
  constructor(private GblVariable:GlobalVariableProvider,private api:ApiProvider,public navCtrl: NavController, public navParams: NavParams,private nfc:NFC,private formbuilder:FormBuilder,) {
    this.datauser = this.formbuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', Validators.required],
      idnfc: ['',Validators.required],
      genre:['',Validators.required],
      profession:['',Validators.required],

    });

    this.nfc.addTagDiscoveredListener(() => {
    }, (err) => {
      this.api.showError("Impossible de lire la carte: "+err)
    }).subscribe((event) => {
      //alert('received ndef message. the tag contains: '+ event.tag);
      //alert('decoded tag id'+ this.nfc.bytesToHexString(event.tag.id));
      this.api.showToast("L'id de la carte est recuperé avec succès .");
      this.datauser.controls['idnfc'].setValue(this.nfc.bytesToHexString(event.tag.id).toUpperCase());

    })

  }
  veriftel()
  {
    let suffix =  this.datauser.controls['telephone'].value.substring(0,2);
    let tabsuffix =['77','70','76','78'];
    this.phoneinvalid = (tabsuffix.indexOf(suffix)===-1 || this.datauser.controls['telephone'].value.length!==9)  ? true :false;

  }
  resetphone(){
    this.phoneinvalid = false;
  }

  inscrire(){

    let url=this.GblVariable.URL+"inscription?nfcid="+this.datauser.controls['idnfc'].value+"&nom="+encodeURI(this.datauser.controls['nom'].value);
    url+="&prenom="+encodeURI(this.datauser.controls['prenom'].value)+"&email="+this.datauser.controls['email'].value;
    url+="&numtel="+this.datauser.controls['telephone'].value+"&genre="+this.datauser.controls['genre'].value+"&age="+this.datauser.controls['age'].value
    url+="&quartier="+this.datauser.controls['adresse'].value+"&profession="+this.datauser.controls['profession'].value;

    this.api.afficheloading();
    this.api.getpost(url).then(data=>{
      this.api.dismissloadin();
      let val = JSON.parse(data.data)
      if(val.code=="0")
      {
        this.api.getpost(this.GblVariable.urlsave,{nfcid:this.datauser.controls['idnfc'].value,nom:this.datauser.controls['nom'].value,prenom:this.datauser.controls['prenom'].value,telephone:this.datauser.controls['telephone'].value,email:this.datauser.controls['email'].value}).then(res=>{}).catch(err=>{});
        this.datauser.reset();
        this.api.showAlert("Inscription effectuée avec succes")

      }else this.api.showError(val.message)

    }).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Impossible d'effectuer l'insccription")
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionPage');
  }

}
