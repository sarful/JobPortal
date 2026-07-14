# JobPortal

## Live Website

Frontend deployed on Vercel:

[https://job-portal-ten-lyart.vercel.app](https://job-portal-ten-lyart.vercel.app)

## Project Overview

JobPortal is a full-stack job portal web application where candidates can search and apply for jobs, employers can create and manage job posts, and administrators can manage users, jobs, applications, categories, and contact messages.

The platform provides separate role-based dashboards for:

- Candidates
- Employers
- Administrators

## Main Features

- User registration and login
- JWT authentication
- Candidate, employer, and administrator roles
- Job search and filtering
- Job details page
- Job application system
- Duplicate application prevention
- Candidate profile management
- Employer company profile management
- Job creation, editing, deletion, and status control
- Applicant management
- Application status tracking
- Contact form
- Responsive user interface

## Deployment

### Frontend

The frontend is deployed on Vercel.

Live URL:

[https://job-portal-ten-lyart.vercel.app](https://job-portal-ten-lyart.vercel.app)

### Backend

The backend can be deployed using:

- Render
- Railway

The frontend communicates with the backend using the following Vite environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
