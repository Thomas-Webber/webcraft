import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoxPickerComponent } from './box-picker/box-picker.component';
import { BoxItemComponent } from './box-picker/box-item/box-item.component';
import { BlockerComponent } from './blocker/blocker.component';
import { ReticleComponent } from './reticle/reticle.component';
import {AreaLoaderService} from './services/area-loader.service';
import {HttpClientModule} from '@angular/common/http';
import {BlockService} from './services/block.service';

@NgModule({
  declarations: [
    AppComponent,
    BoxPickerComponent,
    BoxItemComponent,
    BlockerComponent,
    ReticleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    BlockService,
    AreaLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
