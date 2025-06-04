# HubSpot Reply Interceptor Chrome Extension

## Features

- Intercepts the "Send" button in HubSpot Service Help Desk
- Prompts users to classify replies as either:
  - Acknowledgement
  - Actual reply
- Automatically opens the ticket status dropdown for status selection:
  - "Waiting on us" for acknowledgements
  - "Waiting on contact" for actual replies
- Only triggers for "Send" actions (ignores "Add comment" button)

## Installation

### Prerequisites
- Google Chrome browser
- Access to HubSpot Service Help Desk

### Steps

1. **Download the Repository**
    Download and extract the ZIP file

2. **Load the Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right corner)
   - Click "Load unpacked"
   - Select the project folder containing the extension files

3. **Activate the Extension**
   - Refresh your HubSpot Service Help Desk page
   - The extension will be active and ready to use

## Usage

1. Compose your reply in HubSpot Service Help Desk
2. Click the "Send" button
3. Select the reply type when prompted:
   - "Acknowledgement" - Sets status to "Waiting on us"
   - "Actual reply" - Sets status to "Waiting on contact"
4. The ticket status dropdown will automatically open for your selection

## Files

- `manifest.json` - Extension configuration
- `content.js` - Core extension functionality
- `README.md` - This documentation
