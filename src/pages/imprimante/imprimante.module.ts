import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImprimantePage } from './imprimante';

@NgModule({
  declarations: [
    ImprimantePage,
  ],
  imports: [
    IonicPageModule.forChild(ImprimantePage),
  ],
})
export class ImprimantePageModule {}
