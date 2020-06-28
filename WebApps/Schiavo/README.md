# Exam #1: "Car Rental"
## Student: s280146 Schiavolini Federico

## React client application routes

- Route `/home`: display functions for unregistered users. 
- Route `/login`: a registered user can perform login.
- Route `/private`: this is the route of the configurator, here user can see his rents, configure a new one and perform a logout.
- Route `/private/rent`: here a user can see his own rents and delete the future ones
- Route `/private/payment`: here a user can pay for his rent. 
## REST API server

- GET `/brands`
  - request parameters: none
  - response body: list of all brands
- GET `/cars`
  - request parameters: none
  - response body: list of all cars
- POST `/login`
  - request parameters: none request body = username and password
  - response body: user that made the login request
- POST `/logout`
  - request parameters: none
  - response body content: none
- GET `/rent/:mail`
  - request parameters: mail of the user that made the request
  - response body content: list of rents made by user that made the request
- POST `/rent/add`
  - request parameters: none request body: all the propertis of the rent to add
  - response body: "true"
- POST `/availability`
  - request parameters: none request body: category, starting date and end date
  - response body: list of cars available according to parameters
- DELETE `/rent/delete/:rentId`
  - request parameters: ID of rent to delete request body: none
  - response body: none
- GET `/payment`
  - request parameters: amount to pay
  - response body: "true"
- ... All APIs after login require a valid JWT

## Server database

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users

* username, password
* username, password
* username, password (frequent customer)
* username, password
* username, password (frequent customer)
