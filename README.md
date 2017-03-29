
# photo-rating-api

## description
this is a quick project setup / prototype. its simulating an api for the angularjs app: photo-rating - to be able to make backend json calls.

currently its missing a database implementation like mysql. it updates the files on the filesystem.

## setup
- see package.json... and npm install`

## running it

- node app.js

or for watching file changes:

- ```npm install -g nodemon```
- ```nodemon app.js```

## api query commands

get shooting overview:

```http localhost:3001/listing-overview```

get shooting details:

```http localhost:3001/listing/1```

create new shooting:

```http POST localhost:3001/listing @json/listing-details-1.json```

update shooting:

```http PUT localhost:3001/listing/1 @json/listing-details-1.json```

delete shooting:

```http DELETE localhost:3001/listing/8```