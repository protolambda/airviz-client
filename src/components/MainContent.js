import {Switch, Route} from 'react-router-dom';
import React from "react";
import Graph from "./screens/Graph";
import About from "./screens/About";
import ScrollToTop from "./util/ScrollToTop";

const MainContent = ({...props}) => {
    return (
        <main {...props}>
            <ScrollToTop/>
            <Switch>
                <Route exact path='/' component={Graph}/>
                <Route exact strict={false} path='/about' component={About}/>
            </Switch>
        </main>
    );
};

export default MainContent;
