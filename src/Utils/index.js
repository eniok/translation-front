const spaces = {
    padding: (top, right, bottom, left) => {
        return ({
            paddingTop: top,
            paddingRight: right,
            paddingBottom: bottom,
            paddingLeft: left
        })
    },
    margin: (top, right, bottom, left) => {
        return ({
            marginTop: top,
            marginRight: right,
            marginBottom: bottom,
            marginLeft: left
        })
    }
}

const SCREENS = [
    {
        title: 'Ngarkimi i dokumentit',
        subTitle: 'Ngarkoni dokumentin që dëshironi të procesoni.',
        index: 0
    },
    {
        title: 'Përkthimi',
        subTitle: 'Kontrolloni rezultatet e gjeneruara nga asistenti AI.',
        index: 1
    },
    {
        title: 'Përmbledhja',
        subTitle: 'Përfundoni procesin.',
        index: 2
    }
]

const DESCRIPTIONS = {
    '0': 'Origjinali',
    '1': 'Përkthimi'
}


export {
    spaces,
    SCREENS,
    DESCRIPTIONS
}