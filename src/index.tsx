import ReactDOM from "react-dom/client"
import "./index.css"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js"
import App from "./App"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(<App />)
