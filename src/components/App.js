import React, { useState, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom'
import { Container, Card, ListGroup, ListGroupItem } from 'reactstrap'

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

	const styles = {
		section: {
			padding: '30px 0',
			height: '100vh',
		},
		text: {
			paddingTop: '20px',
			paddingBottom: '20px',
			whiteSpace: 'pre-wrap',
		},
	}

	const string =
		'package policies.sms.reader\nimport data.policies.shared.util\n\nroles := ["fortress", "knights"]\nprivileges := [\n  { "resource": "sms", "action": "get" }\n]\n\nallow["allowed by policies.sms.reader"] {\n  util.is_authenticated(roles)\n  util.is_authorized(privileges)\n}'
	console.log(string)

	return (
		<Router>
			<CandleNavbar searchTerm={searchTerm} handleSearch={handleSearch} />
			<div style={styles.section} className='section-gray' id='cards'>
				<Container>
					<Card className='container justify-content-center animate__animated animate__flipInX'>
						<ListGroup flush>
							<ListGroupItem>policies/sms/reader.rego</ListGroupItem>
							<ListGroupItem style={styles.text}>{string}</ListGroupItem>
						</ListGroup>
					</Card>
				</Container>
			</div>
		</Router>
	)
}
