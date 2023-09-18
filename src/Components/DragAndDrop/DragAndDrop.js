import React, { useRef } from 'react'
import './DragAndDrop.scss'
import { useState } from 'react'
import uploadImg from '../../Images/fileUpload.png'
import Text from '../Text'
import { colors } from '../../Utils/theme'
import { spaces } from '../../Utils'
import errorImg from '../../Images/error.png'

const ERRORS = {
    'size': 'Ju lutem vendosi nje dokument me te vogel se 50 Mb.',
    'type': 'Dokumenti nuk është në formatin e duhur.',
    'empty': 'Ju lutem vendosi nje dokument me përmbajtje.',
    'general': 'Dicka shkoi keq.'
}


const DragAndDrop = ({
    onFileSucces,
    onFileError,
    desc,
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [error, setError] = useState('')
    const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/pdf']


    return (
        <div>
            <div
                onDragOver={e => {
                    e.preventDefault()
                    if (!isHovered) {
                        setIsHovered(true)
                    }
                }}
                onDragLeave={e => {
                    e.preventDefault()
                    if (isHovered) {
                        setIsHovered(false)
                    }
                }}
                onDrop={e => {
                    e.preventDefault()
                    try {
                        if (e.dataTransfer.files[0].size === 0) {
                            setError(ERRORS.empty)
                            return;
                        }
                        if (e.dataTransfer.files[0].size > 50000000) {
                            setError(ERRORS.size)
                            return;
                        }
                        if (allowedFileTypes.includes(e.dataTransfer.files[0].type)) {
                            onFileSucces(e.dataTransfer.files[0]);
                            setIsHovered(false)
                            setError('')
                        } else {
                            setIsHovered(false)
                            setError(ERRORS.type)
                        }
                    } catch (error) {
                        setIsHovered(false)
                        setError(ERRORS.general)
                    }
                }}
                className={`dragAndDropContainer dragActive${isHovered} `}
                style={{ borderColor: error && 'red' }}
            >
                <div
                    style={{
                        padding: 16,
                        borderRadius: '50%',
                        backgroundColor: colors.secondaryBlue
                    }}
                >
                    <img src={uploadImg} height={32} width={32} alt='File upload' />
                </div>
                <div>
                    <Text size='h4' weight='slim' className='inline' title={desc || 'Tërhiq dhe lësho dokumentin, ose'} /><label htmlFor='fileInput' className='openExplorer inline'>Shfleto</label>
                </div>
                <input
                    id="fileInput"
                    type='file'
                    accept='application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    hidden={true}
                    onChange={e => {
                        e.preventDefault()
                        try {
                            if (e.target.files[0].size === 0) {
                                setError(ERRORS.empty)
                                return;
                            }
                            if (e.target.files[0].size > 50000000) {
                                setError(ERRORS.size)
                                return;
                            }
                            if (allowedFileTypes.includes(e.target.files[0].type)) {
                                onFileSucces(e.target.files[0])
                                setError('')
                            } else {
                                setError(ERRORS.type)
                            }
                        } catch (error) {
                            setError(ERRORS.general)
                        }
                    }}
                    onError={e => onFileError(e)}
                />
                <Text size='h5' weight='ultra_slim' className='disclaimer' title={'Tipet e dokumenteve te lejuara: .pdf, .docx dhe .txt'} color={colors.gray} style={{ marginTop: '-8px' }} />
            </div >
            {error.length > 0 && <div style={{ ...spaces.margin(16), display: 'flex', alignItems: 'center', gap: 8 }}>
                <img alt='error' src={errorImg} width={24} height={24} />
                <Text size='h4' color={colors.error} title={error} className={'inline'} />
            </div>}
        </div>
    )
}

export default DragAndDrop