import React from 'react'
import { Text } from '../../Components'
import { colors } from '../../Utils/theme'
import './Timeline.scss'

const Timeline = ({
    items,
    current,
    style
}) => {
    return (
        <div className='timelineWrapper' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '70%', minHeight: 600, ...style }}>
            {items.map((item, _index) => {
                const isTicked = item.index <= current.index
                return (
                    <div key={item.index + item.title} style={{ display: 'flex', flexDirection: 'row', gap: 24, textAlign: 'right', flex: 1 }} >
                        <div>
                            <Text size='h3' weight='bold' color={colors.lightBlack} title={item.title} />
                            <Text size='h5' weight='slim' color={colors.gray} title={item.subTitle} style={{ marginTop: 12 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {_index === 0 && <div style={{ width: 2, height: 25, backgroundColor: colors.blue }} />}
                            <div style={{ width: 36, height: 36, borderRadius: '50%', border: 'solid 1px', borderColor: isTicked ? colors.blue : colors.gray, color: isTicked ? 'white' : colors.gray, backgroundColor: isTicked ? colors.blue : 'white' }} >
                                <div className='checkmark' children="L" />
                            </div>
                            {_index < items.length - 1 && <div style={{ width: 2, height: '100%', backgroundColor: item?.index < current.index ? colors.blue : colors.gray }} />}
                            {_index >= items.length - 1 && <div style={{ width: 2, height: 25, backgroundColor: colors.gray }} />}
                        </div>

                    </div>
                )
            })}
        </div>
    )
}

export default Timeline