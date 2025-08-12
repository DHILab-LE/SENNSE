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

import { Component } from '@angular/core';
import { Router } from '@angular/router';

declare let Swal: any;

@Component({
  selector: 'tb-hero',
  standalone: false,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {

  constructor(private router: Router) { }

  goToLoginPage() {
    this.router.navigateByUrl(`login`);
  }

  watchDemoButton() {
    Swal.fire({
      title: 'SENNSE - IoT Driven Platform',
      html: `
    <iframe width="100%" height="315" 
      src="https://www.youtube.com/embed/ItN5Z90iit0" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `,
      width: 700,
      padding: '1em',
      showCloseButton: true,
      showConfirmButton: false,
    });

  }

}
