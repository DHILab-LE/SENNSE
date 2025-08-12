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

@Component({
  selector: 'tb-features',
  standalone: false,
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  features = [
    {
      icon: '🌡️',
      title: 'Environmental Monitoring',
      description: 'Real-time tracking of temperature, humidity, and air quality to preserve artifacts and structures.'
    },
    {
      icon: '🔒',
      title: 'Security & Access Control',
      description: 'Smart surveillance systems and controlled access to protect valuable cultural assets.'
    },
    {
      icon: '📊',
      title: 'Data Analytics',
      description: 'Advanced analytics to understand visitor patterns and optimize heritage site management.'
    },
    {
      icon: '📱',
      title: 'Mobile Integration',
      description: 'Interactive mobile experiences for visitors with AR/VR cultural storytelling.'
    },
    {
      icon: '⚡',
      title: 'Energy Management',
      description: 'Smart energy solutions to reduce costs while maintaining optimal preservation conditions.'
    },
    {
      icon: '🌐',
      title: 'Global Connectivity',
      description: 'Connect heritage sites worldwide for knowledge sharing and collaborative preservation.'
    }
  ];
}
