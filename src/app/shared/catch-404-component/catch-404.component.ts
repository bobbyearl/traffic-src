import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

@Component({
  selector: 'be-catch-404',
  templateUrl: './catch-404.component.html'
})
export class Catch404Component implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['to']) {
        this.router.navigateByUrl(params['to']);
      }
    });
  }

}
