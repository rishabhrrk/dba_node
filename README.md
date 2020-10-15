# Database Admin
## Current Functionalities
PostgreSQL is missing a good dashboard which can measure query performance, can help in role and permission management, can help non-technical users interact with database easily. This was the motivatation for creating a large scale PostgreSQL dashboard which can be used by large number of people across any organisation which scales across the globe.

This system follows a microservice methodology.
First sservice is the login service and user authorization. 
The backend of a microservice using Nodejs, Express, PostgreSQL, Redis. 
The service uses JWT for authentication and provides functionality like new registration, login, logout and re-authentication.

A second microservice which enable database admins to create new users, databases and manage user roles and permission is built using Express, Nodejs, PostgreSQL. This service lets database admins create super users, users with limited functionality and allow admins to check for queries executed by users which are taking longer than usual.

## Future Work
These services are being designed keeping in mind that admin and user might be in different location. For this databases synchronisation and distributed system design principles are being used in order to create a seamless and useful experience.

Creating UI for all services.

Creating usage reports which can be monitored by admin.