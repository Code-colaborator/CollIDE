import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Home() {
  const location = useLocation();

  return (
    <div className="homepage">
      <h1>
        Hi we are unknown for each other...<br></br>
        <br></br>
        I'm Bablu Singh from Bihar <br></br>
        <br></br>
        Insta I'd- @bablusingh023<br></br>
        <br></br>
        Work from home 🏡<br></br>
        👇<br></br>
        mera ek online project h<br></br>
        So Kay aap chahte ho apni study/job ke sath 15k to 20k earn kerna
        <br></br>
        Agr aap chahte h to Drop your 👇<br></br>
        Name...<br></br>
        Age...<br></br>
        City...
      </h1>
    </div>
  );
}

export default Home;
