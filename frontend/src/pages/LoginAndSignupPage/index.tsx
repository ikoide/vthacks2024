import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useRef, useState } from "react";
// import "./assets/style.scss"
/// create interface for page

// can be EMAIL, PASSWORD, SIGNUP
enum Page {
  EMAIL,
  PASSWORD,
  SIGNUP
}


const LoginPageAndSignUp = ({ setUserData }: any): JSX.Element => {

    const email_ref = useRef<HTMLInputElement>(null);
    const password_ref = useRef<HTMLInputElement>(null);


    const[page, setPage] = useState<Page>(Page.EMAIL);


    const handleNext = () => {
      // if email page 
      if(page === Page.EMAIL){
        // check if email has an account in the database
        
      }
    }

  return (
    <>
      <div className="login">
          <div className="logo">
            <h1>HokieSwap</h1>
          </div>
          <div className="login-input-field">
            {
              page === Page.EMAIL ? (
                <TextField
                  inputRef={email_ref}
                  label="Email"
                  variant="outlined"
                  fullWidth
                />
              ) : page === Page.PASSWORD ? (
                <TextField
                  inputRef={password_ref}
                  label="Password"
                  variant="outlined"
                  fullWidth
                />
              ) : (
                <TextField
                  inputRef={email_ref}
                  label="Email"
                  variant="outlined"
                  fullWidth
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
