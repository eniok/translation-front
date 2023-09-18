import React, { useEffect, useRef, useState } from 'react'
import ContentLoader from 'react-content-loader'

import { Text, Modal, TextAnnonation } from '../../Components'
import { colors } from '../../Utils/theme'
import { spaces } from '../../Utils'
import file from '../../Images/file.png'
import eu from '../../Images/eu.png'
import al from '../../Images/al.png'
import commentsIcon from '../../Images/comments.png'
import './Translation.scss'

const COUNTRIES = {
    en: {
        icon: eu,
        desc: 'English'
    },
    sq: {
        icon: al,
        desc: 'Albanian'
    },
}



const Divider = () => {
    return (
        <div style={{ width: '100%', height: 1, backgroundColor: colors.border, ...spaces.margin(8, 0, 8, 0) }} />
    )
}

const TextLoader = () => {
    return (
        <ContentLoader
            speed={2}
            width={'100%'}
            height={700}
            // viewBox={"0 0 100% 700"}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="0" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="15" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="30" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="45" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="70" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="85" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="100" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="115" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="140" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="155" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="175" rx="3" ry="3" width="100%" height="12" />
            <rect x="0" y="190" rx="3" ry="3" width="100%" height="12" />

        </ContentLoader>
    )
}

const Translation = ({
    document,
    compare,
    translationError,
    closeModal,
    translationOptions,
    comments,
    addComment,
    convertedDocuments,
    documents
}) => {
    const [loading, setLoading] = useState(false)


    const renderContent = () => {
        return (
            <div style={{ display: 'flex', gap: 32, flexDirection: 'row', flex: 1 }}>
                {loading ?
                    <div style={{ flex: 1 }}>
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            height={28}
                            // viewBox={"0 0 100% 28"}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                            style={{ marginBottom: 8 }}
                        >
                            <rect x="0" y="0" rx="3" ry="3" width="32" height="24" />
                            <rect x="42" y="0" rx="3" ry="3" width="120" height="24" />

                        </ContentLoader>
                        <div style={{
                            height: 700,
                            flex: 1,
                            borderRadius: 7,
                            border: `solid 1px ${colors.border}`,
                            padding: 20
                        }} >
                            <TextLoader />
                        </div>
                    </div>
                    : <div style={{ flex: 1 }}>
                        <div style={{ alignItems: 'center', display: 'flex', marginBottom: 16, paddingLeft: 17 }}>
                            <img alt='country' src={COUNTRIES[translationOptions.original || 'en']?.icon} width={32} height={24} />
                            <Text size='h3' title={COUNTRIES[translationOptions.original || 'en']?.desc} className={'inline'} style={spaces.margin(0, 0, 0, 8)} />
                        </div>
                        <div
                            className='hideScrollBar'
                            id='containerEnglish'
                            style={{
                                height: 700,
                                flex: 1,
                                borderRadius: 7,
                                border: `solid 1px ${colors.border}`,
                                padding: 16,
                                overflow: 'scroll'
                            }} >
                            <Text size='h4' weight='ultra_slim' title={convertedDocuments.original} />
                        </div>
                    </div>}
                {loading ?
                    <div style={{ flex: 1 }}>
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            height={28}
                            // viewBox={"0 0 100% 28"}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                            style={{ marginBottom: 8 }}
                        >
                            <rect x="0" y="0" rx="3" ry="3" width="32" height="24" />
                            <rect x="42" y="0" rx="3" ry="3" width="120" height="24" />
                            <rect x={`calc(100% - 120px)`} y="0" rx="3" ry="3" width="120" height="24" />

                        </ContentLoader>
                        <div style={{
                            height: 700,
                            flex: 1,
                            borderRadius: 7,
                            border: `solid 1px ${colors.border}`,
                            padding: 20
                        }} >
                            <TextLoader />
                        </div>
                    </div>
                    :
                    <div style={{ flex: 1 }}>
                        <div style={{ alignItems: 'center', display: 'flex', marginBottom: 16, paddingLeft: 17 }}>
                            <img alt='transCountry' src={COUNTRIES[translationOptions.translated || 'al']?.icon} width={32} height={22} />
                            <Text size='h3' title={COUNTRIES[translationOptions.translated || 'al']?.desc} className={'inline'} style={spaces.margin(0, 0, 0, 8)} />
                            <img alt='comment' src={commentsIcon} width={22} height={22} style={{ marginLeft: 'auto' }} />
                            {comments?.length > 0 &&
                                <div style={{
                                    backgroundColor: colors.accent,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    color: 'white',
                                    position: 'relative',
                                    top: -10,
                                    right: 10,
                                    fontSize: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div>
                                        {comments?.length}
                                    </div>
                                </div>
                            }
                            <Text size='h3' title={'Comments'} className={'inline'} style={spaces.margin(0, 0, 0, 8)} />
                        </div>
                        <TextAnnonation onComment={addComment} text={convertedDocuments.translated} comments={comments} />
                    </div>}
            </div>
        )
    }

    useEffect(() => {
        setLoading(true)
        compare(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            padding: '0px 40px',
            gap: 16,
            paddingBottom: 100,
        }}>
            <Text size='h3' weight='bold' title={'Përkthimi'} />
            <Text size='h4' weight='slim' color={colors.gray} title={'Kontrolloni rezultatet e gjeneruara nga asistenti AI.'} />
            <Divider />
            <div style={{ display: 'flex', gap: 32, flexDirection: 'row' }}>
                <div style={{ border: `solid 1px ${colors.border}`, padding: 16, borderRadius: 7, display: 'flex', width: '100%', alignItems: 'center', gap: 32 }}>
                    <img alt='title' src={file} width={26} height={26} />
                    <Text size='h3' weight='regular' title={documents[0].title} />
                </div>
                <div style={{ border: `solid 1px ${colors.border}`, padding: 16, borderRadius: 7, display: 'flex', width: '100%', alignItems: 'center', gap: 32 }}>
                    <img alt='title' src={file} width={26} height={26} />
                    <Text size='h3' weight='regular' title={documents[1].title} />
                </div>
            </div>
            <Divider />
            {renderContent()}
            <Modal isVisible={translationError.isError} closeModal={closeModal} desc={translationError.message} />
        </div>
    )
}

export default Translation