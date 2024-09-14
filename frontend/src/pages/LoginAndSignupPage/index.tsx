import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
const API_URL = import.meta.env.VITE_API_URL;
import { useRef, useState } from "react";

// import "./assets/style.scss"
/// create interface for page

// can be EMAIL, PASSWORD, SIGNUP
enum Page {
  EMAIL= "EMAIL",
  PASSWORD= "PASSWORD",
  SIGNUP= "SIGNUP"
}


const LoginPageAndSignUp = ({ setUserData }: any): JSX.Element => {

  const [password, setPassword]: any = useState("");
  const [email, setEmail]: any = useState("");
  const [name, setName]: any = useState("");

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  }

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  }

    const[page, setPage] = useState<Page>(Page.EMAIL);


    const handleNext = () => {

      // if email page 
      if(page === Page.EMAIL){
        // validate email regex
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        
        if(!emailRegex.test(email)){
          alert("Please enter a valid email");
          return;
        }

        // if not @vt.edu email 

        if(!email.includes("@vt.edu")){
          alert("Please enter a valid vt.edu email");
          return;
        }


        // check if email has an account in the database
        fetch(`${API_URL}/users?email=${email}`)
        .then((response) => response.json())
        .then((data) => {
          // data is an array, if its an empty array then theres no account
          console.log(data);
      
          if(data.length === 0){
            console.log("no account");
            setPage(Page.SIGNUP);
          } 
          else{
            setPage(Page.PASSWORD);
          }
        });

      }

      if(page === Page.PASSWORD){
        // log user and pass
        // check if password is correct
        fetch(`${API_URL}/users/${email}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: password
          })
        })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('session', data);

          // fetch /users/session
          fetch(`${API_URL}/users/session`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
        });
      }

      if(page === Page.SIGNUP){
        // validate data
        if(name === "" || email === "" || password === ""){
          alert("Please fill out all fields");
          return;
        }
        // create account
        fetch(`${API_URL}/users/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password
          })
        })

      }
    }

  return (
    <>
      <div className="login">
          <div className="logo">
            <h1>HokieSwap</h1>
            <h1>PAGE: {page.toString()}</h1>
          </div>
          <div className="login-input-field">
          {
              page === Page.SIGNUP && (
                <TextField
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={handleNameChange}
                />
              )
            }
            {
                <TextField
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                />
            }
            {
              page === Page.PASSWORD || page === Page.SIGNUP && (
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              )
            }
            
          </div>
        </div>
        <Button
          variant="contained"
          className="login-button"
          onClick={handleNext}
        >
          Next
        </Button>
    </>
  );
};

export default LoginPageAndSignUp;
