import React from 'react'
import { useHistory } from 'react-router-dom'
import {
	Button,
	FormGroup,
	Form,
	Input,
	NavbarBrand,
	Navbar,
	Container,
} from 'reactstrap'

const styles = {
	title: {
		fontSize: '24px',
		color: 'white',
		padding: '5px 0px 5px',
	},
	search: {
		width: '250px',
	},
	close: {
		top: '0px',
	},
	btn__padding: {
		padding: '0',
	},
	nav: {
		padding: '0px 0px',
	},
}

export default function OPANavbar({ searchTerm, handleSearch }) {
	const history = useHistory()

	function navigateHome() {
		history.push('/')
	}

	return (
		<>
			<Navbar color='danger' expand='lg' style={styles.nav}>
				<Container>
					<NavbarBrand
						className='col-md-8 text-center text-md-left animate__animated animate__fadeInDownBig'
						style={styles.title}
						onClick={navigateHome}>
						OPA Control Plane
					</NavbarBrand>
					<Form className='form-inline ml-auto col-md-4 justify-content-center'>
						<FormGroup className='has-white'>
							<Input
								className='animate__animated animate__flipInX'
								style={styles.search}
								placeholder='Search'
								type='text'
								value={searchTerm}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormGroup>
					</Form>
				</Container>
			</Navbar>
		</>
	)
}
