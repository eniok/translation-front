import React from 'react'
import { colors } from '../../Utils/theme'
import './Button.scss'

const backgroundColor = {
    primary: {
        true: colors.disabled,
        false: colors.blue
    },
    secondary: {
        true: 'transparent',
        false: colors.secondaryBlue
    },
    tertiary: {
        true: colors.disabled,
        false: colors.accent
    }
}

const color = {
    primary: {
        true: 'white',
        false: 'white'
    },
    secondary: {
        true: colors.gray,
        false: colors.blue
    },
    tertiary: {
        true: 'white',
        false: 'white'
    },
}

const Button = ({
    variant,
    onClick,
    disabled = false,
    title,
    style = {}
}) => {
    return (
        <div
            className={`buttonClass btn_${disabled} `}
            onClick={() => {
                if (!disabled) {
                    onClick()
                }
            }}
            style={{
                maxWidth: 300,
                minWidth: 170,
                textAlign: 'center',
                padding: '15px 40px',
                borderRadius: 7,
                backgroundColor: backgroundColor[variant][disabled],
                cursor: !disabled && 'pointer',
                color: color[variant][disabled],
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 18,
                ...style,
            }}
        >{title}</div>
    )
}

export default Button