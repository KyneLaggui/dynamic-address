# Dynamic Address Selector

A React project that dynamically updates address selections based on the **Philippine Standard Geographic Code (PSGC)** API. The system allows users to select their **region, province, city/municipality, and barangay**, and upon submission, it displays the full address.

## 📌 Table of Contents

- [How It Works](#how-it-works)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [Features](#features)
- [API Reference](#api-reference)

---

## 🚀 How It Works

This project leverages the **Philippine Standard Geographic Code (PSGC) API** to dynamically update the available address selections. Here's how it functions:

1. **User Selection:** The user selects a region from the dropdown.
2. **Dynamic Update:** Based on the selected region, the provinces list updates.
3. **Further Selection:** Selecting a province updates the list of cities/municipalities.
4. **Barangay Level:** After selecting a city/municipality, the barangay list is generated.
5. **Submission:** Once all selections are made, submitting the form will display the full address chosen.

This dynamic approach ensures accurate location selection and eliminates manual input errors.

---

## 🛠 Installation Guide

Follow these steps to install and run the project locally:

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/KyneLaggui/dynamic-address.git
cd dynamic-address
```

### 2️⃣ Install Dependencies

Ensure you have **Node.js** and **npm** or **yarn** installed.

```sh
npm install  # or yarn install
```

### 3️⃣ Start the Development Server

```sh
npm start  # or yarn start
```

The project should now be running on `http://localhost:3000/`.

---

## 📌 Usage

1. Open the application.
2. Select a **region** from the dropdown.
3. Choose the corresponding **province, city/municipality, and barangay** as they dynamically update.
4. Click **Submit** to display your full selected address.

---

## ✨ Features

- Dynamic selection of address levels (Region ➝ Province ➝ City/Municipality ➝ Barangay).
- Automatic fetching of location data from the **PSGC API**.
- User-friendly dropdown interface.
- Instant address display upon submission.

---

## 🌍 API Reference

The project uses the **Philippine Standard Geographic Code API** for retrieving location data.

- **Base URL:** `https://example-api.com/psgc`
- **Endpoints:**
  - `/regions` – Fetches all regions
  - `/provinces?region_id=<id>` – Fetches provinces under a specific region
  - `/cities?province_id=<id>` – Fetches cities/municipalities in a province
  - `/barangays?city_id=<id>` – Fetches barangays in a city/municipality

Ensure to replace `https://example-api.com/psgc` with the actual PSGC API endpoint used.
