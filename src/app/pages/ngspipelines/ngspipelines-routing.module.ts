import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NgspipelinesComponent} from './ngspipelines.component';
import {AlasscaComponent} from './alassca/alassca.component';
import {LiqbioComponent} from './liqbio/liqbio.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [{
  path: '',
  component: NgspipelinesComponent,
  children: [{
    path: 'alassca',
    component: AlasscaComponent,
   },
   {
     path: 'liqbio',
     component: LiqbioComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes),
    HttpClientModule,
  ],
  exports: [RouterModule],
})
export class NgspipelinesRoutingModule { }

export const routedComponents = [
  NgspipelinesComponent,
  AlasscaComponent,
  LiqbioComponent,
];
