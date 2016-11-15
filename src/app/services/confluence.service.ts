import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

//Required for file reading
import fs = require('fs');

@Injectable()
export class ConfluenceService {

  private confluenceUrl = 'https://themis.atlassian.net/wiki/rest/api/search';
  private header = new Headers();
  private filePath: string = require('electron').remote.getGlobal('appPath');

  constructor(private http: Http) {
    this.header.append('Authorization', `Basic ${window.btoa('')}`);
    this.getCredentials();
  }

  /**
     Searches the themis wiki (i.e. Confluence) based on the
     search term.
  */
  search(params: string): Observable<string[]> {
    let options = new RequestOptions({ headers: this.header});
    let requestString = `cql=text~${params} AND type=page`;
    return this.http.get(`${this.confluenceUrl}?${requestString}`, options)
      .map(this.getData)
      .catch(this.handleError);
  }

  /**
     Searches the themis wiki (i.e. Confluence) base on the
     search term, but for titles only
  */
  titleSearch(params: string): Observable<string[]> {
    let options = new RequestOptions({ headers: this.header});
    let requestString = `cql=title~${params} AND type=page`;
    return this.http.get(`${this.confluenceUrl}?${requestString}`, options)
      .map(this.getData)
      .catch(this.handleError);
  }

  /**
  * Get the credentials of the user
  */
  private getCredentials() {
    let modifiedData = [];
    fs.readFile(this.filePath, 'utf8', (err, data) => {
      if (err) {
        console.error("File not created");
      }
      // Clean up the data a bit
      modifiedData = data.split('\n');
      modifiedData = modifiedData.map((item) => {
        return item.trim();
      });
    });
  }

  private getData(resp: Response) {
    let body = resp.json();
    return body.results || [];
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }
}
