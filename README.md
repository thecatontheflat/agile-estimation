[![Build Status](https://travis-ci.org/thecatontheflat/agile-estimation.svg?branch=develop)](https://travis-ci.org/thecatontheflat/agile-estimation)

# Agile Estimation

## Demo Video

https://www.youtube.com/watch?v=pWf9A_qUUj4

## What is this?

"Agile Estimation 3.0" is an online tool based on the Team Estimation Game by Steve Bockman. It is designed for agile teams who estimate their effort for certain tasks.

I call it 3.0 because I believe that this is the next level. Therefore this tool is considered to aim advanced agile people. I am not covering basic agile and estimation topic here.

For more information about estimation, please refer to the [Almighty](http://google.com)

## The Idea

The idea of the “next generation estimation” is to increase performance and accuracy of estimation and reduce time waste at the same time. See, the main cause of slowness in the planning poker technique is that players have to make turns blindly.

With comparative approach, players don’t estimate blindly and therefore the time is saved.

## Live Demo

Here you can find the working and usable project:
http://estimation.agile-values.com/

# Installation

### Requirements

* node.js
* mongodb
* npm


### How to run it locally

##### Clone the project
```
git clone git@github.com:thecatontheflat/agile-estimation.git
```

##### Copy and edit config
```
cd agile-estimation
cp config.json.dist config.json
```

##### Install node dependencies
```
npm install
```

##### Run the application
```
node server.js
```

The application will be accessible via 3004 port

http://localhost:3004/
