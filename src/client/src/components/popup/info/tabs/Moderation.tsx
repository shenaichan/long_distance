type ModerationProps = {
    hasReadRules: boolean;
    setHasReadRules: (hasReadRules: boolean) => void;
}

function Moderation({ hasReadRules, setHasReadRules }: ModerationProps) {
    return (
        <div>
            <p>
                Each message submitted to Notes From Afar is reviewed by me (Shenai) before it is displayed to the public.
            </p>
            <br />
            <p><b>Rules:</b></p>
            <ol>
                <li>
                    All moderation is fully arbitrary in the sense that  
                    if you submit something that is not against any of these 
                    rules but which I find bad, it will not be allowed on the site.
                </li>
                <li>
                    The intent of these rules is not to police people, 
                    but instead to foster a welcoming digital space where people 
                    can have a good time expressing their love. The submissions 
                    I've received so far have done a fantastic job at that.
                </li>
                <li>
                    Racism, homophobia, transphobia, ableism, and anything else
                    that denies the humanity of another person are not allowed 
                    on this site. 
                </li>
                <li>
                    Keep it PG-13. Do not submit anything radically NSFW, including, but not limited to,
                    explicit sexual or violent content. I am not saying that
                    adult content has no place on the web, only
                    that if you would like to 
                    discuss these topics, you can use a different site.
                </li>
                <li>
                    Do not submit anything that compromises your or anyone else's anonymity. 
                    For example, I will not approve messages containing
                    last names, phone numbers, email addresses, 
                    social media handles, or exact addresses.
                    For your own safety, do not place pins directly on your home or work.
                </li>
                <li>
                    Understand that I am one person who has created this site
                    as a passion project, and I reserve the right to manage its contents,
                    as well as take it down if maintenance becomes untenable.
                </li>
            </ol>
            <br />
            <p>
                All that said, have fun sharing your affections on the internet :)
            </p>
            <br />
            <div>
                {/* <input type="checkbox" id="moderationRulesCheckbox" 
                    onChange={(e) => {
                        if (e.target.checked) {
                            // setHasReadRules(true);
                            e.target.disabled = true;
                        }
                    }}
                />
                <label htmlFor="moderationRulesCheckbox"><p>I have read and understood the moderation rules.</p></label> */}
                <button
                    onClick={() => {
                        setHasReadRules(true);

                    }}
                    disabled={hasReadRules}
                >I have read and understood the moderation rules.</button>
                <br/>
            </div>
            
        </div>
    );
}

export default Moderation