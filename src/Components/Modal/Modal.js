import React from 'react'
import close from '../../Images/close.png'
import error from '../../Images/error.png'
import Text from '../Text'
import _Modal from 'react-modal';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: 0
    },
};


const Modal = ({
    isVisible,
    styles = {},
    desc,
    closeModal
}) => {
    _Modal.setAppElement('#root');

    return (
        <_Modal
            isOpen={isVisible}
            onRequestClose={closeModal}
            style={{ ...customStyles, styles }}
            contentLabel="Example Modal"
        >
            <div
                style={{
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    width: 500,
                }}
            >
                <img src={close} width={24} height={24} alt='close' style={{ alignSelf: 'flex-end', cursor: 'pointer' }} onClick={closeModal} />
                <img src={error} width={64} height={64} alt='error' style={{ alignSelf: 'center', marginTop: 16 }} />
                <Text size='h3' weight='semi_bold' style={{ textAlign: 'center', marginTop: 24 }} title={desc || 'Diçka shkoi gabim.'} />
                <Text size='h4' style={{ textAlign: 'center', marginTop: 12, marginBottom: 38 }} title={'Ju lutem provoni përsëri më vonë.'} />
            </div>
        </_Modal>
    )
}

export default Modal