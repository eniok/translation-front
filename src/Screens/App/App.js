import { useMemo, useState } from 'react';
import './App.scss';
import { Button, Navbar, Timeline, Modal } from '../../Components';
import { SCREENS } from '../../Utils';
import Upload from '../Upload';
import Translation from '../Translation';
import { axiosInstance } from '../../Utils/interceptor';
import Summary from '../Summary';

import { Auth } from 'aws-amplify';

import Services from '../../Config/Services'
import useButton from './useButton';

const TITLES = {
    '0': 'Dokumenti origjinal.',
    '1': 'Dokumenti i përkthyer'
}


function App() {
    const [currentScreen, setCurrentScreen] = useState(SCREENS[0])
    const [convertedDocuments, setConvertedDocuments] = useState({
        original: '',
        translated: ''
    })
    const [translationError, setTranslationError] = useState({
        isError: false,
        message: ''
    })
    const [saveError, setSaveError] = useState({
        isVisible: false,
        message: ''
    })
    const [translationOptions, setTranslationOptions] = useState({
        original: 'en',
        translated: 'sq'
    })
    const [comments, setComments] = useState([])
    const [documents, setDocuments] = useState([null, null])
    const [proccess, setProccess] = useState({
        title: '',
        version: ''
    })

    const [buttonState, setButtonState] = useButton({
        currentScreen: currentScreen,
        setCurrentScreen: setCurrentScreen,
        setComments: setComments,
        saveDocument: saveDocument,
        document: document,
        documents: documents,
        setDocuments: setDocuments,
        setConvertedDocuments: setConvertedDocuments,
        convertedDocuments: convertedDocuments,
        proccess: proccess
    })

    function removeDocument(index) {
        setDocuments(prev => {
            const tempArray = [...prev]
            tempArray[index] = null
            return tempArray
        })
    }

    function updateDocument(file) {
        const indexToBeAdded = documents.findIndex(index => index === null)
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            setDocuments(prev => {
                const tempArray = [...prev]
                tempArray[indexToBeAdded] = {
                    title: file.name,
                    size: file.size,
                    content: reader.result,
                    file: file,
                    version: '1.0.0',
                    originalTitle: file.name,
                    type: TITLES[indexToBeAdded]
                }
                return tempArray
            })
        };
        reader.onerror = function () {
            reset()
        }

    }


    const addComment = (comment) => {
        setComments(prev => ([...prev, comment]))
    }

    const compare = async (cb) => {
        const formData = new FormData()
        formData.append('original_file', documents[0].file);
        formData.append('translated_file', documents[1].file);

        try {
            const { data } = await axiosInstance.post(Services.compare, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setConvertedDocuments({
                original: data?.original_file_content,
                translated: data?.translated_file_content
            })
            cb()
        } catch (error) {
            setTranslationError({
                isError: true,
                message: error?.response?.data?.message || error?.message
            })
        }
    }

    const sendDocument = async (cb) => {
        const formData = new FormData()
        formData.append('file', document.file);
        formData.append('original', translationOptions.original)
        formData.append('translated', translationOptions.translated)
        try {
            const { data, headers } = await axiosInstance.post(Services.translate, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            // setTranslatedDocument({
            //     title: document.title,
            //     size: headers['content-length'],
            //     content: data.content,
            //     file: headers['content-type'],
            //     version: '',
            //     sourceUrl: data['source_url'],
            //     targetUrl: data['target_url']
            // })
            cb()
        } catch (error) {
            setTranslationError({
                isError: true,
                message: error?.response?.data?.message || error?.message
            })
        }
    }

    async function saveDocument() {
        try {
            const body = {
                "title": proccess.title,
                "version": proccess.version,
                "original": {
                    'original_filename': documents[0].title,
                    "language": translationOptions.original,
                    "original_file_content": convertedDocuments.original
                },
                "translated": {
                    'translated_filename': documents[1].title,
                    "language": translationOptions.translated,
                    "translated_file_content": convertedDocuments.translated
                },
                "comments": comments
            }
            await axiosInstance.post(Services.save_comparison, body)
            setButtonState({
                isPrimaryActive: true,
                isSecondaryActive: false,
                onPrimaryClick: () => {
                    reset()
                    setCurrentScreen(SCREENS[0])
                },
                onSecondaryClick: () => { },
                primaryTitle: 'Mbyll',
                secondaryTitle: 'Anullo'
            })
        } catch (error) {
            setSaveError({
                isVisible: true,
                message: error?.response?.data?.message || error?.message
            })
        }
    }

    function reset() {
        setConvertedDocuments({
            original: '',
            translated: ''
        })
        setDocuments([null, null])
        setProccess({
            title: '',
            version: ''
        })
    }


    const renderContent = useMemo(() => {
        if (currentScreen.index === 0) {
            return (
                <Upload
                    documents={documents}
                    setDocuments={setDocuments}
                    removeDocument={removeDocument}
                    document={document}
                    onReset={reset}
                    onFileSucces={file => {
                        updateDocument(file)
                    }
                    }
                    translationOptions={translationOptions}
                    setTranslationOptions={setTranslationOptions}
                />
            )
        }
        if (currentScreen.index === 1) {
            const closeModal = () => {
                setTranslationError({ isError: false, message: '' })
                reset()
                setCurrentScreen(SCREENS[0])
            }
            return (
                <Translation
                    document={document}
                    sendDocument={sendDocument}
                    compare={compare}
                    translationError={translationError}
                    closeModal={closeModal}
                    translationOptions={translationOptions}
                    comments={comments}
                    addComment={addComment}
                    convertedDocuments={convertedDocuments}
                    documents={documents}
                />
            )
        }

        if (currentScreen.index === 2) {
            return (
                <Summary
                    proccess={proccess}
                    onChange={(target, value) => {
                        const tempObject = { ...proccess }
                        tempObject[target] = value
                        setProccess(tempObject)
                    }}
                    documents={documents}
                />
            )
        }

    }, [currentScreen.index, translationOptions, document, translationError, comments, documents, convertedDocuments, proccess])


    return (
        <div className='appWrapper'>
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'row', gap: 32, marginTop: 64, flex: 1, }}>
                <Timeline items={SCREENS} current={currentScreen} />
                {renderContent}
            </div>
            <div style={{ width: '100vw', backgroundColor: 'white', marginLeft: '-32px', display: 'flex', justifyContent: 'flex-end', padding: 20, gap: 16, boxShadow: 'rgba(0, 0, 0, 0.15) 0px -4px 5px', paddingRight: 54, position: 'fixed', bottom: 0 }}>
                <div style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Button
                        onClick={() => {
                            Auth.signOut()
                        }}
                        variant={'tertiary'}
                        title={'Dilni'}
                        style={{ alignSelf: 'flex-start', backgroundColor: 'red' }}
                    />
                </div>
                <Button disabled={!buttonState.isSecondaryActive} onClick={buttonState.onSecondaryClick} variant={'secondary'} title={buttonState.secondaryTitle || 'Anullo'} />
                <Button disabled={!buttonState.isPrimaryActive} onClick={buttonState.onPrimaryClick} variant={'primary'} title={buttonState.primaryTitle || 'Vazhdo'} />
            </div>
            <Modal
                isVisible={saveError.isVisible}
                desc={saveError.message}
                closeModal={() => {
                    setSaveError({
                        isVisible: false,
                        message: ''
                    })
                    reset()
                    setCurrentScreen(SCREENS[0])
                }}
            />
        </div>

    )

}

export default App