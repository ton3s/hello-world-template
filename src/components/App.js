import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom'
import { Container, Card, ListGroup, ListGroupItem } from 'reactstrap'

// Data
import samplePolicies from '../data/policies.json'

// Components
import OPANavbar from './OPANavbar'

export default function OPAControlPlane() {
	const [policies] = useState(
		samplePolicies.result
			.filter((policy) => policy.id.startsWith('policies/'))
			.map((policy) => ({ id: policy.id, raw: policy.raw }))
	)
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredPolicies, setFilteredPolicies] = useState()

	// Load policies from OPA
	useEffect(() => {
		setFilteredPolicies(policies)
	}, [policies])

	// Needs to go through proxy/api since OPA server does not support CORs
	// https://github.com/open-policy-agent/opa/issues/2453
	useEffect(() => {
		// const loadPolicies = async () => {
		// 	const response = await axios.get('http://localhost:8181/v1/policies')
		// 	console.log(response.data)
		// 	setFilteredPolicies(response.data)
		// }
		// loadPolicies()
	})

	function handleSearch(searchTerm) {
		if (searchTerm) {
			const filtered = policies.filter((policy) => {
				const id = policy.id.toLowerCase().includes(searchTerm.toLowerCase())
				const raw = policy.raw.toLowerCase().includes(searchTerm.toLowerCase())
				return id || raw
			})
			setFilteredPolicies(filtered)
		} else {
			// Reset the list if there is no search term
			setFilteredPolicies(policies)
		}
		setSearchTerm(searchTerm)
	}

	const styles = {
		title: {
			fontWeight: '500',
			fontSize: '20px',
		},
		text: {
			paddingTop: '20px',
			paddingBottom: '20px',
			whiteSpace: 'pre-wrap',
		},
	}

	return (
		<Router>
			<OPANavbar searchTerm={searchTerm} handleSearch={handleSearch} />
			<div id='cards'>
				<Container>
					{filteredPolicies &&
						filteredPolicies.map((policy, index) => (
							<Card
								key={index}
								className='container justify-content-center animate__animated animate__flipInX'>
								<ListGroup flush>
									<ListGroupItem style={styles.title}>
										{policy.id}
									</ListGroupItem>
									<ListGroupItem style={styles.text}>
										{policy.raw}
									</ListGroupItem>
								</ListGroup>
							</Card>
						))}
				</Container>
			</div>
		</Router>
	)
}
