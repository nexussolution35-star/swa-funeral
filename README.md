# Funeral Parlor: website (unbranded demo)

Static HTML/CSS with no build step and no third-party scripts. Deploy the folder to any static host.

- Colours (black and gold): `:root` in `assets/css/site.css`. The logo is a text wordmark (`.wm`).
- Photos: `assets/img/`
- Forms (callback, contact, online plan registration) are handled in `assets/js/site.js`.
  Set `FORM_ENDPOINT` there to a form backend or CRM webhook to receive submissions as JSON.
  Until then, submissions open the visitor's email app addressed to the business.
- The testimonials on the home and plans pages are SAMPLE content for the client presentation.
  Replace them (REVIEWS in the build) with real client feedback, used with permission, before launch.
- The hero "Trusted by 600+ families" figure must be confirmed with the client.
- Before launch, confirm with the client: Gold tier price, exact per-tier benefits, branch street addresses,
  and the insurer/FSP disclosure that South African funeral policies must show
- Contact details are demo values: phone 010 000 0000 and info@example.com
