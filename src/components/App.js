import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import { BrowserRouter as Router } from 'react-router-dom'
import { Container, Card, ListGroup, ListGroupItem, Button } from 'reactstrap'

// Data
import samplePolicies from '../data/policies.json'

// Components
import OPANavbar from './OPANavbar'

// Libraries
import ReactBSAlert from 'react-bootstrap-sweetalert'

export default function OPAControlPlane() {
	const [policies] = useState(
		samplePolicies.result
			.filter((policy) => policy.id.startsWith('policies/'))
			.map((policy) => getPolicy(policy))
	)
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredPolicies, setFilteredPolicies] = useState()

	// Utility
	const [alert, setAlert] = React.useState(null)

	const hideAlert = () => {
		setAlert(null)
	}

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

	// Return a policy object { id, raw, metadata }
	function getPolicy(policy) {
		let policyObj = {
			id: policy.id,
			raw: policy.raw,
		}
		const metadata = getMetadata(policy.raw)
		if (Object.keys(metadata).length) {
			policyObj.metadata = metadata
		}
		return policyObj
	}

	function getMetadata(policy) {
		const metadataArr = policy
			.split('\n')
			.filter((line) => line.trim().startsWith('#'))
			.map((comment) => comment.substring(1).trim())
			.map((comment) => comment.split(/:(.*)/s))
			.filter((words) => words.length > 1)
			.map((words) => ({ [words[0]]: words[1] }))
		const metadata = Object.assign({}, ...metadataArr)
		return metadata
	}

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

	function displayMetadata(metadata) {
		if (metadata && metadata.url) {
			console.log(metadata)
			displayAlert(
				`${metadata.url}`,
				'Prompt',
				`Edit Policy?`,
				() =>
					window.open(metadata.url, '_blank') ||
					window.location.replace(metadata.url)
			)
		} else {
			displayAlert('No url metadata associated with this policy!', 'Error')
		}
	}

	function displayAlert(message, type, title, callback) {
		const successTitles = ['Nice!', 'Awesome!', 'Good Job!']
		let randomSuccessTitle =
			successTitles[Math.floor(Math.random() * successTitles.length)]

		switch (type) {
			case 'Success': {
				setAlert(
					<ReactBSAlert
						success
						style={{ display: 'block', margin: 'auto' }}
						title={randomSuccessTitle}
						onConfirm={() => hideAlert()}
						onCancel={() => hideAlert()}
						confirmBtnBsStyle='info'
						btnSize=''>
						{message}
					</ReactBSAlert>
				)
				break
			}
			case 'Prompt': {
				setAlert(
					<ReactBSAlert
						warning
						style={{ display: 'block', margin: 'auto' }}
						title={title}
						onConfirm={() => {
							if (callback) callback()
							hideAlert()
						}}
						onCancel={() => hideAlert()}
						confirmBtnBsStyle='info'
						showCancel
						cancelBtnBsStyle='danger'
						btnSize=''>
						{message}
					</ReactBSAlert>
				)
				break
			}
			case 'Error': {
				setAlert(
					<ReactBSAlert
						error
						style={{ display: 'block', margin: 'auto' }}
						title='Uh Oh!'
						onConfirm={() => hideAlert()}
						onCancel={() => hideAlert()}
						confirmBtnBsStyle='danger'
						btnSize=''>
						{message}
					</ReactBSAlert>
				)
				break
			}
			default: {
			}
		}
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
		button: {
			fontSize: '20px',
		},
	}

	return (
		<Router>
			<OPANavbar searchTerm={searchTerm} handleSearch={handleSearch} />
			<div id='cards'>
				<Container className='container'>
					{alert}
					{filteredPolicies &&
						filteredPolicies.map((policy, index) => (
							<Card
								key={index}
								className='container justify-content-center animate__animated animate__flipInX'>
								<ListGroup flush>
									<ListGroupItem style={styles.title}>
										{policy.id}
										<Button
											style={styles.button}
											className='btn-rotate'
											color='neutral'
											onClick={() => displayMetadata(policy.metadata)}>
											<i
												className='fa fa-pencil-square-o'
												aria-hidden='true'></i>
										</Button>
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
