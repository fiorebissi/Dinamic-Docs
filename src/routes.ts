import { routesIndex } from './routes/routesIndex'
import { routesSecurity } from './routes/routesSecurity'
import { routesDocument } from './routes/routesDocument'
import { routesTemplate } from './routes/routesTemplate'
import { routesMailing } from './routes/routesMailing'
import { routesPdf } from './routes/routesPdf'

export const Routes = [
	...routesIndex,
	...routesSecurity,
	...routesDocument,
	...routesMailing,
	...routesPdf,
	...routesTemplate
]
