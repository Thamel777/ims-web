# Inventory Management System (IMS Web)

A modern, responsive web-based inventory management system built with Next.js 16, TypeScript, and Firebase. This application allows businesses to track stock levels, manage items, generate barcodes, and sync data in real-time.

## Features

*   **Real-time Dashboard**: View total inventory value, out-of-stock variations, and low-stock alerts.
*   **Inventory Management**:
    *   Add, Edit, and Delete items.
    *   Bulk upload inventory via CSV.
    *   Real-time synchronization with Firebase Realtime Database.
*   **Barcode System**:
    *   Automatic random 12-digit barcode generation (EAN-13 style).
    *   Generate printable barcode labels (PDF/Printer).
    *   Localized currency display (LKR).
*   **Search & Filter**: Fast client-side searching by name, SKU, or barcode.
*   **Responsive Design**: Mobile-friendly layout with a collapsible sidebar.

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Database**: Firebase Realtime Database
*   **Authentication**: Firebase Auth
*   **Styling**: CSS Modules, Styled JSX, Inline CSS
*   **Printing**: `react-to-print` for label printing
*   **Icons**: `lucide-react`

## Prerequisites

*   Node.js 18.17 or later.
*   A Firebase project with Realtime Database and Authentication enabled.

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ims-web.git
    cd ims-web
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

## Configuration

1.  **Firebase Setup**:
    *   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Authentication** (Email/Password provider).
    *   Enable **Realtime Database** and set read/write rules.
    *   Copy your web app configuration keys.

2.  **Update Config**:
    *   Open `lib/firebase.ts`.
    *   Replace the `firebaseConfig` object with your own credentials:
        ```typescript
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
          databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_PROJECT_ID.appspot.com",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID"
        };
        ```

3.  **Authentication**:
    *   Ensure you have a way to create the first user or enable public sign-up in your code if no user exists.

## Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Project Structure

*   `app/` - Application routes and pages (Next.js App Router).
    *   `(auth)` - Login route.
    *   `(dashboard)` - Protected routes (Inventory, Dashboard).
*   `components/` - Reusable UI components (Sidebar, Navbar, Modals, BarcodeModal).
*   `lib/` - Utility functions, Firebase init, and React hooks.
*   `public/` - Static assets.

## License

This project is open-source and available under the MIT License.
