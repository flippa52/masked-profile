# Google Play Services Integration Guide

## Overview
Your website now includes Google Play Services integration for displaying real customer reviews directly on your site. The integration uses a fallback system - if the API isn't configured, it displays sample reviews.

## Setup Steps

### Step 1: Create a Google Play Console Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new project and register your business app
3. Your app package name will be something like: `com.funterrance.entertainment`
4. Note this package name - you'll need it later

### Step 2: Publish Your App on Google Play
1. Upload your app APK/AAB to Google Play Console
2. Complete the store listing with:
   - App name: "Funterrance Bouncing Castles"
   - Description: "Premium entertainment services for events in Nairobi CBD"
   - Screenshots and promotional graphics
   - Category: Entertainment/Games
3. Submit for review and publishing
4. Once published, customers can leave reviews on your Play Store page

### Step 3: Set Up Google Play Developer API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the "Google Play Developer API"
4. Create an OAuth 2.0 credential (Service Account)
5. Download the JSON key file
6. Save it securely on your backend server

### Step 4: Update Package Name in Website
Edit your HTML file and replace the package name:

```javascript
const PLAY_PACKAGE = 'com.funterrance.entertainment'; // Use your actual package name
```

### Step 5: Create Backend Endpoint
You need a backend endpoint (`/api/play-store-reviews`) that:
1. Accepts POST requests with the package name
2. Uses the Google Play API credentials to fetch reviews
3. Returns reviews in this format:

```json
{
  "reviews": [
    {
      "author": "John Doe",
      "context": "Event Type",
      "rating": 5,
      "text": "Review text here..."
    }
  ]
}
```

### Example Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const {google} = require('googleapis');
const app = express();

// Load your OAuth 2.0 credentials
const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/androidpublisher']
});

app.post('/api/play-store-reviews', async (req, res) => {
  try {
    const androidpublisher = google.androidpublisher('v3');
    const packageName = req.body.package;
    
    // Fetch reviews from Google Play
    const response = await androidpublisher.reviews.list({
      auth: await auth.getClient(),
      packageName: packageName,
      maxResults: 10
    });

    // Format reviews
    const reviews = response.data.reviews.map(review => ({
      author: review.authorName || 'Anonymous',
      context: review.reviewerLanguage || 'General',
      rating: review.rating || 5,
      text: review.comments[0].userComment.text || ''
    }));

    res.json({reviews});
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({error: 'Failed to fetch reviews'});
  }
});

app.listen(3000);
```

### Example Backend (Python/Flask)

```python
from flask import Flask, request, jsonify
from google.auth import default
from google.auth.transport.requests import Request
import google.auth.transport.urllib3
import urllib3

app = Flask(__name__)

@app.route('/api/play-store-reviews', methods=['POST'])
def get_play_store_reviews():
    try:
        package_name = request.json.get('package')
        
        # Get OAuth credentials
        credentials, _ = default(
            scopes=['https://www.googleapis.com/auth/androidpublisher']
        )
        credentials.refresh(Request())
        
        # Build API request
        http = urllib3.PoolManager()
        headers = {
            'Authorization': f'Bearer {credentials.token}',
            'Content-Type': 'application/json'
        }
        
        url = f'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{package_name}/reviews'
        
        response = http.request('GET', url, headers=headers)
        reviews_data = json.loads(response.data)
        
        # Format reviews
        reviews = []
        for review in reviews_data.get('reviews', [])[:10]:
            reviews.append({
                'author': review.get('authorName', 'Anonymous'),
                'context': 'User Review',
                'rating': review.get('rating', 5),
                'text': review.get('comments', [{}])[0].get('userComment', {}).get('text', '')
            })
        
        return jsonify({'reviews': reviews})
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000)
```

## Current Status

### ✅ Implemented
- Dynamic review loading system
- Fallback to sample reviews if API unavailable
- Responsive review card layout
- Star rating display
- Author, context, and review text fields

### ⏳ To Complete
1. Create Google Play Console account and publish app
2. Set up Google Cloud Project with enabled APIs
3. Create OAuth 2.0 service account credentials
4. Implement backend endpoint on your server
5. Update `PLAY_PACKAGE` variable with your app's package name
6. Test the integration

## Testing Without Backend

While setting up the backend, your site will display the fallback reviews. These are sample reviews that showcase the functionality. Once the backend is configured, it will fetch real reviews from your Google Play listing.

## Deployment Checklist

- [ ] Google Play app published
- [ ] Google Cloud Project created
- [ ] API credentials obtained
- [ ] Backend endpoint implemented
- [ ] Package name updated in HTML
- [ ] Backend URL configured in HTML (update fetch path if needed)
- [ ] HTTPS enabled on backend
- [ ] CORS headers configured for your domain

## Support Resources

- [Google Play Developer API Docs](https://developers.google.com/android-publisher)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)

## Need Help?

Contact Funterrance Support at:
- 📧 funterrancebouncingcastles@gmail.com
- 📱 +254 741 144 518
