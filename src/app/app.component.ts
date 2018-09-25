import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {TicketPage} from "../pages/ticket/ticket";
import {CartePage} from "../pages/carte/carte";
import {HistoriquePage} from "../pages/historique/historique";
import {AnnulationPage} from "../pages/annulation/annulation";
import {DeconnexionPage} from "../pages/deconnexion/deconnexion";
import {LoginPage} from "../pages/login/login";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  menus=[{titre:'Acceuil',component:HomePage,nom:'home' },{titre:'Ticket',component:TicketPage,nom:'cart'},
    {titre:'Carte',component:CartePage,nom:'card' },{titre:'Historique',component:HistoriquePage,nom:'clock' },
    {titre:'Inscription',component:AnnulationPage,nom:'ios-paper-outline'},{titre:'Deconnexion',component:DeconnexionPage,nom:'log-out'}
   ]

  constructor(platform: Platform, statusBar: StatusBar) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide();
    });
  }
  onPage(m){
/*    console.log(m.titre);
    this.rootPage=m.component;*/
    if(m.component==DeconnexionPage)
    {
      this.nav.setRoot(LoginPage);
    }
    else  this.nav.push(m.component)
  }
}

