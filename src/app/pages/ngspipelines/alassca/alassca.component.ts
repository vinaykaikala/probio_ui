import { Component, OnInit } from '@angular/core';
import { AlasccaServiceService} from '../service/alascca-service.service';

@Component({
  selector: 'ngx-alassca',
  templateUrl: './alassca.component.html',
  styleUrls: ['./alassca.component.scss'],
})
export class AlasscaComponent implements OnInit {

  constructor(public alasscaService: AlasccaServiceService) { }

  ngOnInit() {
    this.alasscaService.getAlasscaSamples().subscribe(data => {
      console.log(data);
    }, error => {
      alert(error);
      });
  }

}
