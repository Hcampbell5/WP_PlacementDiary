const data = [];

data.push({
    usrID: 'abc',
    id: '00000001',
    date: '01/04',
    work: 'created a github repository',
    xp: 'how to use github frameworks',
    competencies: ['B3', 'B4', 'E1' ],
});

data.push({
    usrID: 'abc',
    id: '00000002',
    date: '02/04',
    work: 'started web programming cw',
    xp: 'full stack development',
    competencies: ['E2', 'E5', 'D1', 'A2'],
});

data.push({
    usrID: 'abc',
    id: '00000003',
    date: '03/04',
    work: 'started web programming cw',
    xp: 'full stack development',
    competencies: ['A1', 'A2', 'B3' ],
});

data.push({
    usrID: 'abc',
    id: '00000004',
    date: '04/04',
    work: 'started web programming cw',
    xp: 'full stack development',
    competencies: ['B4', 'C3'],
});


export function getEntry(id) {
    return data.find(entry => entry.id === id);
}


export function getUserEntries(usrID) {
    return data.filter(entry => entry.usrID === usrID);
}

