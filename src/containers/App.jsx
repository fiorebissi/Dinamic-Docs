import React from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import Login from '../pages/Login';
import Documento from '../pages/Documento';
import HomeHeader from '../components/HomeHeader';
import Index from '../pages/Index';
import Pdf from '../pages/Pdf';
import VerFirma from '../pages/VerFirma';
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
              <Index />
            </Route>
            <Route path='/home/documentosDinamicos'>
              <ScrollToTop />
              <HomeHeader title='Documentos Dinamicos' />
              <Documento />
            </Route>
            <Route path='/home/pdfs'>
              <ScrollToTop />
              <HomeHeader title='Pdfs' />
              <Pdf />
            </Route>
            <Route exact path='/home/firmar/verFirma'>
              <ScrollToTop />
              <HomeHeader title='Ver Firma' />
              <VerFirma />
            </Route>
            <Route path='/home/firmar/:hash/:id'>
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
