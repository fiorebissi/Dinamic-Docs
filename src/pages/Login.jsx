import React from 'react'
import { Switch, Route } from 'react-router-dom'
import FormContainer from '../components/login/FormContainer'
import NuevaPass from '../components/login/NuevaPass'
import ForgetPass from '../components/login/ForgetPassContainer'
import Logo from '../assets/static/logo_chozas2.png'
import '../assets/styles/login.css'
import 'tippy.js/dist/tippy.css'

const Home = () => {
	return (
		<main className='w-full h-full Login'>
			<div id='inicio' className='flex flex-col items-center justify-center w-full h-full'>
				<div className='w-48 mb-8' id='imgChozas'>
					<img className='object-contain w-full h-full' src={Logo} alt='Logo' />
				</div>
				<div className='div__forms'>
					<Switch>
						<Route exact path='/form'>
							<FormContainer />
						</Route>
						<Route path='/form/olvido'>
							<ForgetPass />
						</Route>
						<Route path='/form/expired'>
							<NuevaPass />
						</Route>
					</Switch>
				</div>
			</div>
		</main>
	)
}

export default Home
