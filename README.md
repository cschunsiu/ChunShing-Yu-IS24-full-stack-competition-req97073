# ChunShing-Yu-IS24-full-stack-competition-req97073

## Description
This project is for a competition to demonstrate programming capability as well as designing, architeture and ability to complete user stories.
It contains frontend and backend component, Backend component utilize NodeJS, Express and Swagger API and Frontend component utilize React.js framework. This application is about showing a list of products and display product associated info in a table.

## Prerequisities

This project uses docker to initialize application, therefore you must have docker installed in your local machine in order to run this application.
Details on how to install are in the followings:

[MacOS](https://docs.docker.com/desktop/install/mac-install/)

[Window](https://docs.docker.com/desktop/install/windows-install/)

[Linux](https://docs.docker.com/desktop/install/linux-install/)

After you installed docker, please ensure your docker is running properly before moving on to the installation step.
Please go to your console and run the following command.
`docker info`

if the following info is prompted, then you have launched docker successfully
<img width="644" alt="Screen Shot 2023-03-31 at 10 54 05 AM" src="https://user-images.githubusercontent.com/7381109/229194590-bf789186-4da5-41da-a001-7e9fc6832d22.png">



## Installation

1. Once you have docker installed and cloned the repo to your local machine, please redirect to your directory where this project is located.

2. Run `docker-compose up` command, this will create a docker image and load in the container.

3. If project has print out `Server started on port 3000`, then you have successfully launched the project.

## Usage

Open a web browser and put in `http://localhost:3000/` to launch the app

## Error may face

1. if you see this `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?` error, that means docker is not up and running yet. Please follow the step to install docker

