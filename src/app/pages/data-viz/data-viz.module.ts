import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DataVizRoutingModule, routedComponents} from './data-viz-routing.module';
import {NbDialogModule} from '@nebular/theme';
import {ShowcaseDialogComponent} from '../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
// import { ImageViewerModule } from 'ng2-image-viewer';
import { ImageViewerModule } from 'ngx-image-viewer';
PlotlyModule.plotlyjs = PlotlyJS;

// Variants Table
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableModule } from 'ngx-easy-table';

@NgModule({
  declarations: [
    ...routedComponents,
    ShowcaseDialogComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    PlotlyModule,
    DataVizRoutingModule,
    SelectDropDownModule,
    NbDialogModule.forChild(),
    // ImageViewerModule,
    ImageViewerModule.forRoot(),
    Ng2SmartTableModule,
    TableModule,
  ],
  entryComponents: [
    ShowcaseDialogComponent,
  ],
})
export class DataVizModule { }
