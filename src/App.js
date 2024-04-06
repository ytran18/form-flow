import React from "react";

import { Routes, Route, HashRouter } from 'react-router-dom';
import AppRoutes from "./routes.js";

import './App.css';

function App() {
    return (
        <HashRouter>
            <Routes>
                {
                    AppRoutes.map((item, index) => {
                        const Page = item.Component;
                        return (
                            <Route 
                                key={index}
                                path={item.path}
                                element={
                                    <Page />
                                }
                            />
                        )
                    })
                }
            </Routes>
        </HashRouter>
    );
}

export default App;
