import React, { useState, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom'

// Components
import CandleNavbar from './OPANavbar'

export default function OPAControlPlane() {
	const [policies, setPolicies] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredPolicies, setFilteredPolicies] = useState()

	useEffect(() => {
		setFilteredPolicies(policies)
	}, [policies])

	function handleSearch(searchTerm) {
		if (searchTerm) {
			const filtered = policies.filter((policy) => {
				return policy.toLowerCase().includes(searchTerm.toLowerCase())
			})
			setFilteredPolicies(filtered)
		} else {
			// Reset the list if there is no search term
			setFilteredPolicies(policies)
		}
		setSearchTerm(searchTerm)
	}

	return (
		<Router>
			<CandleNavbar searchTerm={searchTerm} handleSearch={handleSearch} />
		</Router>
	)
}
