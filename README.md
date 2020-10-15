# Database Admin
PostgreSQL is missing a good dashboard which can measure query performance, can help in role and permission management, can help non-technical users interact with database easily. This was the motivatation for creating a large scale PostgreSQL dashboard which can be used by large number of people across any organisation which scales across the globe.

## Current Functionalities
This system follows a microservice methodology.

All the requests go via login service. Currenty craeting and viewing posts is available.
Posts are useful feature of a dashboard for creating new discussions and comments on projects.

Usage:

Signup feature:
Request -> 
```
POST localhost:5001/user/signup
BODY 
{
    "username": "papa_new",
    "password": "password"
}
```

Login feature:
Request -> 
```
POST localhost:5001/user/login
BODY 
{
    "username": "papa_new",
    "password": "password"
}
Response ->
ACCESS_TOKEN and REFRESH_TOKEN
ACCESS_TOKEN can be used for making requests
REFRESH_TOKEN can be used to generate new ACCESS_TOKEN in case ACCESS_TOKEN expires.
```

Logout feature:
Request -> 
```
DEL localhost:5001/user/logout
BODY 
{
    "username": "papa_new",
    "password": "password",
    "refreshToken": "some_refresh_token"
}
```

Authenticate feature:
Request -> 
```
POST localhost:5001/user/authenticate
BODY 
{
    "username": "papa_new",
    "password": "password",
    "refreshToken": "some_refresh_token"
}
Response ->
ACCESS_TOKEN and REFRESH_TOKEN
ACCESS_TOKEN can be used for making requests
REFRESH_TOKEN can be used to generate new ACCESS_TOKEN in case ACCESS_TOKEN expires.
```

Create Post feature:
Request -> 
```
POST localhost:5001/posts/createPost
BODY 
{
    "author": "risheek",
    "post": "this is my second post"
}
HEADER
Authorization: "ACCESS_TOKEN"
```

Get Posts feature:
Request -> 
```
POST localhost:5001/posts/getPosts
BODY 
{
    "author": "risheek"
}
Response ->
JSON object of all matching posts.
```

First sservice is the login service and user authorization. 
The backend of a microservice using Nodejs, Express, PostgreSQL, Redis. 
The service uses JWT for authentication and provides functionality like new registration, login, logout and re-authentication.

A second microservice which enable database admins to create new users, databases and manage user roles and permission is built using Express, Nodejs, PostgreSQL. This service lets database admins create super users, users with limited functionality and allow admins to check for queries executed by users which are taking longer than usual.

## Steps to start
To start login server.
Download and start Redis.
From inside login directory
```
npm install
nodemon start
```

To start posts service
From inside posts directory
```
npm install
nodemon start
```


## Future Work
These services are being designed keeping in mind that admin and user might be in different location. For this databases synchronisation and distributed system design principles are being used in order to create a seamless and useful experience.

Creating UI for all services.

Creating usage reports which can be monitored by admin.