# Math Placement Server
## Local Setup 
In order to run this server you need a couple of things 
- NodeJS installed on your local machine
- An instance of MSSQL - See the ReadMe in the SQL folder for instructions to setup a database for this project
- Admin access on your machine

### Running the project
- In the backend root directory, ```run npm install```, this will install of the NodeJS dependencies required for the project.
- You will have to create a ```.env``` file for database connections. This will be in the base directory of the backend folder. 
```
DB_PORT = 1433
DB_HOST = localhost
DB_USER = sa
DB_PASS = [Your password]
DB_Database = [Your db]
```
- If you want to generate the swagger page run ```npm run swagger-autogen```. This will create the ```swagger_output.json``` contents.
- Once this is done you can run ```npm start``` this will start the project on ```PORT:3000```. 

The swagger commmand is only used to generate the Swagger page and doesn't have to be run everytime. If you add API endpoints or add parameters rerun this command. The start commmand runs the Swagger page along with the running the actual server. To view the swagger page go to ```https:\\localhost:3000\doc```. The server will be running in the terminal. To check if the server is working you can test with Postman.
