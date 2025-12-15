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

import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AppState } from "@core/core.state";

import cytoscape from "cytoscape";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { Renderer2 } from "@angular/core";
import { ThingsBoardService } from "./thingsboard.service";

@Component({
  selector: "tb-new-network",
  templateUrl: "./new-network.component.html",
  styleUrls: ["./new-network.component.scss"],
})
export class NewNetworkComponent implements OnInit {
  wsnName: string = "";
  boards: any[] = [];
  boardsListDiv: any;
  emailAddress: string = "";
  emailSectionVisible: boolean = false; // Flag to control the display of the email section
  emailError: boolean = false;

  telemetryCategories: Record<string, string[]> = {
    "Soil Monitoring": ["Soil Moisture", "Soil Temperature", "Humidity"],
    "Weather and Microclimate Monitoring": [
      "Temperature",
      "Air pollution",
      "VOC",
      "Atmospheric pressure",
      "Wind speed",
      "Gas",
      "Light intensity",
      "Light Intensity (Indoor)",
      "Sunlight exposure",
      "UV index",
    ],
    Construction: ["Vibration", "Cracks", "Wall inclination"],
    Miscellaneous: ["Pest monitoring", "Noise level"],
    "Pond and lakes (Marine)": [
      "Temperature Water",
      "Electrical conductivity of water",
      "Water pH",
      "Dissolved oxygen in water",
      "Water quality",
      "Water level (lakes)",
      "Flow of streams",
    ],
  };

  constructor(
    private store: Store<AppState>,
    private renderer: Renderer2,
    private tbService: ThingsBoardService
  ) { }

  ngOnInit(): void {
    const jwtToken = localStorage.getItem("jwt_token");
    this.wsnName = this.decodeJWT(jwtToken) || "";
  }

  decodeJWT(token: string | null): string | null {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.sub;
  }

  addNewBoard(): void {
    const boardId = `board-${this.boards.length + 1}`;
    const newBoard = {
      id: boardId,
      name: "",
      deviceId: "",
      selectedTelemetry: [],
      sensors: [],
      accessToken: null,
    };
    this.boards.push(newBoard);
  }

  addSensorDropdown(board: any): void {
    board.sensors.push({
      name: "",
      category: "",
      key: null,
    });
  }

  deleteSensor(board: any, index: number): void {
    board.sensors.splice(index, 1);
    this.updateSelectedTelemetryList(board);
  }

  updateSelectedTelemetryList(board: any): void {
    // Iterate through each sensor in the board
    board.sensors.forEach((sensor: any, i: number) => {
      const selectElement = document.getElementById(
        `sensorList-${board.id}-${i}`
      ) as HTMLSelectElement;

      if (selectElement) {
        const category = Object.keys(this.telemetryCategories).find((key) =>
          this.telemetryCategories[key].includes(sensor.name)
        );
        if (category) {
          // Update the displayed text in the dropdown for the selected option
          const selectedOption =
            selectElement.options[selectElement.selectedIndex];
          if (selectedOption) {
            this.renderer.setProperty(
              selectedOption,
              "text",
              `${category} - ${sensor.name}`
            );
            return category ? `${category} - ${sensor.name}` : sensor.name;
          }
        }
      }
    });
    board.selectedTelemetry = board.sensors.map((sensor: any) => {
      const category = Object.keys(this.telemetryCategories).find((key) =>
        this.telemetryCategories[key].includes(sensor.name)
      );
      // Return "category.key - telemetry" if category exists, otherwise just telemetry
      return category ? sensor.name : sensor.name;
    });
  }

  deleteBoard(boardId: string): void {
    this.boards = this.boards.filter((board) => board.id !== boardId);
  }

  validateForm(): boolean {
    let isValid = true;

    if (!this.wsnName.trim()) {
      alert("WSN Name is required.");
      return false;
    }

    this.boards.forEach((board) => {
      const boardName = document.getElementById(`${board.id}-name`);
      if (!boardName || board.sensors.length === 0) {
        alert(
          `Please fill out all details and select at least one telemetry for ${board.id}.`
        );
        isValid = false;
      }
    });

    return isValid;
  }

  validateAndCreateGraph(): void {
    // Call validateForm to ensure all required fields are filled
    const isValid = this.validateForm();

    if (isValid) {
      // If validation passes, create the graph
      this.createCytoscapeGraph();
      alert("Form is valid! Network data has been added to the graph.");
    }
  }

