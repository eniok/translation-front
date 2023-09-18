import { useEffect, useState } from 'react';
import { Button, Modal, Navbar, Text } from '../../Components';
import user from '../../Images/user.png';
import { spaces } from '../../Utils';
import { colors } from '../../Utils/theme';
import {
    useNavigate,
} from "react-router-dom";
import ContentLoader from 'react-content-loader'
import file from '../../Images/file.png'
import arrow from '../../Images/arrow.png'
import { axiosInstance } from '../../Utils/interceptor';
import moment from 'moment';
import Services from '../../Config/Services';


const DUMMY = [
    {
        title: 'Titulli Shqip',
        version: '1.1.0',
        date: '12/08/2023',
        id: '1'
    },
    {
        title: 'Titulli Anglisht',
        version: '1.1.0',
        date: '12/08/2023',
        id: '2'
    },
    {
        title: 'Titulli Gjermanisht',
        version: '1.1.0',
        date: '12/08/2023',
        id: '3'
    },
    {
        title: 'Titulli Italisht',
        version: '1.1.0',
        date: '12/08/2023',
        id: '4'
    },
    {
        title: 'Titulli Frengjisht',
        version: '1.2.0',
        date: '12/08/2023',
        id: '5'
    }
]


function Documents() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        isLoading: true,
        data: [],
        error: false
    })

    const getDocuments = async () => {
        try {
            const { data } = await axiosInstance.get(Services.document)
            const tempData = []
            data?.map(item => {
                tempData.push({
                    title: item.title,
                    version: item.version,
                    // dont use moment since the response isnt RFC2822 or ISO format and the momentjs fallsback to today date
                    date: item['created_at'] ? item['created_at']?.split(' ')[0] : undefined,
                    id: item?._id,
                    original: {
                        language: item?.original?.language || 'en',
                        document_url: item?.original?.document_url?.split('incoming/')[1] || undefined
                    },
                    translated: {
                        language: item?.translated?.language || 'al',
                        document_url: item?.translated?.document_url?.split('translated/')[1] || undefined
                    },
                    comments: item?.comments
                })
            })
            setData({
                data: [...tempData],
                isLoading: false,
                error: false
            })

        } catch (error) {
            setData({
                error: error.message,
                data: [],
                isLoading: false
            })
        }
    }

    useEffect(() => {
        getDocuments()
    }, [])

    return (
        <div className='appWrapper'>
            <Navbar />
            <div style={{
                marginTop: 46,
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: 32

            }}>
                <div style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    marginBottom: 32
                }}>
                    <Text size='h3' weight='bold' title={'Dokumentet e perkthyera'} />
                    <Button variant={'primary'} title={'Ngarko dokument te ri'} onClick={() => navigate('/')} />
                </div>
                {data.isLoading ?
                    DUMMY.map((item, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: 12,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    border: 'solid 1px #D9D9D9',
                                    borderRadius: 5,
                                    gap: 24,
                                    marginTop: 16,
                                    width: '100%',
                                    height: 71,
                                    justifyItems: 'center'
                                }}
                            >
                                <ContentLoader
                                    speed={2}
                                    width={'100%'}
                                    height={700}
                                    // viewBox={`0 0 100% 700`}
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <rect x="0" y="0" rx="3" ry="3" width="25%" height="24" />

                                    <rect x="0" y="30" rx="3" ry="3" width="75%" height="24" />
                                </ContentLoader>

                            </div>
                        )
                    })

                    :
                    data.data.length > 0 ?
                        data.data.map((item, index) => {
                            return (
                                <div
                                    key={item?._id}
                                    onClick={() => navigate(`/document/${item.id}`, {
                                        state: {
                                            comments: item.comments || []
                                        },
                                    })}
                                    style={{
                                        padding: '12px 24px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        border: 'solid 1px #D9D9D9',
                                        borderRadius: 5,
                                        gap: 24,
                                        marginTop: 16,
                                        width: '100%',
                                        justifyItems: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <img alt='file' src={file} width={26} height={26} />
                                    <div style={{ flex: 1 }}>
                                        <Text size='h3' title={item.title} style={{ flex: 1 }} />
                                        <Text size='h5' title={`Versioni : ${item.version || '-'}`} className={'inline'} style={spaces.margin(8)} color={colors.lightGray} />
                                        <Text size='h5' title={item.date} className={'inline'} style={spaces.margin(0, 0, 0, 8)} color={colors.lightGray} />
                                    </div>
                                    <img alt='arrow' src={arrow} width={9} height={19} />
                                </div>
                            )
                        }) : <Text weight='bold' size='h2' title={'Nuk keni akoma dokumente të ruajtur.'} style={{ textAlign: 'center' }} />
                }
            </div>
            <Modal isVisible={Boolean(data.error)} closeModal={() => { navigate('/') }} desc={data.error} />
        </div>

    )
}

export default Documents