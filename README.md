# Page Whiteout
**Full-page screenshots with automatic white-box redaction** of emails, phone numbers, IBANs and card numbers. Export a clean PNG in one click.

## Key features (MVP)
- Detects personal data on the page and covers it with **white rectangles**.
- Works entirely **offline** in your browser — nothing is uploaded anywhere.
- **Export PNG** with redactions “burned” into the image.
- Simple settings: choose which data types to redact and padding size.

## How it works
1. Open any page.  
2. Click the extension icon → **Start redaction**.  
3. The page is scanned and white boxes appear over detected fragments.  
4. Click **Export PNG** to save the clean image.

## Developer install (unpacked)
1. Open `chrome://extensions`, enable **Developer mode**.  
2. Click **Load unpacked** and select the project folder.  
3. Open any page → extension popup → **Start** → **Export PNG**.

## Settings
`Options` page lets you toggle: Email, Phone, Card, IBAN. You can also change the white-box padding (px).

## Permissions
`activeTab`, `scripting`, `storage`, `downloads` — see **Privacy Policy** for details.

## Limitations (MVP)
- Cross-origin iframes cannot be scanned by Chrome — their content may be missing on the screenshot.
- Very long pages: use default scale to avoid memory issues.

## Roadmap
- PDF export, manual brush with undo, more entity types (addresses, IDs), per-profile rules (Support / Legal / HR), license system for Pro.

## Tech
- Chrome Extensions **Manifest V3**
- **html2canvas** (local copy) for page rendering

## License
TBD (choose one, e.g. MIT). Third-party notices below.