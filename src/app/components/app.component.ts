import { NgModule, Component, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';
import { SearchComponent } from './search.component.ts';
import { FormsModule } from '@angular/forms';
// Use the filesystem API from nodeJS
import fs = require('fs');


@Component({
  selector: 'app',
  templateUrl: './app/views/app.component.html'
})

export class AppComponent {
  remote: any = require('electron').remote
  filePath: string = `${this.remote.getGlobal('appPath')}`;
  fileCreated : boolean = this.remote.getGlobal('configExists');
  login: any = {};

  constructor(private cdRef: ChangeDetectorRef) {
  }

  // Store the given user + pass into the config file
  storeFileContents(event) {
    event.preventDefault();
    let data =  `user: ${this.login.user}
    pass: ${this.login.pass}`;

    fs.writeFile(this.filePath, data, (err) => {
      if (err) {
        console.error('File creation failed');
      } else {
        this.fileCreated = true;
        this.resizeWindow();
        this.cdRef.detectChanges();
      }
    });
  }

  resizeWindow() {
    let window = this.remote.getCurrentWindow();
    window.setSize(800, 200);
  }

}

// Following is needed to actually instantiate the application
@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ AppComponent, SearchComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
