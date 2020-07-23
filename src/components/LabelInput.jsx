import React from 'react'

const LabelInput = ({ type, name }) => {
	return (
		<label htmlFor={name} className='block text-gray-700 text-sm font-bold mb-2 capitalize'>
			{`${name}:`}
			<input id={name} placeholder={name} type={type} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' required />
		</label>
	)
}

export default LabelInput