  createCytoscapeGraph(): void {
    const elements: any[] = [];

    // Add the WSN node
    elements.push({ data: { id: "wsn", label: this.wsnName } });

    // Loop through all boards to create nodes and edges
    this.boards.forEach((board) => {
      // Add the board node
      elements.push({ data: { id: board.id, label: board.name } });

      // Add an edge from the WSN node to the board node
      elements.push({ data: { source: "wsn", target: board.id } });

      // Add nodes and edges for each sensor on the board
      board.sensors.forEach((sensor: any, index: number) => {
        const sensorId = `${board.id}-sensor-${index}`; // Unique ID for each sensor

        // Add the sensor node
        elements.push({ data: { id: sensorId, label: sensor.name } });

        // Add an edge from the board node to the sensor node
        elements.push({ data: { source: board.id, target: sensorId } });
      });
    });

    // Create the Cytoscape instance with all elements
    cytoscape({
      container: document.getElementById("cy"),
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            content: "data(label)",
            "background-color": "#6FA3EF",
            color: "black",
            "border-width": 2,
            "border-color": "#1F3C72",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#ccc",
          },
        },
      ],
      layout: { name: "breadthfirst", directed: true, padding: 10 },
    });
  }

  toggleFullscreen(): void {
    const cyContainer = document.getElementById("cy");
    if (!document.fullscreenElement) {
      cyContainer
        ?.requestFullscreen()
        .catch((err) => console.error("Error enabling fullscreen:", err));
    } else {
      document.exitFullscreen();
    }
  }

  //

  validateInputs(): boolean {
    let isValid = true;
    if (!this.wsnName) {
      alert("WSN Name is required.");
      isValid = false;
    }
    this.boards.forEach((board) => {
      if (!board.name || board.selectedTelemetry.length === 0) {
        alert(
          `Please fill out all details and select at least one telemetry for ${board.id}`
        );
        isValid = false;
      }
    });
    return isValid;
  }

  getInitials(str: string): string {
    return str
      .replace(/\([^)]*\)/g, "") // Remove text inside parentheses, including the parentheses
      .trim() // Trim any extra spaces left after removing parentheses
      .split(" ") // Split the string into an array by spaces
      .filter((word) => word) // Filter out any empty strings caused by multiple spaces
      .map((word) => word.charAt(0).toUpperCase()) // Take the first letter of each word and convert to uppercase
      .join(""); // Join the letters without spaces
  }

  async addToTBDevice() {
    let isValid = this.validateInputs();
    if (isValid) {
      this.boardsListDiv = document.getElementById("boards-list");
      this.boardsListDiv.innerHTML = "";
      if (this.boards.length === 0) {
        this.boardsListDiv.innerHTML =
          '<p class="text-gray-500 text-sm">No boards to display.</p>';
      } else {
        try {
          for (const board of this.boards) {
            const { id, name, selectedTelemetry } = board;
            // Create device
            const deviceData = await this.tbService
              .createDevice(name)
              .toPromise();
            const deviceId = deviceData.id.id;
            // Get credentials
            const credentials = await this.tbService
              .getDeviceCredentials(deviceId)
              .toPromise();
            console.log("GetDeviceCredentials Result: ", credentials);

            board.accessToken = credentials.credentialsId;
            board.deviceId = credentials.deviceId.id;
            const telemetryKeys = new Map(); // Use Map to track occurrences of keys

            // Publish telemetry
            for (const telemetry of selectedTelemetry) {
              const baseKey = `${this.getInitials(telemetry)}_${name}`;
              let telemetryKey = baseKey;

              // Check for duplicates and append an incrementing number if necessary
              let count = telemetryKeys.get(baseKey) || 1; // Get current count or default to 0
              if (count > 1) {
                telemetryKey = `${this.getInitials(telemetry)}_${count}_${board.name
                  }`;
              }

              // Update the count in the map
              telemetryKeys.set(baseKey, count + 1);

              const telemetryData = {
                [telemetryKey]: telemetry,
              };
              await this.tbService
                .publishTelemetry(credentials.credentialsId, telemetryData)
                .toPromise();
            }
          }
          this.renderDeviceList();
          this.emailSectionVisible = true;
          alert("Form is valid! Sensor Network data has been added.");
        } catch (error) {
          alert("Not allow to have an existing Device Name!")
        }
      }
    }

    console.log(
      "Devices successfully created and telemetry published!",
      this.boards
    );
  }

  renderDeviceList() {
    // Display header
    const deviceListHeader = document.createElement("h4");
    deviceListHeader.className = "text-lg font-semibold text-gray-700 mb-4";
    deviceListHeader.textContent = "The Device List";
    this.boardsListDiv.appendChild(deviceListHeader);

    this.boards.forEach((board) => {
      console.log(board);
      console.log(`Board ID: ${board.id}, Access Token: ${board.accessToken}`);

      const boardDiv = document.createElement("div");
      boardDiv.className = "p-4 mb-2 rounded border bg-white shadow";

      // Board Name
      const boardNameEl = document.createElement("p");
      boardNameEl.className = "text-sm font-medium text-gray-700";
      boardNameEl.textContent = board.name || "Unnamed Device";
      boardDiv.appendChild(boardNameEl);

      // Access Token
      const tokenEl = document.createElement("p");
      tokenEl.className = "text-sm text-gray-600 mt-1";
      tokenEl.textContent = `Access Token: ${board.accessToken}`;
      boardDiv.appendChild(tokenEl);

      // Sensors List
      if (board.selectedTelemetry.length > 0) {
        const table = document.createElement("table");
        // Create table body
        table.className = "table-auto w-full text-sm text-gray-600 mt-2";

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const sensorNameHeader = document.createElement("th");
        sensorNameHeader.className =
          "px-4 py-2 text-left font-medium text-gray-700";
        sensorNameHeader.textContent = "Sensor Name";
        const sensorKeyHeader = document.createElement("th");
        sensorKeyHeader.className =
          "px-4 py-2 text-left font-medium text-gray-700";
        sensorKeyHeader.textContent = "Sensor Key";

        headerRow.appendChild(sensorNameHeader);
        headerRow.appendChild(sensorKeyHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        const telemetryKeys = new Map(); // Use Map to track occurrences of keys

        board.selectedTelemetry.forEach((sensor) => {
          const row = document.createElement("tr");

          // Construct the base key
          const baseKey = `${this.getInitials(sensor)}_${board.name}`;
          let telemetryKey = baseKey;

          // Check for duplicates and append an incrementing number if necessary
          let count = telemetryKeys.get(baseKey) || 1; // Get current count or default to 0
          if (count > 1) {
            telemetryKey = `${this.getInitials(sensor)}_${count}_${board.name}`;
          }

          // Update the count in the map
          telemetryKeys.set(baseKey, count + 1);

          // Sensor Name cell
          const sensorNameCell = document.createElement("td");
          sensorNameCell.className = "px-4 py-2 border";
          sensorNameCell.textContent = sensor;

          // Sensor Key cell
          const sensorKeyCell = document.createElement("td");
          sensorKeyCell.className = "px-4 py-2 border";
          sensorKeyCell.textContent = telemetryKey;

          row.appendChild(sensorNameCell);
          row.appendChild(sensorKeyCell);

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        boardDiv.appendChild(table);
      } else {
        const noSensorMsg = document.createElement("p");
        noSensorMsg.className = "text-sm text-gray-500";
        noSensorMsg.textContent = "No sensors selected.";
        boardDiv.appendChild(noSensorMsg);
      }

      this.boardsListDiv.appendChild(boardDiv);
    });
  }

  sendEmail() {
    if (!this.emailAddress || !this.validateEmail(this.emailAddress)) {
      this.emailError = true;
      return;
    }
    this.emailError = false;

    const bodyContent = this.constructBodyContent();

    const firstBoard = this.boards[0];
    if (!firstBoard) {
      console.error("No boards found.");
      return;
    }

    const payload = {
      emailTo: this.emailAddress,
      emailFrom: this.wsnName,
      body: bodyContent,
      deviceId: firstBoard.deviceId,
    };

    console.log("The device ID of the 1st Board: ", firstBoard.deviceId);

    this.tbService.sendEmailData(payload).subscribe(
      () => {
        alert("Email sent and telemetry updated successfully!");
      },
      (error) => {
        console.error(
          "Error while sending email and updating telemetry:",
          error
        );
        alert("An error occurred. Please try again.");
      }
    );
  }

  private constructBodyContent(): string {
    let bodyContent = `Dear Hardware Team,\n\nPlease find below the IoT device information received from the client for hardware preparation:\n\n`;

    this.boards.forEach((board) => {
      const boardName =
        (document.getElementById(`${board.id}-name`) as HTMLInputElement)
          ?.value || "Unnamed Device";
      bodyContent += `Board Name: ${boardName}\n`;

      if (board.selectedTelemetry.length > 0) {
        bodyContent += "Sensors:\n";

        const telemetryKeys = new Map<string, number>();

        board.selectedTelemetry.forEach((telemetry) => {
          const baseKey = `${this.getInitials(telemetry)}_${boardName}`;
          let telemetryKey = baseKey;

          let count = telemetryKeys.get(baseKey) || 1;
          if (count > 1) {
            telemetryKey = `${this.getInitials(
              telemetry
            )}_${count}_${boardName}`;
          }
          telemetryKeys.set(baseKey, count + 1);

          bodyContent += `    - Sensor: ${telemetry}, Key: ${telemetryKey}\n`;
        });
      } else {
        bodyContent += "    - No sensors selected.\n";
      }

      bodyContent += "\n";
    });

    bodyContent += `Please proceed with the necessary hardware preparations based on the information provided by the client. If you have any questions or require additional details, feel free to reach out.\n\nBest regards,\n\n`;

    return bodyContent;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async downloadBoardsListAsPDF() {
    const boardsListDiv = document.getElementById("boards-list");

    if (!boardsListDiv || boardsListDiv.innerHTML.trim() === "") {
      alert("No boards to download!");
      return;
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Bold font
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica); // Regular font

    const pageSize: [number, number] = [595.28, 841.89]; // Explicitly define as a tuple (A4 size)
    let page = pdfDoc.addPage(pageSize);
    const { width, height } = page.getSize();

    const margin = 50;
    let yPosition = height - margin; // Start from top
    const rowHeight = 20;
    const colWidths = [60, 200, 200]; // Adjust column widths
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);

    let pageIndex = 1; // Start page index

    // Draw title
    const drawTitle = () => {
      page.drawText("SENNSE ORDER", {
        x: width / 2 - 60,
        y: yPosition,
        size: 16,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      yPosition -= 40;
    };

    // Draw page number
    const drawPageNumber = () => {
      page.drawText(`Page ${pageIndex}`, {
        x: width / 2,
        y: 20,
        size: 10,
        font: helvetica,
        color: rgb(0, 0, 0),
        // align: "center",
      });
    };

    // Draw table headers
    const drawTableHeaders = () => {
      const headers = ["Sensor ID", "Sensor Name", "Sensor Key"];
      headers.forEach((header, idx) => {
        page.drawText(header, {
          x: margin + colWidths.slice(0, idx).reduce((a, b) => a + b, 0) + 5,
          y: yPosition - 15,
          size: 10,
          font: helveticaBold,
        });
      });

      // Draw borders for the headers
      page.drawRectangle({
        x: margin,
        y: yPosition - rowHeight,
        width: tableWidth,
        height: rowHeight,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });
      colWidths.forEach((_, idx) => {
        if (idx > 0) {
          const colX =
            margin + colWidths.slice(0, idx).reduce((a, b) => a + b, 0);
          page.drawLine({
            start: { x: colX, y: yPosition },
            end: { x: colX, y: yPosition - rowHeight },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
        }
      });
      yPosition -= rowHeight;
    };

    // Draw table rows
    const drawRow = (rowValues: string[]) => {
      rowValues.forEach((value, idx) => {
        page.drawText(value, {
          x: margin + colWidths.slice(0, idx).reduce((a, b) => a + b, 0) + 5,
          y: yPosition - 15,
          size: 10,
          font: helvetica,
        });
      });

      // Draw borders
      page.drawRectangle({
        x: margin,
        y: yPosition - rowHeight,
        width: tableWidth,
        height: rowHeight,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });
      colWidths.forEach((_, idx) => {
        if (idx > 0) {
          const colX =
            margin + colWidths.slice(0, idx).reduce((a, b) => a + b, 0);
          page.drawLine({
            start: { x: colX, y: yPosition },
            end: { x: colX, y: yPosition - rowHeight },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
        }
      });
      yPosition -= rowHeight;

      // Add a new page if space is insufficient
      if (yPosition < margin + 30) {
        drawPageNumber();
        page = pdfDoc.addPage(pageSize);
        yPosition = height - margin;
        pageIndex++;
      }
    };

    drawTitle();
    // Process each board
    Array.from(boardsListDiv.children).forEach((boardDiv) => {
      const boardNameElement = boardDiv.querySelector("p.text-sm.font-medium");
      const boardName = boardNameElement ? boardNameElement.textContent : null;
      const accessTokenElement = boardDiv.querySelector(
        "p.text-sm.text-gray-600"
      );
      const accessToken = accessTokenElement
        ? accessTokenElement.textContent
        : null;
      const tableRows = Array.from(
        boardDiv.querySelectorAll("table tbody tr")
      ).map((row, idx) => [
        (idx + 1).toString(), // Sensor ID
        row.children[0]?.textContent || "Unknown Sensor", // Sensor Name
        row.children[1]?.textContent || "Unknown Key", // Sensor Key
      ]);

      if (!boardName || !accessToken || tableRows.length === 0) return;

      // Add board name and access token
      page.drawText(`Board Name: ${boardName}`, {
        x: margin,
        y: yPosition - 10,
        size: 12,
        font: helvetica,
      });
      yPosition -= 20;

      page.drawText(`Access Token: ${accessToken}`, {
        x: margin,
        y: yPosition - 10,
        size: 10,
        font: helvetica,
      });
      yPosition -= 20;

      // Draw table headers
      drawTableHeaders();

      // Draw table rows
      tableRows.forEach((row) => drawRow(row));

      yPosition -= 10; // Add spacing between boards
    });

    drawPageNumber(); // Draw the page number for the last page

    // Serialize and download the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sennse-boards-list.pdf";
    link.click();
  }
}
