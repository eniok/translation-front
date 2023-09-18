import React, { useEffect, useMemo, useRef, useState } from 'react'
import './TextAnnonation.scss'
import { colors } from '../../Utils/theme'
import Text from '../Text/Text'
import { Auth } from 'aws-amplify'
import user from '../../Images/user.png'
import TextField from '@mui/material/TextField'
import Button from '../Button'

function TextWithHighLights({ text, highlighted, onMouseUp, setComment, noAction, selectedIndexes }) {
    // Sort the highlights sort needes because if commented before the forEach loop under would splice the text
    let sortedHighlights = []
    highlighted.map(item => {
        let inserted = false
        sortedHighlights.map((tempHighlightItem, index) => {
            if (item.startIndex < tempHighlightItem.startIndex) {
                !inserted && sortedHighlights.splice(index, 0, item)
                inserted = true
            }
        })
        if (!inserted) {
            sortedHighlights.push(item)
        }

    })

    let lastIndex = 0;
    const formattedText = [];

    sortedHighlights.forEach(({ startIndex, endIndex, comment }, index) => {
        formattedText.push(text.slice(lastIndex, startIndex));
        formattedText.push(<Text onClick={(e) => {
            // If user clicks on a selected comment while commenting step
            if (!comment) {
                selectedIndexes.current = {
                    start: 0,
                    end: 0
                }
                setComment({
                    isVisible: false,
                    top: 0,
                    left: 0,
                    comment: ''
                })
                return
            }
            setComment({
                isVisible: true,
                top: e?.pageY,
                left: e.pageX + 400 > window.innerWidth ? window.innerWidth - 400 : e.pageX,
                comment: comment,
                noAction: true
            })
        }}
            size='h4'
            weight='ultra_slim'
            style={{
                userSelect: 'none',
                backgroundColor: noAction ? colors.lightOrange : colors.highlishted,
                display: 'inline',
                cursor: 'pointer'
            }}
            key={index}
            title={text.slice(startIndex, endIndex)}
        />);
        lastIndex = endIndex;
    });

    formattedText.push(text.slice(lastIndex));

    return <Text style={{ userSelect: noAction ? 'none' : null }} onMouseUp={onMouseUp} size='h4' weight='ultra_slim' title={formattedText} />;
}


const TextAnnonation = ({
    text,
    comments,
    onComment,
    noAction,
}) => {
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

    const selectedIndexes = useRef({
        start: 0,
        end: 0,
        savedSel: null
    })
    const [comment, setComment] = useState({
        isVisible: false,
        top: 0,
        left: 0,
        comment: ''
    })

    const getSelected = (e) => {
        if (noAction) {
            return;
        }
        const selection = window.getSelection()
        // offset needes since text has multiple children and we need to add the lenght of prev items
        let offset = 0
        let children = selection.focusNode.previousSibling
        while (children !== null) {
            offset += children.textContent.length
            children = children.previousSibling
        }
        if (
            (selection.anchorOffset === 0 && selection.extentOffset === 0)
            || (selection.baseOffset === 0 && selection.focusOffset === 0)
        ) {
            setComment({
                isVisible: false,
                top: 0,
                left: 0,
                comment: ''
            })
            return;
        }
        if (selection.type === 'Range') {
            selectedIndexes.current = {
                start: (selection?.baseOffset || selection.anchorOffset) + offset,
                end: (selection?.extentOffset || selection?.focusOffset) + offset,
            }
            // if user selects by reverse , from right to left
            if (selectedIndexes.current.start > selectedIndexes.current.end) {
                const temp = selectedIndexes.current.start
                selectedIndexes.current.start = selectedIndexes.current.end
                selectedIndexes.current.end = temp
            }
            setComment({
                isVisible: true,
                top: e?.pageY,
                left: e.pageX + 400 > window.innerWidth ? window.innerWidth - 400 : e.pageX,
                comment: ''
            })
        }
    }

    const renderText = useMemo(() => {
        const getHighlights = () => {
            if (
                selectedIndexes.current.start === 0 &&
                selectedIndexes.current.end === 0
            ) {
                return ([...comments])
            } else {
                return ([...comments, {
                    startIndex: selectedIndexes.current.start,
                    endIndex: selectedIndexes.current.end,
                }])
            }
        }
        return (
            <TextWithHighLights
                onMouseUp={getSelected}
                text={text}
                highlighted={getHighlights()}
                setComment={setComment}
                noAction={noAction}
                selectedIndexes={selectedIndexes}
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.isVisible, selectedIndexes.current.start, selectedIndexes.current.end])

    return (
        <div
            className='hideScrollBar'
            id='containerEnglish'
            style={{
                height: 700,
                flex: 1,
                borderRadius: 7,
                border: `solid 1px ${colors.border}`,
                padding: 16,
                overflow: 'scroll',
            }}>
            {renderText}
            <div
                style={{
                    visibility: comment.isVisible ? 'visible' : 'hidden',
                    position: 'fixed',
                    top: comment.top,
                    left: comment.left,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 12,
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    gap: 16,
                    width: 380,
                    border: `solid 1px ${colors.border}`,
                    backgroundColor: 'white',
                    zIndex: 9999
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}

                >
                    <div
                        style={{
                            display: 'inline-block',
                            borderRadius: '50%',
                            backgroundColor: colors.border,
                            padding: 8,
                            height: 34,
                            width: 34
                        }}
                    >
                        <img
                            alt='user'
                            width={18}
                            height={18}
                            src={user}
                        />
                    </div>
                    <Text size='h3' weight='regular' title={username} className='inline' style={{ marginLeft: 8 }} />
                </div>
                <TextField
                    disabled={noAction}
                    multiline={true}
                    autoComplete='off' id="outlined-basic" label="Shtoni komente" value={comment.comment} onChange={(e) => { setComment(prev => ({ ...prev, comment: e.target.value })) }} variant="outlined" style={{ flex: 1 }} />
                {comment?.noAction ?
                    <Button
                        style={{ width: '100%', maxWidth: null }}
                        disabled={comment.comment === ''}
                        onClick={() => {
                            selectedIndexes.current = {
                                start: 0,
                                end: 0
                            }
                            setComment({
                                isVisible: false,
                                top: 0,
                                left: 0,
                                comment: ''
                            })
                        }}
                        variant={'secondary'}
                        title={'Mbyll'}
                    />
                    : <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 16,
                    }}>
                        <Button onClick={() => {
                            selectedIndexes.current = {
                                start: 0,
                                end: 0
                            }
                            setComment({
                                isVisible: false,
                                top: 0,
                                left: 0,
                                comment: ''
                            })
                        }} variant={'secondary'} title={'Anullo'} />
                        <Button
                            disabled={comment.comment === ''}
                            onClick={() => {
                                onComment({
                                    startIndex: selectedIndexes.current.start,
                                    endIndex: selectedIndexes.current.end,
                                    comment: comment.comment
                                })
                                setComment({
                                    isVisible: false,
                                    top: 0,
                                    left: 0,
                                    comment: ''
                                })
                                selectedIndexes.current = {
                                    start: 0,
                                    end: 0
                                }
                            }} variant={'primary'} title={'Komento'} />
                    </div>}
            </div>
        </div>
    )
}

export default TextAnnonation