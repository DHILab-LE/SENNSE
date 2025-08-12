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

// Declare the global Swal from the CDN
declare let Swal: any;

@Component({
  selector: 'tb-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    organization: '',
    message: ''
  };

  submitForm() {
    // Handle form submission here
    console.log('Form submitted:', this.formData);
    if (!this.formData.email && !this.formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You must to put an valid email and your P.O.V !!'
      });
    }
    else {
      Swal.fire({
        title: 'Message Sent!',
        text: `Thank you, ${this.formData.name || this.formData.email}. We will contact you soon.`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      organization: '',
      message: ''
    };
  }
}
