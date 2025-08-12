///
/// Copyright © 2016-2025 ${ISPC Lecce | CNR}
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { HeaderComponent } from './modules/header/header.component';
import { HeroComponent } from './modules/hero/hero.component';
import { FeaturesComponent } from './modules/features/features.component';
import { AboutComponent } from './modules/about/about.component';
import { ServicesComponent } from './modules/services/services.component';
import { ContactComponent } from './modules/contact/contact.component';
import { FooterComponent } from './modules/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LandingComponent } from './landing.component';


@NgModule({
  declarations: [
    LandingComponent,
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    AboutComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    LandingRoutingModule
  ],
  providers: [],
  bootstrap: [LandingComponent]
})
export class LandingModule { }
