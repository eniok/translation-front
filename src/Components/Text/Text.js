import React from 'react'
import './Text.scss'

const Text = ({
    size = 'h3',
    weight = 'regular',
    title,
    color,
    style,
    className = '',
    ...props
}) => {

    return (
        <div
            {...props}
            className={`textClass size_${size} weight_${weight} ${className}`}
            style={{
                fontFamily: 'Inter',
                color: color
                , ...style
            }}
        >{title}</div>
    )
}

export default Text