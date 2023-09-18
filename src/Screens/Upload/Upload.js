import React from 'react'
import { DragAndDrop, Text } from '../../Components'
import { colors } from '../../Utils/theme'
import file from '../../Images/file.png'
import { spaces } from '../../Utils'
import './Upload.scss'
import closeRed from '../../Images/redClose.png'
import al from '../../Images/al.png'
import eu from '../../Images/eu.png'
import arrows from '../../Images/arrows.svg'

const STEPS = {
    '0': {
        desc: 'Tërhiq dhe lësho dokumentin origjinal, ose'
    },
    '1': {
        desc: 'Tërhiq dhe lësho dokumentin e përkthyer, ose'
    }
}


const Upload = ({
    status,
    document,
    changeStatus,
    onFileSucces,
    onReset,
    translationOptions,
    setTranslationOptions,
    documents,
    setDocuments,
    removeDocument,
}) => {

    const RenderUploadedFiles = ({ item, index, onRemove }) => {
        if (item === null) {
            return;
        }
        return (
            <div>
                <div style={{ border: `solid 1px ${colors.borderBlue}`, padding: 20, borderRadius: 7, display: 'flex', width: '100%', alignItems: 'center', gap: 32 }}>
                    <img src={file} width={36} height={36} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text size='h3' weight='bold' title={item?.title} />
                        <div>
                            <Text className='inline' size='h4' weight='regular' title={'100%'} />
                            <Text className='inline' size='h4' weight='ultra_slim' color={colors.gray} title={`- ${(item?.size / (1024 * 1024)).toFixed(2)} MB -`} style={spaces.margin(16, 8, 0, 8)} />
                            <Text className='inline' size='h4' weight='regular' title={item?.type} color={colors.success} />
                        </div>
                    </div>
                    <img
                        src={closeRed}
                        width={28}
                        height={28}
                        alt='close'
                        onClick={() => { onRemove(index) }}
                        style={{ cursor: 'pointer', borderRadius: '50%', backgroundColor: colors.lightRed, alignSelf: 'flex-start', marginLeft: 'auto', color: colors.error, textAlign: 'center', fontSize: 18, fontWeight: 600, verticalAlign: 'middle' }} />
                </div>
            </div>
        )
    }






    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            padding: '0px 40px',
            gap: 8
        }}>
            <Text size='h2' weight='bold' title={'Ngarkimi i dokumentave'} />
            <Text size='h5' color={colors.gray} title={'Ngarkoni dokumentat qe deshironi te procesoni'} style={{ marginBottom: 16 }} />
            {documents?.filter(item => item !== null).length < 2 && <DragAndDrop onFileSucces={onFileSucces} {...STEPS[documents?.findIndex(item => item === null)]} />}
            {documents?.filter(item => item !== null).length > 0 && <div
                style={{
                    position: 'relative',
                    marginTop: 16
                }}
            >
                <Text size='h4' weight='slim' color={colors.gray} title={'Zgjidhni gjuhën origjinale dhe gjuhën e përkthyer.'} style={{ marginBottom: 8 }} />
                <img className={`translateOption ${translationOptions.original === 'en' ? 'original' : 'translation'}`} src={eu} height={36} width={38} alt='primary' />
                <img
                    onClick={() => {
                        setTranslationOptions(prev => {
                            return (
                                {
                                    original: prev.translated,
                                    translated: prev.original
                                }
                            )
                        })
                    }}
                    className='translateOption arrows' src={arrows} height={32} width={36} alt='primary' style={{
                        cursor: 'pointer',
                    }} />
                <img className={`translateOption ${translationOptions.original === 'sq' ? 'original' : 'translation'}`} src={al} height={36} width={38} alt='primary' />

            </div>}

            <div style={{ marginTop: 48, display: 'flex', gap: 16, flexDirection: 'column' }}>
                {documents?.map((item, index) => {
                    return <RenderUploadedFiles item={item} index={index} onRemove={(e) => removeDocument(e)} />
                })}
            </div>
            {/* {renderByStatus()} */}
        </div>
    )
}

export default Upload