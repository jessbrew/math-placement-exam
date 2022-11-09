# How to run the Backend on a Windows Server
In order run the backend of the Math Placement Test on a Windows server requires
- Admin access to the server
- MSSQL server install
    - Must be configured to allow connections through the server Browser
    - Listening on PORT 1433
    - Have the correct credentials in the .env file stored in the /api folder
- Code placed into the /api folder
- PM2 installed 
    - Docs located here: "https://pm2.keymetrics.io/"

Once all of these components have been installed or created you will need to open the IIS management console. 

- Nest the backend as a child application of the frontend
- Create a reverse proxy at the /api folder 

To allow the process to run create a .bat file 
- To do this open a text file with notepad 
    - Write cd into the directory of the api
    - Call the api by calling the index file
    - Save as a .bat file 

- Create a scheduled task in the Windows Scheduler 
    - Set to start on reboot 
    - Restart daily at a time that is convenient 
    - Allow to run without a user logged in 
    - have the pm2 instance call the .bat
