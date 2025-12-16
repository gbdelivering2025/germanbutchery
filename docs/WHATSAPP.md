# WhatsApp Click-to-Chat Demo

A simple demo page was added at `frontend/whatsapp.html` that lets customers build an order with flexible units (grams, 100g, kg, pc, pkt) and sends a prefilled WhatsApp message to the shop phone number +250783654454.

How it works
- The page contains example products and a unit selector. Prices are shown in RWF.
- When the customer clicks "Send order via WhatsApp" the page opens a Click-to-Chat link (https://wa.me/250783654454) with a prefilled message that includes the order summary and optional customer details.
- This is a frontend-only demo (no server). Orders are not saved to a backend in this demo.

Preview
- To preview locally: clone the repo and open `frontend/whatsapp.html` in a browser (or deploy the `frontend` folder to any static host).
- For production we will:
  - Save orders server-side (to track and manage them in Admin).
  - Add product catalog loading from the backend and media storage (S3).
  - Optionally integrate WhatsApp Business Cloud API for server-side messaging and webhooks.

Notes
- This is the Click-to-Chat (frontend) approach — quick to launch and requires only the shop WhatsApp number.
- When you're ready to move to the Cloud API (programmatic messages, status webhooks, templates) I can implement that once you have a verified Meta Business account and phone registration.
