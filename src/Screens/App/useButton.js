import { useEffect, useState } from "react"
import { SCREENS } from "../../Utils"

const useButton = ({
    currentScreen,
    setCurrentScreen,
    setComments,
    saveDocument,
    documents,
    setDocuments,
    convertedDocuments,
    setConvertedDocuments,
    proccess
}) => {
    const [buttonState, setButtonState] = useState({
        isPrimaryActive: false,
        isSecondaryActive: false,
        onPrimaryClick: () => { },
        onSecondaryClick: () => { },
        primaryTitle: 'Vazhdo',
        secondaryTitle: 'Mbrapa'
    })

    const reset = () => {
        setConvertedDocuments({
            original: '',
            translated: ''
        })
        setDocuments([null, null])
    }

    useEffect(() => {
        if (currentScreen.index === 0) {
            if (documents?.filter(item => item !== null)?.length < 2) {
                setButtonState({
                    isPrimaryActive: false,
                    isSecondaryActive: false,
                    onPrimaryClick: () => { },
                    onSecondaryClick: () => { },
                    primaryTitle: 'Vazhdo',
                    secondaryTitle: 'Anullo'
                })
            } else {
                setButtonState({
                    isPrimaryActive: true,
                    isSecondaryActive: true,
                    onPrimaryClick: () => { setCurrentScreen(prev => SCREENS.filter(item => item.index === prev.index + 1)[0]) },
                    onSecondaryClick: () => reset(),
                    primaryTitle: 'Vazhdo',
                    secondaryTitle: 'Anullo'
                })
            }
        }
        if (currentScreen.index === 1) {
            setComments([])
            if (convertedDocuments.original === '' && convertedDocuments.translated === '') {
                setButtonState({
                    isPrimaryActive: false,
                    isSecondaryActive: true,
                    onPrimaryClick: () => { setCurrentScreen(prev => SCREENS.filter(item => item.index === prev.index + 1)[0]) },
                    onSecondaryClick: () => {
                        setCurrentScreen(prev => SCREENS.filter(item => item.index === prev.index - 1)[0])
                        setConvertedDocuments({
                            original: '',
                            translated: ''
                        })
                    },
                    primaryTitle: 'Vazhdo',
                    secondaryTitle: 'Mbrapa'
                })
            } else {
                setButtonState({
                    isPrimaryActive: true,
                    isSecondaryActive: true,
                    onPrimaryClick: () => { setCurrentScreen(prev => SCREENS.filter(item => item.index === prev.index + 1)[0]) },
                    onSecondaryClick: () => {
                        setCurrentScreen(prev => SCREENS.filter(item => item.index === prev.index - 1)[0])
                        setConvertedDocuments({
                            original: '',
                            translated: ''
                        })
                    },
                    primaryTitle: 'Vazhdo',
                    secondaryTitle: 'Mbrapa'
                })
            }
        }
        if (currentScreen.index === 2) {
            if (proccess.title.trim().length === 0 || proccess.version?.trim().length === 0) {
                setButtonState({
                    isPrimaryActive: false,
                    isSecondaryActive: true,
                    onPrimaryClick: () => { },
                    onSecondaryClick: () => {
                        setCurrentScreen(prev => SCREENS.filter(item => item.index === prev.index - 1)[0])
                    },
                    primaryTitle: 'Mbrapa',
                    secondaryTitle: 'Anullo'
                })
            } else {
                setButtonState({
                    isPrimaryActive: true,
                    isSecondaryActive: true,
                    onPrimaryClick: () => {
                        saveDocument()
                    },
                    onSecondaryClick: () => {
                        setCurrentScreen(prev => SCREENS.filter(item => item.index === prev.index - 1)[0])
                    },
                    primaryTitle: 'Ruaj',
                    secondaryTitle: 'Mbrapa'
                })
            }
        }
    }, [currentScreen, documents, convertedDocuments, proccess])

    return [buttonState, setButtonState]
}

export default useButton