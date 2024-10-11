# Decentralized Health Service Dapp - Backend Service

This is the backend service for the **Health-Node** application, a decentralized platform aimed at revolutionizing the healthcare sector. The platform empowers users to manage their medical records, book doctor services, and engage in live consultations from the comfort of their homes using a secure blockchain solution.

The backend is designed to handle various operations including decentralized storage of medical files and records to IPFS (InterPlanetary File System).

## Features

-   **Decentralized Record Management:** Medical records are stored on a decentralized system using IPFS, providing both security and privacy.
-   **File and Record Upload to IPFS:** Upload medical files (csv|png|jpeg|jpg|txt) and records to decentralized storage.
-   **Live Consultations:** Enabling secure, remote healthcare services.
-   **Blockchain-based:** Ensures data integrity, immutability, and transparency.

## File and Record Upload to IPFS

This feature enables the upload of files and medical records to the decentralized storage system (IPFS) using Helia and Pinata for pinning and retrieval.

### Endpoints

-   **Upload a File:**
    -   **POST** `/file`
    -   Upload a file (2MB max) of type CSV, PNG, JPEG, JPG, or TXT.
    -   The file is pinned on Pinata, and the CID (Content Identifier) is returned as a response.
-   **Upload a Record:**

    -   **POST** `/record`
    -   Submit a medical record in JSON format. The record is uploaded to IPFS, and the CID is returned.

-   **Retrieve a File:**

    -   **GET** `/file`
    -   Provide a CID to retrieve the content of the file from IPFS.

-   **Retrieve a Record:**
    -   **GET** `/record`
    -   Provide a CID to retrieve the medical record from IPFS.

## Getting Started

### Prerequisites

-   **Node.js** (v20.x or later)
-   **npm** (v10.x or later)
-   IPFS Pinning Service (Pinata account)

### Installation

1. Clone the repository:

2. Install the dependencies:

```bash
  npm install
```

3. Create a `.env` file in the project root using the .env.example

### Running the Application

Start the application locally:

```bash
npm run start:dev
```

The backend will run on `http://localhost:3003/`.

##

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/30184044-365d3cfb-0798-448e-8d0b-2774941ce516?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D30184044-365d3cfb-0798-448e-8d0b-2774941ce516%26entityType%3Dcollection%26workspaceId%3D87ee739b-41e7-4576-8563-af306c8635ce)

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## License

This project is licensed under the MIT License.
