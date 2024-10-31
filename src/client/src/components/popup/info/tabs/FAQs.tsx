function FAQs() {
    return (
        <div>
            <p><b>I want to hire you as a software engineer!</b></p>
            <p>
                That's not a question, but I'd love to talk! You can email me at
                shenaiwc [at] gmail [dot] com. Feel free to check out my <a href="https://shenaichan.github.io/">portfolio</a> as well.
            </p>
            <br />
            <p><b>What is a "mile/kilometer of love"?</b></p>
            <p>
                Every time a new connection between two pins is created, the 
                number of miles/kilometers between the pins is added to the total count of 
                miles/kilometers of love in the world.
            </p>
            <br />
            <p><b>What is a "friend code"?</b></p>
            <p>
                Once you make a pin, you can navigate to the "My pins" tab in "My inventory".
            </p>
            <br/>
            <p>
                From there, you can click on that pin, and then get the secret friend code
                associated with that single pin (not all your pins!). 
            </p>
            <br/>
            <p>
                If you share it with your friends, they can input it
                into the "to" field in the message box, and you'll receive their message.
            </p>
            <br />
            <p><b>What is an "editor link" and how does my computer know what pins I've made?</b></p>
            <p>
                The pins you create are stored in your browser's local storage. That means
                they are accessible only in that browser, and to everyone that uses that browser.
            </p>
            <br/>
            <p>
                Sometimes, you or your browser might clean out the browser's local storage.
                To avoid losing access to a pin, you can copy the editor link into any 
                browser, which will give that new browser access to the pin. This means
                you can continue writing notes from that same pin.
            </p>
            <br />
            <p><b>Why did my message get rejected?</b></p>
            <p>
                Notes From Afar uses <a href="https://platform.openai.com/docs/guides/moderation">OpenAI's content moderation API</a> to decide
                whether or not a message can go up on the site. This ameliorates
                moderation load for me while also allowing most users to post messages
                in real time. I recognize that this has limitations, but I feel that given my limited time and labor,
                combined with my desire to foster a digital space free from
                hate speech or offensive content, this is 
                an appropriate, though imperfect, solution.
            </p>
            <br />
            <p><b>How was Notes From Afar created?</b></p>
            <p>
                Notes From Afar uses a TypeScript & React & Vite frontend combined with a
                Python & Django backend and a PostgreSQL database, all hosted on <a href="https://render.com/">Render.com</a>. 
                It uses the <a href="https://docs.mapbox.com/mapbox-gl-js/guides">Mapbox API</a> for the globe, 
                the <a href="https://platform.openai.com/docs/guides/moderation">OpenAI API</a> for content moderation,
                and <a href="https://jdan.github.io/98.css/">98.css</a> as a starter
                template for the styling. You can find the entirety of the code 
                in <a href="https://github.com/shenaichan/long_distance">this repository</a>, so feel free to get nosy :)
            </p>
            <br />
            <p><b>Why did you make Notes From Afar?</b></p>
            <p>
                In short, I'm interested in adding avenues of serendipity and caretaking to 
                relationships that, for one reason or another, might not have the privilege
                of physical presence. I'm interested in the special rituals associated
                only with long-distance relationships -- i.e., how you carve out time for one another
                despite the physical distance. These rituals are infinitely precious to me.
            </p>
            <br/>
            <p>
                Though, the more practical side of why I made it is that I wanted another project
                in my portfolio for job applications. If anyone is hiring thoughtful, empathetic full-stack developers
                who can see a project through from conception to design to implementation to user testing to deployment, 
                hit me up!
            </p>
        </div>
    )
}

export default FAQs;