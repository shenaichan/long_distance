![Hero Image](hero_image.png)
<h2 align="center"><i>Notes From Afar</i></h2>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"
  </a>
    <img alt="Version 1.0.0" src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge"
</p>


### Intro
Notes From Afar is a site where you can leave anonymous messages about your long distance friendships, relationships, and family. It also functions as a communally constructed digital archive and ode to long distance love. It's the 2020's, and it's easier than ever to love people who live far away from you, but it's still incredibly difficult. So let's talk about it.


### Built With
- ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)
- ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge)
- ![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white&style=for-the-badge)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)


## Table of Contents
- [Features](#features)
- [High-Level Design Considerations](#high-level-design-considerations)
- [UI/UX Testing and Iteration](#uiux-testing-and-iteration)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Acknowledgements](#acknowledgements)
- [License](#license)


## Features
NFA is both a digital archive and social network. Users can:
- Write a message, which involves
  - Writing the contents of the message (e.g. "love you! miss you!")
  - Choosing a "source" pin
    - Can select a location on the map...
    - or, if the user already owns/has created a pin, they can select from one of their existing pins
  - Choosing a "destination" pin
    - Can select a location on the map...
    - or, if the user has a friend who has used the site, they can ask the friend for their "friend code" -- a special string that allows the user to write to their friend's existing pin
- Once a user writes a message, they receive a secret "reply link"
  - If they send this link to their friend, their friend has the opportunity to claim ownership of the "destination" pin and write a response back to the user
- See every created note and pin by clicking on the lines and circles on the globe
- See all the pins created in/owned by their browser (since there are no user accounts, pins are "owned" by a given browser -- stored in localStorage)
  - Also, see all the messages sent from and received by all their pins
- Give another browser ownership of a created pin by opening a pin's "editor link" in a new browser

These features arose from a couple rather "basic" requirements with complicated implications:
- Users should be able to write to multiple friends
- Users should be able to write back to friends


## High-Level Design Considerations
NFA was greatly inspired by [Queering the Map](https://www.queeringthemap.com/), a "community generated counter-mapping platform for digitally archiving LGBTQ2IA+ experience in relation to physical space". On QTM, users can drop geospatially situated notes about their queer experiences. I love this concept -- an anonymous, communally-constructed digital archive. I love how the site offers so much and asks for so little in return. And I love how frictionless and open it is. 

More and more we see platforms that are walled gardens, content teased and then locked behind the prerequisite of account creation. And then once you make an account, you're bombarded by a slurry of push notifs, shiny sounds and images, and other interactions designed specifically to pull you in and hold you there, for hours. 

I designed NFA in pursuit of open, communal creation. Of a delightful, love-filled experience that allows you to come exactly as you are and leave exactly when you want. There are no user accounts and no notifications, only a simple message writing interface and a whole world of anonymous love letters at your fingertips.

Using the design language of Windows '98, I aim to elicit nostalgia for an earlier age of the internet, specifically evoking the coziness of small forums. The abilities to resize and drag the windows introduce a sense of play and agency stripped from modern user interfaces -- consider the programmatic uniformity of Instagram compared to the expressivity of MySpace. The 3D spinning globe also suggests an 00's era optimism about the future of the "world wide web". Perhaps it's a bit cheesy, and terribly naïve, but I think the only way forward into a better future for the internet is to adopt that hope for a deeply, healthily interconnected society, and to build things in alignment with it.

 However, I also remix the original 90's/00's design system with more contemporary color sensibilities. I embrace the technical capabilities of the modern internet and personal computer to allow for a hyper-responsive WebGL globe object rendered in the browser. I use OpenAI's content moderation API as an imperfect, yet still powerful and newly-possible first line of defense against hateful or inappropriate content. I am interested in learning from the past, certainly, but moving forward also involves working with newer, more capable tools.
 
 My aesthetic decisions were carefully made in support of my thematic vision. Of course the internet was never perfect, and never will be perfect, but maybe if we pull from what was and is best about the history and current reality of the internet, we can move closer to a better social web. 
 
 Notes From Afar is a love letter to what was and is beautiful about the internet of the 90's, the 00's, the 10's, the 20's, and beyond. If even one person leaves or sees a note and is delighted, I'd consider this project time well-spent :)


## UI/UX Testing and Iteration
Notes From Afar underwent various [UI redesigns](https://www.figma.com/slides/0uwWmWN9idMXtDOhtBDvtH/Notes-From-Afar-Redesign-Highlights?node-id=1-537&t=pvZ8pXcMriVE6IDN-1), ultimately landing on a retro, "windows over a globe" structure, with one window for information, one for writing a message, and one for "things this browser owns". I was pretty inspired by game UIs (see: "inventory").

NFA's message creation UX also evolved over time. Most notably, at one point, it consisted of a very linear, opinionated flow. That is, you had to make a source pin --> confirm that source pin --> see all the options in that pin's menu --> choose to write a new note --> choose whether to write to an existing pin or make a new one --> choose a destination location if applicable --> confirm that destination pin --> write a message --> close the menu. A lot of important context was getting lost ("wait, so where did I put the original pin?"), and unnecessary context was introduced (all the options for the first pin). 

I conducted a few user experience tests, mostly assigning a task to a friend and having them talk aloud as they attempted to complete the task. I observed things like: where they looked for the next option, how long it took for them to complete various subtasks, and their emotional state at various points in the process. At the end, I asked a few follow up questions to try and identify points of friction/confusion or aspects of the design they appreciated.

I'm pleased with how the final message creation UX ended up -- all the context necessary for creation is maintained, and no irrelevant options are presented. Users can choose to write the message first, or set the source first, or set the destination first. There are reasonable paths back to reset the creation process. Options for a subpath are only presented once the user enters that subpath (e.g., you don't see the "existing pins" dropdown until you've decided you want to select from existing pins) -- complexity is generally obscured until the very last second before a decision needs to be made about it. However, I'm definitely thinking of going back and conducting some more user testing on this project once I've got the time!


## Frontend Architecture
There are only a few *major* components in my app:
- [The map](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/map/Map.tsx), which renders a MapboxGL globe object with data visualization layers on top for pins and relationships between the pins. It also assigns event handlers for various interaction events, like clicks, drags, and scrolls.
- [The menus](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/Menu.tsx):
  - [Info](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/info/Info.tsx), the information menu on the left side of the screen, which also contains some controls for the map
  - [Write](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/write/Write.tsx), the message writing interface
  - [Inventory](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/inventory/Inventory.tsx), the collection of pins and messages that browser "owns"
- [The popups](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/Popup.tsx):
  - [Pin](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/create/PinMenu.tsx), the popup that shows a given pin's friends, as well as special links if the browser owns that pin
  - [Message](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/create/MessageMenu.tsx), the popup that shows a message between two pins, and the response if a response exists

In terms of state management, several variables (namely, those required by 2-3+ major components and their sub-components) are encapsulated in a [useContext](https://github.com/shenaichan/long_distance/blob/main/src/client/src/state/ContextProvider.tsx) hook. 

I originally created many of these variables via useState in [App](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/App.tsx), and explicitly passed them down to individual children components, but ultimately this became rather unwieldy, as these variables were eventually required in a great number of nested components. I realized I wanted a cleaner solution than prop-drilling up and down several layers of the component tree, and thus, the useContext was born.

Some of my components still manage state locally -- for example, [Write](https://github.com/shenaichan/long_distance/blob/main/src/client/src/components/popup/write/Write.tsx) maintains several state hooks for managing the state of the message and pin creation. I had to make a great number of judgement calls to decide how to scope each of my state variables.


## Backend Architecture
My Django backend is essentially just a REST API for my frontend. It is entirely specified in [api.py](https://github.com/shenaichan/long_distance/blob/main/src/server/longdist/api.py). I define schemas for data coming in and going out, and for each endpoint, I make a query to my database that fulfills the interface exposed to the client. My frontend calls my backend in [api.tsx](https://github.com/shenaichan/long_distance/blob/main/src/client/src/api/api.tsx), and has sister-schemas specified (i.e., "MessageIn" on the backend is "MessageOut" on the frontend). 

I enjoyed being able to type my data well both on the frontend (using TypeScript) and the backend (using Django Ninja). This helped me match up data forms over the network -- a lot of bugs got caught immediately on entrance or exit from a given API endpoint.


## Database Design
I used the Django ORM to define my tables in a database-agnostic manner. As specified in [models.py](https://github.com/shenaichan/long_distance/blob/main/src/server/longdist/models.py), I have five tables:
- Pin, which stores all the relevant data for a given source or destination location
- Message, which stores primarily the contents of a message or response
- Relationship, which associates messages with source/destination pins
- MapLoadLog, which keeps track of how many times the "map load" API call is made to manage API costs
- GeolocateLog, which behaves similarly to MapLoadLog, but for retrieving place names based on latitude-longitude pairs

The overarching data model is essentially that of a sparsely-connected graph network stored by nodes (pins) and edges (relationships), with special data associated with edges (the messages).


## Acknowledgements
Notes From Afar uses the <a href="https://docs.mapbox.com/mapbox-gl-js/guides">Mapbox API</a> for the globe, 
the <a href="https://platform.openai.com/docs/guides/moderation">OpenAI API</a> for content moderation,
and <a href="https://jdan.github.io/98.css/">98.css</a> as a starter
template for the styling.

Additionally, I want to extend my deepest gratitude to all at the <a href="https://www.recurse.com/">Recurse Center</a> for housing and 
nurturing me and this project. Thank you to everyone who listened 
to my ideas, pointed me in the right direction, and helped me through 
frustrating bugs, including, but certainly not limited to: 
Ubani Balogun, Justin Bennett, Miriam Budayr, Jesse Chen, 
Ian Fisher, Daniel Friedman, Ryan Goldstein, Sharp Hall, 
Eric Hayes, Rhys Hiltner, Jeremy Kaplan, River Dillon Keefer, 
Margot Kriery, Lucy McPhail, Liam McCracken, Aurora Nou, 
Julian Ordaz, Konarak Ratnakar, Nolen Royalty, 
Sam Straus, Michael Suguitan, Kenneth Sylvain, Christina Tran,
and many others. Thank you as well to my dear non-RC friends who assisted: Ada Martin and Caroline Pastrano.
Making this was a great endeavor, and I'm happy to call it my brainchild, but it truly does take a village. 


## License
Notes From Afar is licensed under the MIT License Copyright (c) 2024.

See the [LICENSE](https://github.com/shenaichan/long_distance/blob/main/LICENSE) for information on the history of this software, terms & conditions for usage, and a DISCLAIMER OF ALL WARRANTIES.

All trademarks referenced herein are property of their respective holders.
