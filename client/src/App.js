import { BrowserRouter, Navigate, Routes, Route  } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "./scenes/loginPage";
import ProfilePage from "./scenes/profilePage";
import {useMemo} from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import state from "state";

function App() {

  //grabbing mode from our state // will help grab value from our initial state
  //useSelector: GET the state
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
  //whether they are logged in or not
  //if token exists - we are authorised
  const isAuth = Boolean(useSelector((state) => state.token));


  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />        
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/profile/:userId" element={isAuth ?<ProfilePage /> : <Navigate to="/" />} />
        </Routes>
        
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
