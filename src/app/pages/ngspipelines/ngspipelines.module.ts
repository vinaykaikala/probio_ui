import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NgspipelinesRoutingModule, routedComponents } from './ngspipelines-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [
    ...routedComponents,
    ],
  imports: [
    CommonModule,
    NgspipelinesRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
  ],
})
export class NgspipelinesModule { }
