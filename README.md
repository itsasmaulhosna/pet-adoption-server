# PetNest – Pet Adoption Platform (Server)

## Project Name

PetNest – Backend (Node.js + Express)

## Purpose

This backend server powers the PetNest Pet Adoption Platform.  
It handles pet listings, adoption requests, and approval system using secure REST APIs with MongoDB database.

## Live Server

https://pet-adoption-server-dun.vercel.app

## Tech Stack

- Node.js
- Express.js
- MongoDB (Native Driver)
- dotenv
- cors
- node:dns

## NPM Packages Used

- express
- mongodb
- cors
- dotenv

## Features (Backend)

- Full CRUD API for managing pet listings (Create, Read, Update, Delete)
- Fetch featured pets (limited data for homepage display)
- Get all pets and single pet details by ID
- Adoption request system with user-based tracking
- User-specific adoption request fetching
- Cancel adoption request functionality
- Admin/owner can approve or reject adoption requests
- Automatic pet status update (Adopted / Available)
- Request status management (Pending / Approved / Rejected)
- Secure REST API with MongoDB ObjectId validation
- CORS enabled for frontend integration
- Fast MongoDB native driver-based database operations
