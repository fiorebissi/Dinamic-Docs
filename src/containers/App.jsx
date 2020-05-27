import React from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import Login from '../pages/Login';
import Index from '../pages/Index';
import HomeHeader from '../components/HomeHeader';
import IndexPpal from '../pages/IndexPpal';
import Pdf from '../pages/Pdf';
import FirmaDigital from '../pages/FirmaDigital';

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/form' />
        </Route>
        <Route path='/form'>
          <ScrollToTop />
          <Login />
        </Route>
        <Route path='/header'>
          <ScrollToTop />
          <HomeHeader title='Header' />
        </Route>
        <Route path='/home'>
          <Switch>
            <Route exact path='/home'>
              <ScrollToTop />
              <HomeHeader title='Home' />
              <IndexPpal />
            </Route>
            <Route path='/home/documentosDinamicos'>
              <ScrollToTop />
              <HomeHeader title='Documentos Dinamicos' />
              <Index />
            </Route>
            <Route path='/home/pdfs'>
              <ScrollToTop />
              <HomeHeader title='Pdfs' />
              <Pdf />
            </Route>
            <Route path='/home/firmar/:id'>
              <ScrollToTop />
              <HomeHeader title='Firmar' />
              <FirmaDigital />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
