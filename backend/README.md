# Math Placement Server
## Local Setup 
In order to run this server you need a couple of things 
- NodeJS installed on your local machine
- Either a connection to the MSSQL server or a docker image running MSSQL
- Admin access on your machine

### Running the project
- Navigate to the ```/Backend/``` directory of the project.
- Run ```npm install```, this will install of the NodeJS dependencies required for the project.
- If you want to generate the swagger page run ```npm swagger-autogen```. This will create the ```swagger_output.json``` contents.
- Once this is done you can run ```npm start``` this will start the project on ```PORT:3000```. 

The swagger commmand is only used to generate the Swagger page and doesn't have to be run everytime. If you add API endpoints or add parameters rerun this command. The start commmand runs the Swagger page along with the running the actual server. To view the swagger page go to ```https:\\localhost:3000\doc```. The server will be running in the terminal. To check if the server is working you can test with Postman.

## 