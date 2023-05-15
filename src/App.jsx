import React from 'react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Callback } from './Pages/Callback';
import './App.css';

function App() {
    return (
        <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
                <Routes>
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />}/>
                </Routes>
            </BrowserRouter>
        </SnackbarProvider>
    );
}

export default App;
