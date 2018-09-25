import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  "rxjs/add/operator/map";

/*
  Generated class for the WebserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WebserviceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello WebserviceProvider Provider');
  }

  callWebservice(url :string)
  {
    console.log("Donnees envoyées ")
    return new Promise((resolve, reject) => {
      this.http.post(url,{},{})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });  }


}
