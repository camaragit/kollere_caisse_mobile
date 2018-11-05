import { Injectable } from '@angular/core';

@Injectable()
export class  GlobalVariableProvider {
/*  public URL1 ="http://services.ajit.sn/ws/parti/";
  public URL ="http://ajit.sn/parti/ws/";*/
  public URL ="http://services.ajit.sn/ws/resto/";
  public cash ="";
  public boutique=""
  public solde=""
  public token=""
  public agentid=""
  public codepanier;
  public codeticket="";
  public statusImpriamte:boolean=false;
  public notfound:boolean=false;
  public listeImprimantes:any;
  public message:any;
  public liaisonreussie:boolean=false;
  public  ImprimanteAutorisee = ['MPT','MTP','SPP-R','P25','InnerPrinter','WizarPOS_Printer'];
  public urlsave = "http://212.71.244.7:8080/kollere/save";



}
