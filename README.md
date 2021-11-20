## Transtura Task

Built with NodeJs microservice using a custom MVC design pattern, the entry point into the application can be found from the **index.js** file. All the configs for the application has been abstracted into the **config** folder and the loaded into the **Kernel.js** file in **bootstrap folder**.

### Folder Structure

1. **App:** This contains the folders housing the **controllers** & the **models** folders. **New Controllers** which extends the _Base Controller_ can be introduced in the **Controllers Folder**. 

  **New Models** can be introduced in the **Models Folder** as well. It has a backward compatibility fix which means you could introduce a _Base Model_ to manage re-usable methods thus keeping the code _DRY_.

2. **Bootstrap:** This folder contains 1 file the **Kernel.js**. This file is responsible for loading all the configs required by the application in a class based construct which is then injected/consumed in the **index.js** file.

3. **Database:** This folder contains your application **Schema and Seeders** folder. With these folders, You can define Schema required by your application and seeders. experimenting with data during development. In order to use a seeder, I advise you use follow the steps below. You can also customize the seeders to fit your needs.

```bash
$ cd database/seeders
```

```bash
$ DB_URL=mongo:test_credentials@127.0.0.1:27017 node SEEDER_FILE.js
```

4. **Middleware:** This folder introduces middleware into your application allowing you to guard/protect certain API routes or endpoints. You can also extend the functionalities further by introducing RATE limiting and other hacks.

5. **Routes:** Routes required by your application can be defined here. _The path is defined and the require class can be imported from your controllers folder._ To keep your code standard, I advise you only import controllers & middlewares into this file. You can defined additional routes like **WEB routes** as well. HACK AWAY!!!

6. **Utils"** If you have certain methods you would like to re-use without bloating your Base controller, I advise you introduce them into the utils folder or you create a new file for this purpose.

7. **Validator:** Validation is an essential need for every application. You can define Validators required by your application here. There is a **Base Validator** file which every new validator can choose to extend for additional functionalities and providing re-usability.

## Requirements

1. NodeJs with a minimum version of 14.
2. MongoDB installed.
3. Docker: All the docker configs for this application has been added to git-ignore but in case you're looking to speed up development, I suggest you use the docker-compose code below. Simply create a **docker-compose.yml file** and copy and paste the code snippet below.

```yml

version: "3.9"

services:
  # transtura_microservice:
  #   build: .
  #   container_name: transtura_microservice
  #   ports:
  #     - "3000:8000"
  #   links:
  #     - "transtura_database"
  #     - "transtura_redis"
  #   depends_on:
  #     - "transtura_database"
  #     - "transtura_redis"
  #   env_file:
  #     - ".env"
  transtura_database:
    image: mongo
    environment:
      MONGO_INITDB_DATABASE: transtura_database
      MONGO_INITDB_ROOT_USERNAME: transtura_user
      MONGO_INITDB_ROOT_PASSWORD: password_password
    ports:
      - "27017:27017"
  transtura_redis:
    image: redis
    container_name: transtura_redis
    ports:
      - "6379:6379"
```

Thank you presenting me with this oppurtunity and I hope to be a part of the team contributing my knowledge and re-learing during the process with the mindset of growing the company.. 

_Yours in code_

_Ilori Stephen Adejuwon(stephenilori458@gmail.com)_