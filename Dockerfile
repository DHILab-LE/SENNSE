#
# Copyright © 2016-2025 ${ISPC Lecce | CNR}
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Use the official ThingsBoard image from the Docker hub
FROM thingsboard/tb-postgres:3.7.0

# Replace default banner
COPY application/src/main/resources/banner.txt /usr/share/thingsboard/conf/banner.txt
COPY application/src/main/resources/templates/* /usr/share/thingsboard/conf/templates/
COPY application/src/main/resources/i18n/messages.properties /usr/share/thingsboard/conf/i18n/messages.properties

# Copy the new artifact file into the Docker Image ThingsBoard installation repository
COPY application/target/thingsboard-3.7.0-boot.jar /usr/share/thingsboard/bin/thingsboard.jar