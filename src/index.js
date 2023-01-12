import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'

// styles
import 'assets/css/bootstrap.min.css'
import 'assets/css/paper-kit.css'
import 'assets/demo/demo.css'
import 'assets/demo/react-demo.css'

const container = document.getElementById('app')
const root = createRoot(container)
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
