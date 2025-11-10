# Portfolio Builder Platform

FrontSkeleton is an Angular-based web application that allows users to create, edit, preview, and manage personalized portfolios using predefined templates or custom sections.  
It provides a clean, modular, and intuitive interface for showcasing professional or academic experiences.

---

## Features

### Template-Based Portfolio Creation
- Choose from predefined portfolio templates stored in `/assets/templates/`.
- Each template contains configurable sections (e.g., About, Education, Experience, Skills, Contact).
- Supports custom user-created sections to personalize portfolios even further.

### Dynamic Editor
- Fully dynamic form builder that loads configuration from each template’s `config.json`.
- Add, edit, or delete sections and fields in real time.
- Supports:
  - Text fields and text areas  
  - Dates and periods  
  - Images and files (PDFs, etc.) with compression  
  - Repeatable entries such as multiple experiences or education records

### Smart Local Storage System
- Every portfolio is stored locally in the browser (`localStorage`) using a unique key.
- Data is automatically restored when reopening the editor.
- Includes error handling for storage quota limits.

### Custom Sections
- Users can create new sections with customizable content types (text, image, file, date, period).
- Each custom section is saved independently and merged dynamically with the selected template.

### Preview Mode
- Displays a real-time preview of the portfolio using the chosen template.
- Includes a "Modify" button to return to the editor while preserving all entered data.

### Publishing (Disabled in Local Version)
- A "Publish" button is included in the preview but intentionally disabled in this version.
- In a future update, this feature could generate and host a public link for sharing portfolios online.

### Portfolio Dashboard
- Lists all created portfolios with title, creation date, and template information.
- Available actions:
  - View  
  - Edit  
  - Delete  
- Clean, modern design with smooth animations and full responsiveness.

### File and Image Handling
- Image compression is performed before saving to reduce storage usage.
- Supports multiple file types with file size validation.

### Responsive UI
- Designed to work seamlessly on desktop, tablet, and mobile.
- Consistent styling across all components and templates.

---

## Tech Stack

| Technology | Description |
|-------------|-------------|
| Angular 17+ | Frontend framework |
| TypeScript | Strongly typed JavaScript |
| SCSS | Styling with nested syntax |
| Bootstrap Icons | Icon library for UI elements |
| LocalStorage API | Client-side data persistence |
| HTML5 / CSS3 | Structure and responsive design |

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/download) (v18 or higher recommended)
- Angular CLI installed globally

---

## Setup Steps

### Clone this repository:

`git clone https://github.com/your-repo/front-skeleton.git
cd front-skeleton`


### Install dependencies:

`npm install`


### Start the development server:

`ng serve`


### Open your browser and navigate to:

`http://localhost:4200/`

---

## Author

- Developed by Chiara CARLINO and Lucille FINET



