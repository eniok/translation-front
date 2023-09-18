import React, { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate, useParams,
} from "react-router-dom";
import closeIcon from '../../Images/close.png'
import { Text, Modal, TextAnnonation } from "../../Components";
import { colors } from "../../Utils/theme";
import copy from '../../Images/copy.png'
import download from '../../Images/documentdownload.png'
import send from '../../Images/send.png'
import ContentLoader from "react-content-loader";
import { DESCRIPTIONS, spaces } from "../../Utils";
import en from '../../Images/eu.png'
import al from '../../Images/al.png'
import commentsIcon from '../../Images/comments.png'
import { BlobServiceClient } from '@azure/storage-blob';
import { axiosInstance } from "../../Utils/interceptor";
import Services from "../../Config/Services";
import file from '../../Images/file.png'
import checked from '../../Images/check.png'



const OPTIONS = [
    {
        icon: copy,
        title: 'Shkarkoni analizën',
        onClick: () => { },
        id: 0
    },
    {
        icon: download,
        title: 'Shkarkoni dokumentin',
        onClick: () => { },
        id: 1
    },
    {
        icon: send,
        title: 'Shpërndani dokumentin',
        onClick: () => { },
        id: 2
    }
]

const COUNTRIES = {
    en: {
        icon: en,
        desc: 'English'
    },
    sq: {
        icon: al,
        desc: 'Albanian'
    },
}

const Item = ({ title, index, style }) => {
    return (
        <div
            style={{
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'row',
                border: 'solid 1px #D9D9D9',
                borderRadius: 5,
                gap: 24,
                alignItems: 'center',
                marginTop: 16,
                ...style
            }}
        >
            <img alt='file' src={file} width={26} height={26} />
            <Text size='h3' weight='bold' title={title} style={{ flex: 1 }} />
            <div style={{ padding: 5, backgroundColor: colors.secondaryBlue, borderRadius: 30, display: 'flex', alignSelf: 'flex-end' }}>
                <img alt='check' src={checked} width={24} height={24} />
                <Text style={spaces.margin(0, 17, 0, 8)} color={colors.blue} title={DESCRIPTIONS[index]} className={'inline'} />
            </div>
        </div>
    )
}


