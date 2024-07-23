# Quick Device Checker

## Description/Objective
Quick Device Checker is a tool designed to automate and format the display of Android system properties on development devices. The primary aim is to facilitate quick and organized viewing of essential system settings during the software development and testing process.

## Features
- **Automation**: Automatically runs checks on Android system properties.
- **Formatting**: Displays information in a clear and structured format, making analysis easier.
- **Development Device Support**: Ideal for use in development and testing environments.
- **Flash Build**: Allows you to flash a build onto the device.
- **Configure Flags**: Enables or disables specific device features.

## How to Use

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Electron](https://www.electronjs.org/)

### Installation

1. Clone the repository to your local machine using:
   ```sh
   git clone https://github.com/RicardoFz/quick-device-checker.git
   cd quick-device-checker

### Install the required dependencies:

```npm install```

2. Ensure the Android Debug Bridge (ADB) is installed and configured properly. Add the ADB path to your system's environment variables. For example:

Windows: **C:\Program Files\platform-tools\adb.exe**

MacOS/Linux: **/path/to/adb**

**Running the Application**
Start the application:
```npm start```
The Electron application will open, displaying the main interface.

**Using the Application**
**Device Info:** Click on "Get Device Info" to retrieve and display the Android device properties.

**Flash Build:** Navigate to the "Flash Build" section, select the build file, and click "Flash Build" to flash the build onto the connected device.

**Configure Flags:** Navigate to the "Configure Flags" section, select the flags you want to enable or disable, and click "Apply Flags".

## Contributions

Contributions are always welcome! If you have a suggestion to improve this tool, feel free to fork the repository, make your changes, and submit a pull request. We can review the improvements together and incorporate them into the project.
License

Distributed under the MIT License. See **LICENSE** for more information.
Contact

**Contact:** Ricardo Ferreira - j.ricardo.ferreira@hotmail.com

**Project Link:** https://github.com/RicardoFz/quick-device-checker
