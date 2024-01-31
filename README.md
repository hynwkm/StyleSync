# Project Title

Style Sync : Like My Fit?

## Overview

Style Sync is a personalized fashion recommendation and social shopp# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
ing platform. Users create profiles based on their height, weight, and body style to discover and connect with others who share similar attributes. Style Sync not only allows users to explore and replicate outfits that match their style preferences and budget but also facilitates community-driven shopping by enabling users to recommend and share fashion finds, fostering a collaborative and budget-friendly fashion experience.

### Problem

Finding the perfect outfit that suits your personal needs involves considerations of body type, style, and budget. Style Sync simplifies this process by connecting users with similar tastes, making it easier to shop for outfits they will love.

Market Research shows that similar fashion apps primarily focus on connecting customers with designers. While social media apps (Twitter, Facebook, etc) can be used to connect users based on fashion interests, they lack functionality to allow users to discover new outfits easily.

Style Sync aims to connect provide users with a more casual experience, connecting them with other people with similar body styles and fashion tastes, growing a healthy community.

### User Profile

-   **Primary Users:**
    -   Individuals seeking guidance in finding clothes that match their unique style but are unsure where to start.
    -   Fashion enthusiasts eager to share their style and help others in their fashion journey.

### Features

**User Profiles:**

-   Users can create profiles by inputting their height, weight, and body style.
-   Option to add style preferences and budget constraints to enhance personalized recommendations.

**Discover Similar Styles:**

-   Users can browse profiles of others to find users with similar body types and styles.
-   View outfits shared by community members for inspiration.

**Budget-Friendly Recommendations:**

-   Receive curated fashion suggestions based on personal style preferences and specified budget.

**Outfit Sharing:**

-   Users can upload pictures of their outfits to share with the community.
-   Automatically provides links to purchase the item or the entire outfit directly if bought through the app link.

**User Rating System:**

-   Users seeking guidance can rate individuals who provide fashion suggestions.

**Recommendation Tags:**

-   Allow users to tag others with descriptors such as "budget-friendly," "trendy," "helpful," etc.
-   Use tags to refine and improve the recommendation algorithm, ensuring more accurate suggestions for users with similar requirements.

## Implementation

#### Tech Stack

1. **Frontend:**
    - React
    - react-router
    - axios
2. **Backend:**
    - Node JS
    - Express
    - MySQL
    - knex
    - bycrypt

#### APIs

-   External APIs:
    -   Utilize APIs from sources such as Amazon, Walmart, H&M, and others for obtaining information on clothing goods.
    -   Potential issues: api might not be freely available
    -   Solution: create dummy data and create internal custom API
    -   Solution 2:
        -   Fashion Cloud API v2
        -   dummyjson api for clothing

#### Sitemap

##### Home Page:

-   Landing page displaying featured and trending users with similar styles.
-   Navigation to other sections of the app.

#### Register Page

#### Login Page

##### User Profile:

-   Displaying user details, including height, weight, and style preferences.
-   Edit profile option.

##### Discover Styles:

-   List of users with similar body types.
-   Clicking on a user leads to their profile and shared outfits.

##### Outfit Details:

-   Detailed view of a user's outfit, including individual items and purchase links.
-   Option to save, like, or comment on the outfit.

##### Create Post:

-   Form for users to upload and share their outfits.
-   Include tags and details about each item.

### Mockups

-   All Mockups, including Database Schema are very much WIP

![landing page](public/Mockups/landing-page.png)

![Outfit details page](public/Mockups/outfit-details-page.png)

#### Data

![Database Schema](public/Mockups/database-schema.png)

**User Profile Data:**

-   Attributes: UserID, Username, Height, Weight, Style Preferences, Budget Constraints.
-   Relationships: One-to-Many with Uploaded Outfits, Ratings, and Recommendations.

**Uploaded Outfits Data:**

-   Attributes: OutfitID, UserID (Uploader), Image URL, Item Details (Name, Brand, Price, Purchase Link).
-   Relationships: Many-to-One with User Profile (Uploader), Many-to-Many with Ratings and Tags.

### Endpoints

**GET /login/**

-   Get user profile

Parameters:

-   header auth token

Response:

```
{
    "id": 123,
    "username": "fashion99",
    "height (cm)": 182,
    "weight (kg)": 70,
    "style preference": ["Casual", "Vintage"],
    "budget" : 100,
    "rating" : 4,
}
```

**POST /signup**

-   Create user profile

Parameters:

-   username, password, height, weight, style preferences, budget

Response:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**GET /outfits/outfitId**

-   Retrieve outfit profile

Parameters:

-   outfitId

Response:

```
{
    "id":" 20,
    "brand": "Nike",
    "type": "shirt",
    "color": "red",
    "tags" : ["casual", "autumn"],
}
```

**POST /outfits**

-   Post a new outfit for a signed in user

Parameters:

-   header auth token, brand, type, color, etc.

Response:

```
{
    "id":" 20,
    "brand": "Nike",
    "type": "shirt",
    "color": "red",
}
```

#### Auth

**Middleware:**

-   Express.js middleware
-   Before processing requests to protected endpoints (e.g., creating outfits, rating users), the server will verify the validity of the request body.
-   User Session will be stored in local storage, and removed on logout. It will be used to render the app accordingly.

# Roadmap

## Sprint 1: Front-end Setup and User Profile

-   Set up a new React project.
-   Create page for users to set up and edit profiles.
-   Design UI components for profile data input.

## Sprint 2: Front-end Outfit Upload and Display

-   Implement UI components for users to upload outfits.
-   Design the form for outfit details.
-   Create pages to display uploaded outfits.
-   Fetch and render mock outfit data.

## Sprint 3: Back-end Setup and Integration

-   Initialize the back-end server using Node.js and Express.
-   Set up basic routes for outfit upload and retrieval.
-   Connect the React front-end with the mock back-end.
-   Ensure outfit upload and display functionalities are working with mocked data.

## Nice-to-haves

### Ratings and Tags :

-   Implement basic functionality for users to rate and tag others.
-   Display ratings and tags on user profiles.

### Basic Recommendation System :

-   Recommendation system based on user preferences, tags, and likes.

### Notification System :

-   Basic notification system for new items, followed users, etc.
