import React, { useState } from 'react'

const UploadPdf = () => {
	const [disabled, setDisabled] = useState(true)
	const handleSelect = (e) => {
		if (e.target.value && disabled) {
			setDisabled(false)
		} else if (!disabled) {
			setDisabled(true)
		}
	}
	return (
		<div className='flex justify-center'>
			<form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md space-y-3'>
				<label className='block text-gray-700 text-sm font-bold lg:hidden' htmlFor='template'>
          Formulario:
					<select id='template' className='block appearance-none w-full border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline' onChange={(e) => handleSelect(e)} required>
						<option value=''>---</option>
						<option value='rchprueba'>rchprueba</option>
					</select>
				</label>
				<div className='flex flex-col md:flex-row md:justify-around text-center space-y-2 md:space-y-0'>
					<div>
						<button className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`} type='button' disabled={disabled}>Subir</button>
					</div>
				</div>
				{/* <input className='truncate w-full' type='file' name='' id='' /> */}
				<p className='text-gray-600 text-xs italic'>Si no tienes el formulario deberas descargarlo y una vez haya completado los campos deberá subirlo.</p>
			</form>
		</div>
	)
}

export default UploadPdf
