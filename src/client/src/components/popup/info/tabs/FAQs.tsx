function FAQs() {
    return (
        <div>
            <p><b>What is a "mile/kilometer of love"?</b></p>
            <p>
                Every time a new connection between two pins is created, the 
                number of miles/kilometers between the pins is added to the total count of 
                miles/kilometers of love in the world.
            </p>
            <br />
            <p><b>How was Notes From Afar created?</b></p>
            <p>
                Notes From Afar uses a TypeScript & React frontend combined with a
                Python & Django backend and a PostgreSQL database, all hosted on Heroku. It uses the
                Mapbox API for the globe, and 98.css as a starter
                template for the styling. You can find the entirety of the code in
                this repository. It is open-source, and I welcome community contributions :)
            </p>
            <br />
            <p><b>Why did you make Notes From Afar?</b></p>
            <p>
                [...]
                The more practical side of why I made it is that I needed another project
                in my portfolio so I could get a job. If anyone is hiring thoughtful, empathetic full-stack developers
                who can see a project through from conception to design to implementation to user testing, 
                hit me up!
            </p>
        </div>
    )
}

export default FAQs;