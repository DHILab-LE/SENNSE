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

import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tb-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LandingComponent implements AfterViewInit{
  @ViewChild('heroSection', { read: ElementRef }) heroSectionRef!: ElementRef;
  @ViewChild('featuresSection', { read: ElementRef }) featuresSectionRef!: ElementRef;
  @ViewChild('aboutSection', { read: ElementRef }) aboutSectionRef: ElementRef;
  @ViewChild('servicesSection', { read: ElementRef }) servicesSectionRef!: ElementRef;
  @ViewChild('contactSection', { read: ElementRef }) contactSectionRef!: ElementRef;


    ngAfterViewInit() {
    // Listen for custom event emitted from header component
    this.listenToScrollEvents();
  }

    listenToScrollEvents() {
    const host = (this as any).el.nativeElement || window;
    host.addEventListener('scrollToSection', (event: any) => {
      const section = event.detail;
      switch (section) {
        case 'hero':
          this.heroSectionRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'features':
          this.featuresSectionRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'about':
          this.aboutSectionRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'services':
          this.servicesSectionRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'contact':
          this.contactSectionRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
          break;
      }
    });
  }

  constructor(private el: ElementRef) {}


}
