import { Suspense } from 'react'
import reactLogo from './assets/react.svg'
import { useTranslation } from 'react-i18next'
import viteLogo from '/vite.svg'
import './App.css'

function Welcome () {
  const {t, i18n} = useTranslation(['welcome'])

  function changeToEnglish(){
    i18n.changeLanguage('en')
  }
  function changeToSpanish(){
    i18n.changeLanguage('es')
  }
  function changeToFrench(){
    i18n.changeLanguage('fr')
  }
  return(
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <h1>
          {t('title')}
          <br />
        </h1>
        <p dangerouslySetInnerHTML = {{ __html: t('withname', {name: 'Caleb'})}} />
        <p>Idioma actual: {i18n.language}</p>
        <button onClick={changeToEnglish}>Cambiar a inglés</button>
        <button onClick={changeToSpanish}>Cambiar a español</button>
        <button onClick={changeToFrench}>Cambiar a francés</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

function App() {

  return (
    <Suspense fallback='Cargando traducciones....'>  
      <Welcome />    
    </Suspense>
  )
}

export default App
