import { useNavigate, Link } from "react-router-dom";
import landingPageImg from "../assets/landingPageImg.png";
import "../App.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Apna Video Call</h2>
        </div>
        <div className="navList">
          <p onClick={() => 
            window.location.href = "/joined-as-guest"
          }>Join as Guest</p>
          {/* <p>Register</p> */}
          <div role="button" className="authButton">
            <Link to={"/auth?mode=signup"}>Register</Link>
          </div>
          <div role="button" className="authButton">
            <Link to={"/auth?mode=signin"}>Login</Link>
            
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            {" "}
            <span style={{ color: "#FF9839" }}>Connect</span> with your loved
            Ones
          </h1>
          <p className="">Cover a distance by Apna Video Call</p>
          <div role="button" onClick={() => navigate("/home")} >
            <Link to={"/home"} >Get Started</Link>
          </div>
        </div>
        <div className="landingMainImage">
          <img src={landingPageImg} alt="heroImg" />
        </div>
      </div>
    </div>
  );
}
