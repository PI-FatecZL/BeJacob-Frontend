import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AccessibilityWidget } from './components/accessibility/AccessibilityWidget';
import { VLibrasWidget } from './components/accessibility/VLibrasWidget';

function App() {
  return (
      <BrowserRouter>
        <AccessibilityWidget />
        <VLibrasWidget />
        <AppRoutes />
      </BrowserRouter>
  )
}

export default App