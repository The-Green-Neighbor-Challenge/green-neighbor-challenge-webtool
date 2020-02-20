import React, {useEffect}  from 'react';

export default function SocialMedia() {

    /*
      Cookies associated with the social media buttons currenting flag an error in Chrome.
      It is looking for the SameSite attribute to be either secure, or not 'None'.
      This issue is, as of right now, unresolved.
    */

    // These use effect initialize the social media buttons by targeting and populating DOM elements
    useEffect(()=>{
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        document.getElementById("twitter-embed").appendChild(script)
    }, []);

    useEffect(()=>{
        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0";
        document.getElementById("facebook-embed").appendChild(script)
    }, []);

  return(
    <div className="cardContent">
        <div>
          <h2>Follow us on social media</h2>
          <h3>And share us with your neighbors!</h3>
        </div>

          <div className="socialMediaBox">
            <div id="twitter-embed">
                <a 
                    className="twitter-follow-button"
                    href="https://twitter.com/GreenNeighborCh?ref_src=twsrc%5Etfw"
                    rel="noopener noreferrer"
                    target="_blank"
                    data-size="medium"
                    data-show-count="default">
                        Follow @GreenNeighborCh
                </a>
            </div>

            <div id="facebook-embed">
                <div 
                    className="fb-like" 
                    data-href="https://www.facebook.com/GreenNeighborChallenge/" 
                    data-width="250" 
                    data-layout="standard" 
                    data-action="like" 
                    data-size="large" 
                    data-share="true">
                </div>
            </div>
          </div>
    </div>
  )
}