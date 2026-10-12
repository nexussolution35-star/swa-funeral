# SWA Funeral Services: website

Static HTML/CSS with no build step and no third-party scripts. Deploy the folder to any static host.

- Brand colours (black and gold from the logo): `:root` in `assets/css/site.css`
- Photos and logo: `assets/img/` (from SWA's own media, resized for web)
- Forms (callback, contact, online plan registration) are handled in `assets/js/site.js`.
  Set `FORM_ENDPOINT` there to a form backend or CRM webhook to receive submissions as JSON.
  Until then, submissions open the visitor's email app addressed to SWA.
- The testimonials on the home and plans pages are SAMPLE content for the client presentation.
  Replace them (REVIEWS in the build) with real client feedback, used with permission, before launch.
- The hero "Trusted by 600+ families" figure must be confirmed with SWA.
- Before launch, confirm with SWA: Gold tier price, exact per-tier benefits, branch street addresses,
  and the insurer/FSP disclosure that South African funeral policies must show
