import React, { useState } from 'react'
import { Text } from '../../Components'
import { colors } from '../../Utils/theme'
import file from '../../Images/file.png'
import checked from '../../Images/check.png'
import { DESCRIPTIONS, spaces } from '../../Utils'
import TextField from '@mui/material/TextField';



const Summary = ({
    proccess,
    onChange,
    documents,
}) => {

    const Item = ({ item, index }) => {
        return (
            <div
                style={{
                    padding: '12px 24px',
                    display: 'flex',
                    flexDirection: 'row',
                    border: 'solid 1px #D9D9D9',
                    borderRadius: 5,
                    gap: 24,
                    alignItems: 'center',
                    marginTop: 16
                }}
            >
                <img src={file} width={26} height={26} />
                <Text size='h3' weight='bold' title={item?.title} />
                <Text size='h3' title={'Shfaq'} color={colors.blue} style={{ flex: 1, textAlign: 'right' }} />
                <div style={{ padding: 5, backgroundColor: colors.secondaryBlue, borderRadius: 30, display: 'flex', alignItems: 'center' }}>
                    <img src={checked} width={24} height={24} />
                    <Text style={spaces.margin(0, 17, 0, 8)} color={colors.blue} title={DESCRIPTIONS[index]} className={'inline'} />
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
            gap: 8,
            paddingBottom: 100
        }}>
            <Text size='h3' weight='bold' title={'Përmbledhja'} />
            <Text size='h4' weight='slim' color={colors.gray} title={'Kontrolloni rezultatet e gjeneruara nga asistenti AI.'} />
            {documents.map((item, index) => (<Item item={item} index={index} />))}
            <div
                style={{
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'row',
                    border: 'solid 1px #D9D9D9',
                    borderRadius: 5,
                    gap: 24,
                    marginTop: 32,
                    flexDirection: 'column',
                }}
            >
                <Text title={'Versioni Shqip'} size='h3' weight='regular' />
                <div style={{ gap: 24, display: 'flex', flex: 1, flexDirection: 'row' }}>
                    <TextField id="outlined-basic" label="Titulli" value={proccess.title} onChange={(e) => onChange('title', e.target.value)} variant="outlined" style={{ flex: 1 }} />
                    <TextField id="outlined-basic" label="Versioni" value={proccess.version} onChange={(e) => onChange('version', e.target.value)} variant="outlined" style={{ flex: 1 }} />
                </div>
            </div>
        </div>
    )
}

export default Summary