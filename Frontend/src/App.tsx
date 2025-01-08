import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Signup/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/profile"} element={<Profile/>}/>

            </Routes>
        </BrowserRouter>
    )
}

export default App;