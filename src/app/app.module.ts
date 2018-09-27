import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, Injectable, Injector, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {TicketPage} from "../pages/ticket/ticket";
import {LoginPage} from "../pages/login/login";
import {CartePage} from "../pages/carte/carte";
import {DeconnexionPage} from "../pages/deconnexion/deconnexion";
import {HistoriquePage} from "../pages/historique/historique";
import {ApiProvider} from "../providers/api/api";
import {GlobalVariableProvider} from "../providers/gloabal-variable/gloabal-variable";
import {HTTP} from "@ionic-native/http";
import {IonicStorageModule} from "@ionic/storage";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {BluetoothSerial} from "@ionic-native/bluetooth-serial";
import {ImprimantePage} from "../pages/imprimante/imprimante";
import {NFC} from "@ionic-native/nfc";
import {Toast} from "@ionic-native/toast";
import {InscriptionPage} from "../pages/inscription/inscription";
import {Pro} from "@ionic/pro";
Pro.init('6a13eeda', {
  appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TicketPage,
    LoginPage,
    CartePage,
    DeconnexionPage,
    HistoriquePage,
    InscriptionPage,ImprimantePage
  ],
  imports: [
    IonicModule.forRoot(MyApp,{monthNames: ['Janvier', 'Février', 'Mars','Avril','Mai','Juin','Juillet',
        'Août','Septembre','Octobre','Novembre','Décembre' ],
      dayNames: ['Dimanche', 'Lundi', 'Mardi','Mercredi','Jeudi','Vendredi','Samedi' ]}),
    BrowserModule,IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),NgxDatatableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TicketPage,
    LoginPage,
    CartePage,
    DeconnexionPage,
    HistoriquePage,
    InscriptionPage,ImprimantePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,GlobalVariableProvider,HTTP,BluetoothSerial,NFC,Toast,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  ]
})
export class AppModule {}
