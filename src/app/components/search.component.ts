import { Component, ChangeDetectorRef } from '@angular/core';
import { ConfluenceService } from '../services/confluence.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/retry'

@Component({
  selector: 'search',
  templateUrl: './app/views/search.component.html',
  providers: [ConfluenceService]
})

export class SearchComponent {
  results: string[];

  private searchTermStream = new Subject<string>();

  searchConfluence(term : string) {
    // Send the search term into the Observable stream
    if (term != '') {
      this.searchTermStream.next(term);
    } else {
      this.results = [];
    }
  }

  constructor(private confService: ConfluenceService, private cdRef: ChangeDetectorRef) {
    // There isn't a good way to get around this issue, but Electron doesn't
    // update the view when the observable changes, so we have to force it
    // by calling detectChanges(). Hopefully this can be fixed and we can
    // avoid the unnecessary subscribe calls here.
    // Another bug exists here; if the server errors out, there is no way
    // to recreate the subscription; the other alternative was to fire
    // a request EVERYTIME our search term changed, which causes too many
    // requests, so it was deemed unacceptable. To solve this, we infinitely
    // retry.
    this.searchTermStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((term: string) => this.confService.titleSearch(term))
      .retry()
      .subscribe((item) => {
        this.results = item;
        this.cdRef.detectChanges();
      });
  }
}
