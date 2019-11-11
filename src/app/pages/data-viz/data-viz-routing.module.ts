import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataVizComponent } from './data-viz.component';
import { FrankenplotComponent} from './frankenplot/frankenplot.component';


const routes: Routes = [{
  path: '',
  component: DataVizComponent,
  children: [{
    path: '',
    component: FrankenplotComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataVizRoutingModule {}

export const routedComponents = [
  FrankenplotComponent,
  DataVizComponent,
];


