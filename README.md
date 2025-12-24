# 💖 Romantic Interactive Website

A beautiful, animated website perfect for romantic surprises! This project creates an interactive experience with photos, love messages, and sweet animations.

## ✨ Features

- **Beautiful Animations**: Floating hearts, smooth transitions, and engaging effects
- **Interactive Elements**: Click effects, hover animations, and keyboard navigation
- **Photo Gallery**: Animated photo cards with captions
- **Love Messages**: Sequentially appearing romantic messages
- **Typewriter Effect**: Final message appears with typing animation
- **Responsive Design**: Works perfectly on mobile and desktop
- **Performance Optimized**: Smooth animations on all devices

## 🎨 Customization Guide

### Adding Your Photos

1. Create an `images` folder in the project directory
2. Add your photos (recommended size: 400x300px or similar aspect ratio)
3. Update the photo placeholders in `index.html`:
   ```html
   <div class="photo-placeholder">
     <img src="images/your-photo1.jpg" alt="Your caption" />
     <div class="photo-caption">Your custom caption</div>
   </div>
   ```

### Personalizing Messages

Edit the love messages in `index.html` (lines 45-60):

```html
<div class="love-message" id="message1">
  <p>"Your personalized message here ✨"</p>
</div>
```

### Customizing the Final Message

Update the final typewriter message (around line 70 in `index.html`):

```html
<p class="typewriter">"Your personalized final message goes here..."</p>
```

### Changing Names

Update the signature section:

```html
<p class="name">Her Name ❤️</p>
```

### Color Scheme

Modify the colors in `styles.css`:

- Main gradient: Lines 8-9
- Heart colors: Various emoji throughout
- Button colors: Lines 100-105

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Select source: "Deploy from a branch"
5. Choose "main" branch
6. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: Netlify (Free)

1. Go to [Netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Get instant URL
4. Optional: Connect to GitHub for easy updates

### Option 3: Vercel (Free)

1. Go to [Vercel.com](https://vercel.com)
2. Import your project
3. Deploy with one click

## 📱 QR Code Generation

1. Once deployed, copy your website URL
2. Use any QR code generator:
   - [QR Code Generator](https://www.qr-code-generator.com/)
   - [QRCode Monkey](https://www.qrcode-monkey.com/)
   - Or search "QR code generator" in Google
3. Customize the QR code design to match your aesthetic
4. Print on sticker paper for the bracelet

## 🎵 Adding Background Music (Optional)

1. Add your music file to the project folder
2. Uncomment the audio source in `index.html`:
   ```html
   <source src="your-romantic-song.mp3" type="audio/mpeg" />
   ```
3. Note: Most browsers require user interaction before playing audio

## 🛠️ Technical Details

- **Framework**: Vanilla JavaScript (no dependencies)
- **Styling**: CSS3 with animations
- **Fonts**: Google Fonts (Dancing Script, Poppins)
- **Compatibility**: All modern browsers
- **Mobile**: Fully responsive

## 💡 Tips for the Perfect Surprise

1. **Test on mobile**: Most people scan QR codes with phones
2. **Keep photos light**: Compress images for faster loading
3. **Short messages**: Keep love messages concise and sweet
4. **Personal touches**: Use inside jokes or special memories
5. **Preview first**: Test the site thoroughly before the surprise

## 🔧 Troubleshooting

**Photos not showing?**

- Check file paths are correct
- Ensure images are in the right folder
- Verify image file formats (jpg, png, gif)

**Animations too slow/fast?**

- Adjust animation durations in `styles.css`
- Look for `animation-duration` and `transition-duration` properties

**QR code not working?**

- Verify the URL is correct and accessible
- Test the QR code with multiple devices
- Ensure the website is properly deployed

## 📸 File Structure

```
project-folder/
│
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # Interactive functionality
├── README.md           # This file
└── images/             # Your photos folder (create this)
    ├── photo1.jpg
    ├── photo2.jpg
    └── ...
```

## 💝 Making It Extra Special

- Add specific dates and memories in the captions
- Use photos from your first date, trips, or special moments
- Include inside jokes in the messages
- Consider adding a countdown to a special event
- Customize the colors to match her favorite palette

---

**Made with ❤️ for creating beautiful memories**

_This project is designed to be a sweet surprise that shows thought, effort, and creativity. The recipient will love the personal touch and the time spent making something unique just for them!_
