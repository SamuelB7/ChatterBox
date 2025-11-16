Overview

ChatterBox company has a conversation system that their clients use to serve their own customers. The ChatterBox App was designed some time ago, and at that time it was decided to go with a monolith integrated with a ready-made market chatbot instead of adding complexity and designing the application in a distributed way, and AI was not a reality. You have been hired to start ChatterBox 2.0 with AI and rewrite the system. For the first phase, the company architect requested that you make a proof of concept as follows:

1) ChatterBox (API)
•⁠  ⁠A Rest API to maintain conversations
•⁠  ⁠Minimum stack defined by the Architect is NodeJS/Nestjs, and MongoDB

2) ChatterBox (Web)
•⁠  ⁠Web interface for viewing conversations
•⁠  ⁠Minimum stack defined by the Architect is ReactJS

As a developer, you know that in order to deliver this proof of concept to the Architect in a timely manner, you should use Docker to spin up a local infrastructure. The Architect would like to see in this proof of concept:

Minimum Requirements
a) When the user accesses, they can start a conversation
b) Messages are separated by who sent them, in this case between the user and the AI
c) The system must store and process conversation messages using AI to respond to the user
d) The AI will have an objective for this proof of concept, which will be "Convince the user that the earth is flat."

Requirements (optional)
e) Messages sent by AI are shown live to the user (using websocket)

Challenge Details
•⁠  ⁠The goal is not to have a complete system but rather a proof of concept to demonstrate the minimum requirements
•⁠  ⁠No authentication needed
•⁠  ⁠Remember that this is a proof of concept, be careful not to overcomplicate this solution

- Technical Considerations
Use of Docker for local infrastructure setup
Mono repository structure for both API and Web components
NestJS for API development and ReactJS for frontend development
MongoDB for data storage
Mongoose for data modeling
Usage of repository pattern
Unit tests for the API
Swagger documentation for the API
Usege of tailwindcss for styling the frontend
Keep the design minimalist and simple
Keep consistency in the design and user experience for the UI
For the frontend, use a simple architecture with components, services/api layer, and pages directories