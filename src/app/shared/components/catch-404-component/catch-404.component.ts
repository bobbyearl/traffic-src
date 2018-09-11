import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  StateService
} from '../../services';

@Component({
  selector: 'app-catch-404',
  templateUrl: './catch-404.component.html'
})
export class Catch404Component implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stateService: StateService
  ) {}

  public ngOnInit() {
    this.subscriptions.push(
      this.route
        .queryParams
        .subscribe(params => {
          if (params['to']) {
            this.router
              .navigateByUrl(params['to'])
              .then(() => {
                this.stateService.set(
                  JSON.parse(params['fragment'])
                );
              });
          }
        })
    );
  }

  public ngOnDestroy() {
    this.subscriptions
      .forEach((s: Subscription) => s.unsubscribe());
  }

}
