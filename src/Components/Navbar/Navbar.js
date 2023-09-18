import React, { useEffect, useState } from 'react'
import Text from '../Text'
import { spaces } from '../../Utils'
import { useNavigate } from 'react-router-dom'
import user from '../../Images/user.png'
import { colors } from '../../Utils/theme'
import { Auth } from 'aws-amplify'

const Navbar = () => {

    const navigate = useNavigate()
    const [username, setUserName] = useState('Gjon')

    const getUser = async () => {
        try {
            const { attributes } = await Auth.currentAuthenticatedUser()
            setUserName(attributes.email)
        } catch (error) {
            console.log("🚀 ~ file: Navbar.js:19 ~ getUser ~ error:", error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className='navBar'>
            <div className='rowDisplay'>
                <Text size='h2' weight='bold' color={colors.blue} title={'EU'} />
                <Text style={spaces.margin(0, 0, 0, 6)} size='h2' weight='bold' title={'- Approximation'} />
            </div>
            <div className='rowDisplay userNavbar'>
                <Text size='h3' weight='regular' title={'Translate'} color={colors.blue} style={{ ...spaces.margin(0, 0, 0, 8), cursor: 'pointer' }} />
                <div style={{ width: '1px', height: '100%', backgroundColor: colors.gray }} />
                <Text size='h3' weight='regular' title={username} />
                <img
                    alt='user'
                    width={32}
                    height={32}
                    style={{ marginLeft: '-8px', cursor: 'pointer' }}
                    onClick={() => {
                        navigate('/documents')
                    }}
                    src={user} />
            </div>
        </div>
    )
}

export default Navbar