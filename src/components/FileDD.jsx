import React from 'react'
import Swal from 'sweetalert2'

const FileDD = ({ templatedSelected, setDataDOM }) => {
	const handleClick = (e) => {
		e.preventDefault()
		if (templatedSelected === null) {
			Swal.fire('Ramon Chozas S.A', 'Debe seleccionar un template!', 'warning')
		} else {
			const formData = new FormData(document.forms.namedItem('formCsv'))
			formData.append('delimiter', ';')
			formData.append('name_template', templatedSelected.data.name)
			const miInit = {
				method: 'POST',
				body: formData
				// credentials: 'include',
			}
			fetch('http://www.rchdynamic.com.ar/dd/document/excel/', miInit)
			// fetch('http://localhost:3000/dd/document/create/excel', miInit)
				.then((response) => response.json())
				.catch((error) => {
					console.log(error)
					return { ...error, type: 'error' }
				})
				.then((response) => {
					console.log(response)
					if (response.type === 'error') {
						Swal.fire(
							'Ramon Chozas S.A',
							response.message,
							'error'
						)
					} else {
						Swal.fire('Ramon Chozas S.A', `Datos Cargados y Generados. Se cargaron ${response.body.count} Registros`, 'success')
						setDataDOM(response)
					}
					// Swal.fire({
					//   icon: 'question',
					//   title: '¿Le gustaría enviarlo por mail?',
					//   confirmButtonText: 'Si',
					//   cancelButtonText: 'No',
					//   showCancelButton: true,
					//   reverseButtons: true,
					//   allowOutsideClick: false,
					// }).then((resolve) => {
					//   if (resolve) {
					//     setStep(1);
					//     setDataMailing({
					//       send: true,
					//       ...dataSend.current,
					//     });
					//   }
					// });
				})
		}
	}

	return (
		<form encType='multipart/form-data' method='post' name='formCsv'>
			<input className='px-4 py-2 m-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline' type='file' name='fileCSV' id='file' required />
			<div className='text-center'>
				<button onClick={(e) => handleClick(e)} className='px-4 py-2 m-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline' type='button' value='Enviar'>Confirmar</button>
			</div>
		</form>
	)
}

export default FileDD
