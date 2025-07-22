# Cursor-for-2d-animation
🤖 AI Animator: Text-to-Video with Manim and Gemini
[][React-url]
[][Node-url]
[][Manim-url]
[][Gemini-url]

An AI-powered, full-stack application that transforms text prompts into stunning mathematical animations. Using Google's Gemini API for code generation and a Node.js backend to drive the powerful Manim animation engine, this project makes creating complex animations as simple as writing a sentence.

Note: To replace the banner above, upload your project screenshot to a service like Imgur and paste the link.

🎬 Showcase: Generated Videos
This is where you can show off the amazing videos this application creates! Simply record a GIF or upload a video of your output and add it to the table below.

Animation Description

Output

A circle morphing into a square



A rotating DNA helix

Your GIF/Video Link Here

A 3D bar chart with animating bars

Your GIF/Video Link Here

✨ Key Features
AI Code Generation: Leverages the Google Gemini API to interpret natural language prompts and generate the corresponding Python code for the Manim animation library.

Full-Stack Video Rendering: A robust Node.js and Express backend receives the generated code, executes it in a secure environment, and renders a high-quality MP4 video using Manim.

AI-Powered Code Explanation: Don't just generate code—understand it! A built-in feature uses the Gemini API to provide a detailed, step-by-step explanation of how the generated Manim script works.

Responsive Frontend: A clean, modern, and fully responsive user interface built with React and styled with Tailwind CSS.

Parallel Processing: Optimized to feel fast and responsive by running video rendering and code explanation tasks concurrently.

🛠️ Tech Stack
Frontend

Backend

AI & Animation

React

Node.js

Manim

Vite

Express

Google Gemini

Tailwind CSS





🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js (v18 or later recommended)

Python (v3.9 or later)

Manim installed and configured on your system.

A Google AI API Key.

Installation
Clone the repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Set up the Frontend:

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a local environment file
cp .env.example .env.local

# Add your Google AI API key to .env.local
VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"

Set up the Backend:

# Navigate to the backend directory from the root
cd backend

# Install dependencies
npm install

Run the Application:
You will need two separate terminals to run both the frontend and backend servers concurrently.

Terminal 1 (Backend):

cd backend
npm run start

(Your backend will be running at http://localhost:5001)

Terminal 2 (Frontend):

cd frontend
npm run dev

(Your frontend will be running at http://localhost:5173)

Open http://localhost:5173 in your browser to use the application.

🏗️ How It Works
The application follows a simple but powerful full-stack architecture:

Frontend (React): The user enters a prompt. The frontend sends this prompt to the Gemini API to generate Python code.

Code Cleaning: The frontend cleans the generated code (removes markdown, adds imports) and displays it to the user.

Backend Call: The cleaned code is sent to the /render endpoint on the Node.js backend.

Backend (Node.js/Express): The backend writes the code to a temporary .py file and uses execa to run the manim command-line tool, targeting the generated script.

Video Rendering: Manim renders the animation and saves it as an .mp4 file in a publicly served media directory.

Response: The backend returns the URL of the newly created video to the frontend.

Display: The frontend receives the URL and displays the video in the preview pane.

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

[]: #
[react-url]: https://www.google.com/search?q=%5Bhttps://reactjs.org/%5D(https://reactjs.org/)
[]: #
[node-url]: https://www.google.com/search?q=%5Bhttps://nodejs.org/%5D(https://nodejs.org/)
[]: #
[manim-url]: https://www.google.com/search?q=%5Bhttps://www.manim.community/%5D(https://www.manim.community/)
[]: #
[gemini-url]: https://www.google.com/search?q=%5Bhttps://ai.google.dev/%5D(https://ai.google.dev/)
[react-shield]: [https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
[node-shield]: [https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
[manim-shield]: [https://img.shields.io/badge/Manim-525893?style=for-the-badge&logo=manim&logoColor=white](https://img.shields.io/badge/Manim-525893?style=for-the-badge&logo=manim&logoColor=white)
[]: #
[]: #
[gemini-shield]: [https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)
[]: #
