# IMS Web Dashboard

This is the web-based management interface for the Inventory Management System (IMS), built with Next.js 14 (App Router), TypeScript, and Firebase.

## Key Features

- **Secure Authentication**: Uses Firebase Auth for login.
- **Real-time Dashboard**: Live view of total items, low stock alerts, and inventory value.
- **Inventory Management**: Create, Read, Update, and Delete (CRUD) items with ease.
- **Responsive Design**: Mobile-friendly sidebar and layout.
- **Premium UI**: Modern aesthetics using Inter font, clean colors, and smooth transitions.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/(dashboard)`: Protected routes (Dashboard, Inventory).
- `app/(auth)`: Public routes (Login).
- `components`: Reusable UI components (Sidebar, Navbar, ItemForm).
- `lib`: Firebase configuration and custom hooks (`useInventory`).

## Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules / Global CSS with Variables for theming.
- **Database**: Firebase Firestore (Real-time updates).
- **Icons**: Lucide React.
- **Notifications**: Sonner.
