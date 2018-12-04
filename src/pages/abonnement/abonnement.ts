import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalVariableProvider} from "../../providers/gloabal-variable/gloabal-variable";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the AbonnementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-abonnement',
  templateUrl: 'abonnement.html',
})
export class AbonnementPage {
  phoneinvalid:any;
  datauser : FormGroup;
  private  tarifs =[
    {duree:10,montant:1000},
   // {duree:15,montant:1500},
    //{duree:20,montant:2000},
    //{duree:25,montant:2500},
    {duree:30,montant:2500}
  ]
  constructor(private api:ApiProvider,private GblVariable:GlobalVariableProvider,public navCtrl: NavController, public navParams: NavParams,private formbuilder:FormBuilder) {
    this.datauser = this.formbuilder.group({
      telephone: ['', Validators.required],
      montant: ['', Validators.required],
      duree: ['', Validators.required],
    });
  }
  selectionDuree(){
    console.log(this.datauser.controls['duree'].value)
    let i=0;
    while(this.tarifs[i].duree!=this.datauser.controls['duree'].value && i<this.tarifs.length)
    i++;
    this.datauser.controls['montant'].setValue(this.tarifs[i].montant)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbonnementPage');
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
  valider(){
    let url=this.GblVariable.URL+"recharge?numtel="+this.datauser.controls['telephone'].value+"&montant=";
    url+=this.datauser.controls['montant'].value+"&validite="+this.datauser.controls['duree'].value;
    this.api.afficheloading();
    this.api.getpost(url).then(data=>{
      this.api.dismissloadin();
      let val = JSON.parse(data.data)
      if(val.code=="0")
      {
        this.datauser.reset();
        this.api.showAlert(val.message)

      }else this.api.showError(val.message)

    }).catch(err=>{
      this.api.dismissloadin();
      this.api.showError("Operation impossible")
    })
  }



}
