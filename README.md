# Agora

*A student organization election management system built for student organizations in the Visayas State University.*

| **Internal Release Code** | Date Released | 
| --- | --- |
AG.010.001 | 2026-02-27 |
AG.010.002 | 2026-03-22 |
AG.010.003 | 2026-04-05 |
AG.010.004 | 2026-04-13 |
AG.010.005| 2026-04-22 |
AG.010.006| 2026-05-05 |

## AG.010.001 Release Notes 

● Add NextJS project framework

● Update README.md to reflect project vision and tracking system.

## AG.010.002 Release Notes 

● Initial Supabase setup and foundational configuration

● SOES landing page with modular UI components

● Login page frontend and secure file rerouting

● Complete authentication flow using Next.js Server Actions

● Centralized form validation using the Zod library

● Protected routing and optimization of form states

## AG.010.003 Release Notes 

● Implemented secure route protection for Admin and Superadmin.

● Organization Management: Full end-to-end flow for creating, editing, and joining organizations.

● Core Data Access Layer: Server-side fetch queries for Users, Organizations, and Elections.

● Finalized Landing Page: Integrated scroll animations, dark mode, and interactive UI states.

● Navigation System: Added dynamic Sidebar, breadcrumb navigation, and page progress bar.

● Database Type Safety: Established foundational enums and interfaces for Supabase interactions.

● Profile Management: Initial CRUD functionality for user profile pages.

## AG.010.004 Release Notes 

● Users can now seamlessly create, edit, and join organizations directly within the system.  

● Introduced a complete payment verification system for organizations and elections, including GCash QR integration and status filtering.  

 ● Added the end-to-end workflow for creating election sessions, managing dynamic data, and processing election-specific payments.  

● Replaced hard coded positions with a custom template builder, allowing you to create, edit, duplicate, and dynamically select ballot structures for new elections.

● Improved mobile responsiveness, unified global theming, added semantic status colors (e.g., green for verified, yellow for pending), and smoothed out the organization-switching experience.  

● Fixed major election-related routing issues and transitioned multiple pages from static mockups to dynamic, database-driven interfaces.

## AG.010.005 Release Notes

● Added a complete system to create and manage candidate profiles, including their vision statements, key projects, and partylist affiliations.

● Implemented full management tools for partylists, allowing you to easily organize groups and upload custom partylist logos.

● Integrated a dedicated election payments table directly into the main payment system to verify and process transaction statuses.

●  Introduced a searchable and filterable interface within Organization Management to view all current and past members.

● Built a fully interactive Reports Management page to easily submit, filter, and track system bugs by severity and date.

● Optimized the breadcrumb navigation by filtering out raw session IDs and fixing broken links to ensure smoother routing.

## AG.010.006 Release Notes

● Voters can now securely authenticate using unique voting codes and submit their votes through a fully functional ballot that supports both single and multi-seat positions.

● Added a dynamic, real-time dashboard allowing users to track polling data, candidate races, and election statuses (upcoming, active, completed) across multiple organizations.

● Administrators now have a dedicated dashboard to track turnout percentages and perform individual voter management tasks (add, edit, soft-delete).

● Introduced a CSV upload tool for mass voter registration, paired with a secure, rate-limited automated email system to batch-send voting codes directly to students.

## Important Links

● Design Specs: [Agora Design Specification Documentation](https://github.com/Shinkrbs/agora-docportal.git)

