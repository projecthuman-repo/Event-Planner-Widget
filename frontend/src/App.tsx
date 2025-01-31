import './App.css'
import EventSection from './components/eventComponents/EventSection'
import LeftSection from './components/LeftSection'
import Navbar from './components/Navbar'

function App() {

  return (
    <div className='w-[100vw] h-[100vh]'>
      <Navbar />
      <div className='flex w-[100%] h-[90vh]'>
        <LeftSection />
        <EventSection />
      </div>
    </div>
  )
}

export default App
