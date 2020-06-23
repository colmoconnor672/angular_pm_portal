import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { NumberCardChartComponent } from './number-card-chart/number-card-chart.component';
import { HorizontalBarChartComponent } from './horizontal-bar-chart/horizontal-bar-chart.component';
import { StackedVerticalBarChartComponent } from './stacked-vertical-bar-chart/stacked-vertical-bar-chart.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDatepickerModule } from '@angular/material';

const analysisRoutes: Routes = [
  { path: '', component: AnalysisComponent,
    children : [
      { path: 'number-card-chart', component: NumberCardChartComponent },
      { path: 'horizontal-bar-chart', component: HorizontalBarChartComponent },
      { path: 'stacked-vertical-bar-chart', component: StackedVerticalBarChartComponent },
    ] 
  }
];

@NgModule({
  declarations: [    
    AnalysisComponent,
    NumberCardChartComponent,
    HorizontalBarChartComponent,
    StackedVerticalBarChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(analysisRoutes),
    NgxChartsModule,
    MatDatepickerModule
  ],
  exports: [RouterModule]
})
export class AnalysisModule { }
