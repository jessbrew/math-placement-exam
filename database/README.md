# Math Placement Database
## Local Setup
Steps to run the database locally:
1. Install [PostgreSQL](https://www.postgresql.org/download/)
2. Create a database and record the port number
3. Connect to database using preferred method (e.g., CLI, DBMS, etc.)
4. Execute CREATE TABLE commands in ```db-tables.sql``` file one at a time
   - Note that after creating the ```students``` table are two ALTER TABLE commands that need to be run
5. Execute INSERT INTO commands in ```insert-data.sql``` file
   - These can all be run together
6. Verify that all tables are created and that the data was inserted into the appropriate tables