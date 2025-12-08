<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1PUrk1h7MaSxhOt6bso5175RZX5q6LkSs

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Features

- 🤖 AI-powered probability analysis using Gemini 2.5 Flash
- 📊 Support for BTC, ETH, and ADA perpetual contracts
- 📸 Coinglass liquidation heatmap analysis
- 💾 Automatic local storage of prediction history (max 20 results)
- 📥 Export prediction history as JSON
- 🌐 Multi-language support (English / 繁體中文)

## Deployment

This project includes GitHub Actions workflow for automatic deployment to GitHub Pages.

### Quick Deploy

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```
   (You may need to authenticate. See [DEPLOYMENT.md](./DEPLOYMENT.md) for details)

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as source
   - Save

3. **Access your site:**
   - After deployment, visit: `https://bryaninjapan.github.io/Bitquant/`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Project Structure

```
├── components/          # React components
│   ├── Layout.tsx      # Main layout with header/footer
│   ├── InputCard.tsx   # Market data input form
│   ├── ResultCard.tsx  # Analysis results display
│   └── HistoryPanel.tsx # Prediction history viewer
├── contexts/            # React contexts
│   └── LanguageContext.tsx
├── services/           # API services
│   └── geminiService.ts
├── utils/              # Utility functions
│   ├── storage.ts     # LocalStorage management
│   └── translations.ts
└── types.ts            # TypeScript type definitions
```
