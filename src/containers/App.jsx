import React from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import Login from '../pages/Login';
import Index from '../pages/Index';
import FormClientContainer from '../components/FormClientContainer';
import FileForm from '../components/FileForm';
import HomeHeader from '../components/HomeHeader';
import IndexPpal from '../pages/IndexPpal';

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
            <Route path='/home/Pdfs'>
              <ScrollToTop />
              <HomeHeader title='Pdfs' />
              {/* //PDFsForm */}
            </Route>
          </Switch>
        </Route>
        <Route path='/home'>
          <Switch>
            <Route exact path='/home/formularioCliente'>
              <ScrollToTop />
              <HomeHeader title='Formulario Cliente' />
              <FormClientContainer />
            </Route>
            <Route path='/home/fileForm'>
              <ScrollToTop />
              <HomeHeader title='Formulario Cliente (Csv)' />
              <Index />
            </Route>
            <Route path='/home/fileForm'>
              <ScrollToTop />
              <HomeHeader title='Formulario Cliente (Csv)' />
              <FileForm />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