const TextLoader = () => {
    return (
        <ContentLoader
            speed={2}
            width={'100%'}
            height={700}
            // viewBox={`0 0 100% 700`}
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


function Document() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [document, setDocument] = useState(null)

    const [originalData, setOriginalData] = useState({
        isLoading: true,
        data: '',
        error: false,
        country: ''
    })
    const [translatedData, setTranslatedData] = useState({
        isLoading: true,
        data: '',
        error: false,
        country: ''
    })
    const [generateError, setGenerateError] = useState(false)


    const generateOriginalContent = async (container, document_url, blob) => {
        try {
            const { data } = await axiosInstance.post(Services.generate_sas, {
                "document_url": document_url
            })
            let sasToken = data['sas_token']
            const sasUrl = `https://${Services.translateService}.blob.core.windows.net?${sasToken}`
            const blobServiceClient = new BlobServiceClient(sasUrl)
            const containerClient = blobServiceClient.getContainerClient(container)
            const blobClient = containerClient.getBlobClient(blob)

            // Fetch the blob content
            const response = await blobClient.download();
            const downloaded = await blobToString(await response.blobBody)
            setOriginalData({
                isLoading: false,
                data: downloaded,
                error: false
            })
        } catch (error) {
            setGenerateError(true)
            console.log("🚀 ~ file: Document.js:114 ~ generateOriginalUrl ~ error:", error)

        }
    }
    const generateTranslatedContent = async (container, document_url, blob) => {
        try {
            const { data } = await axiosInstance.post(Services.generate_sas, {
                "document_url": document_url
            })
            let sasToken = data['sas_token']
            const sasUrl = `https://${Services.translateService}.blob.core.windows.net?${sasToken}`
            const blobServiceClient = new BlobServiceClient(sasUrl)
            const containerClient = blobServiceClient.getContainerClient(container)
            const blobClient = containerClient.getBlobClient(blob)

            const response = await blobClient.download();
            const downloaded = await blobToString(await response.blobBody)
            setTranslatedData({
                isLoading: false,
                data: downloaded,
                error: false
            })
        } catch (error) {
            setGenerateError(true)
            console.log("🚀 ~ file: Document.js:114 ~ generateOriginalUrl ~ error:", error)

        }
    }

    const getDocumentInfo = async () => {
        try {
            const { data } = await axiosInstance.get(Services.document + `/${id}`)
            setDocument({
                title: data?.title,
                original: {
                    blob: data?.original?.blob,
                    container: data?.original?.container,
                    document_url: data?.original?.document_url,
                    language: data?.original?.language || 'en',
                    fileName: data?.original?.original_filename
                },
                translated: {
                    blob: data?.translated?.blob,
                    container: data?.translated?.container,
                    document_url: data?.translated?.document_url,
                    language: data?.translated?.language || 'sq',
                    fileName: data?.translated?.translated_filename
                },
                comments: data?.comments
            })
        } catch (error) {
            console.log("🚀 ~ file: Document.js:167 ~ getDocumentInfo ~ data:", error)

        }
    }

    async function blobToString(blob) {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onloadend = (ev) => {
                resolve(ev.target.result);
            };
            fileReader.onerror = reject;
            fileReader.readAsText(blob);
        });
    }

    useEffect(() => {
        getDocumentInfo()
    }, [])

    useEffect(() => {
        if (document) {
            generateOriginalContent(document.original.container, document.original.document_url, document.original.blob)
            generateTranslatedContent(document.translated.container, document.translated.document_url, document.translated.blob)
        }
    }, [document])

    return (
        <div className='appWrapper'>
            <div
                style={{
                    display: 'flex',
                    paddingBottom: 24,
                    borderBottom: `solid 1px ${colors.border}`,
                    gap: 28,
                    alignItems: 'center'
                }}
            >
                <img
                    width={20}
                    height={20}
                    style={{ marginLeft: 12, cursor: 'pointer', color: '#292D32' }}
                    src={closeIcon}
                    alt='close'
                    onClick={() => navigate(-1)}
                />
                {document?.title ? <Text size="h3" weight="bold" title={document.title} /> : <ContentLoader
                    speed={2}
                    width={65}
                    height={25}
                    // viewBox={`0 0 100% 700`}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <rect x="0" y="0" rx="3" ry="3" width="100%" height="12" />

                </ContentLoader>}
            </div>
            <div
                style={{
                    display: 'flex',
                    padding: 24,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 42,
                    borderBottom: `solid 1px ${colors.border}`,

                }}
            >
                {OPTIONS.map((item) => {
                    return (
                        <div
                            key={item.id}
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                cursor: 'pointer'
                            }}
                            onClick={item.onClick}
                        >
                            <div
                                style={{
                                    padding: 13,
                                    borderRadius: '50%',
                                    backgroundColor: colors.secondaryBlue
                                }}
                            >
                                <img src={item.icon} height={24} width={24} alt='File upload' />
                            </div>
                            <Text size="h4" weight="slim" title={item.title} />
                        </div>
                    )
                })
                }
            </div>
            <div style={{ display: 'flex', gap: 32, flexDirection: 'row', flex: 1, marginTop: 32 }}>
                {originalData.isLoading ?
                    <div style={{ flex: 1 }}>
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            height={28}
                            // viewBox={`0 0 100% 28`}
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
                    :
                    <div style={{ flex: 1 }}>
                        <Item title={document?.original?.fileName || '-'} index={0} style={{ marginBottom: 16 }} />
                        <div style={{ alignItems: 'center', display: 'flex', marginBottom: 16, paddingLeft: 17 }}>
                            <img alt="country" src={COUNTRIES[document.original.language || 'en']?.icon} width={32} height={22} />
                            <Text size='h3' title={COUNTRIES[document.original.language || 'en']?.desc} className={'inline'} style={spaces.margin(0, 0, 0, 8)} />
                        </div>
                        <div
                            className='hideScrollBar'
                            style={{
                                height: 700,
                                flex: 1,
                                borderRadius: 7,
                                border: `solid 1px ${colors.border}`,
                                padding: 16,
                                overflow: 'scroll'
                            }} >
                            <Text size='h4' weight='ultra_slim' title={originalData.data} />
                        </div>
                    </div>}
                {translatedData.isLoading ?
                    <div style={{ flex: 1 }}>
                        <ContentLoader
                            speed={2}
                            width={'100%'}
                            height={28}
                            // viewBox={`0 0 100% 28`}
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
                        <Item title={document?.translated?.fileName || '-'} index={1} style={{ marginBottom: 16 }} />
                        <div style={{ alignItems: 'center', display: 'flex', marginBottom: 16, paddingLeft: 17, }}>
                            <img alt="country" src={COUNTRIES[document.translated.language || 'al']?.icon} width={32} height={22} />
                            <Text size='h3' title={COUNTRIES[document.translated.language || 'sq']?.desc} className={'inline'} style={spaces.margin(0, 0, 0, 8)} />
                            <img alt='comment' src={commentsIcon} width={22} height={22} style={{ marginLeft: 'auto' }} />
                            {document?.comments?.length > 0 &&
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
                                        {document?.comments?.length}
                                    </div>
                                </div>
                            }
                            <Text size='h3' title={'Comments'} className={'inline'} style={spaces.margin(0, 0, 0, 8)} />
                        </div>
                        <TextAnnonation text={translatedData.data} comments={document?.comments || []} noAction={true} />
                    </div>}
            </div>
            <Modal
                isVisible={generateError}
                closeModal={() => {
                    setGenerateError(false)
                    navigate(-1)
                }}
                desc={'Dicka shkoi gabim.'}
            />
        </div>

    )
}

export default Document