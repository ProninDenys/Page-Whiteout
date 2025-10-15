# Page Whiteout — Privacy Policy
_Last updated: 2025-10-15_

**What the extension does**  
Page Whiteout creates a full-page screenshot of the current tab and automatically places **white rectangles** over personal data (emails, phone numbers, IBANs, card numbers) before you export the image.

**No data collection**  
- We **do not collect, transmit, store or sell** your browsing content or screenshots.  
- All detection and redaction happen **locally in your browser**.

**Permissions we request and why**
- `activeTab` — to work on the page you click the extension on.  
- `scripting` — to inject the detection/redaction code into the page.  
- `storage` — to save your extension settings (which data types to redact, padding).  
- `downloads` — to save the final PNG to your computer.

**Third-party library**  
The extension uses a local copy of **html2canvas** to render the page into a canvas.  
- It runs **entirely in your browser**, makes **no external network requests**, and shares nothing with its authors or with us.  
- Source: https://github.com/niklasvh/html2canvas (MIT License).

**Data retention**  
We do not retain any personal data. Settings are stored only in your browser via `chrome.storage.sync`.

**Security**  
The exported file already contains the white boxes “burned in” on the image so the covered text cannot be recovered from the PNG.

**Children’s privacy**  
The extension is a utility tool and not directed to children.

**Changes to this policy**  
If we change this policy, we will update the date at the top and publish the new version with the extension update.

**Contact**  
Questions? Email: **<aisolagen@gmail.com>**