# Document Management Application

## Overview
This Document Management Application allows users to manage their documents efficiently with features like Google Drive integration, document organization, and a modern user interface.

## Architecture
The application is structured as a full-stack solution with the following components:

- **Backend**: Built with Node.js and Express.js, it handles API requests, authentication, and serves the frontend.
- **Frontend**: Developed using React and Vite, it provides a responsive and interactive user interface.
- **Database**: (If applicable, mention database here)
- **Authentication**: Utilizes Passport.js for Google OAuth 2.0 authentication.

## Features
- Google Drive integration for saving and retrieving documents.
- Document organization with collapsible folders.
- Modern UI with Radix UI components and Tailwind CSS.
- Title synchronization between local and Google Drive.

## Workflow
1. **User Authentication**: Users log in using Google OAuth.
2. **Document Management**: Users can create, edit, and organize documents.
3. **Save to Drive**: Documents can be saved to Google Drive with proper title handling.
4. **UI Interaction**: Users interact with a modern, responsive interface.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SakshamChouhan/FileEditorTracker.git
   cd FileEditorTracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your environment variables:
   ```
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   DATBASE_URL=your_redirect_url
   PORT = 5000
   ```

4. **Build and Run**:
   ```bash
   npm run build
   npm start
   ```

## Deployment

### Render
1. **Configure Render**: Add a `render.yaml` file with the necessary configuration.
2. **Deploy**: Push your code to a Git repository and deploy using Render's dashboard.

### Environment Variables
Ensure all necessary environment variables are set in Render's dashboard.

## Contributing
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, please contact [your-email@example.com](mailto:raisaksham426@.com).

## CodeLikeARed❤️
